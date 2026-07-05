import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { z } from "zod"

import {
  createTabInputSchema,
  deleteTabInputSchema,
  deleteTabResultSchema,
  moveTopTextToBottomInputSchema,
  overwriteClientInputSchema,
  overwriteServerInputSchema,
  renameTabInputSchema,
  syncCursorSchema,
  tabIdSchema,
  tabListItemSchema,
  tabModeSchema,
  tabSnapshotSchema,
  tabWriteResultSchema,
  updateTabFieldInputSchema,
  upsertSyncCursorInputSchema,
  type MoveTopTextToBottomInput,
  type OverwriteClientInput,
  type TabSnapshot,
  type TabSyncField,
  type TabWriteResult,
  type UpdateTabFieldInput,
} from "@/contracts/tab-sync"
import { prisma } from "@/data/prisma"
import { prisma as ytPrisma } from "@repo/yt-notes-scripts/db"
import type { TabModel } from "@/generated/prisma/models/Tab"

const clientIdSchema = z.string().trim().min(1)
const selectTabInputSchema = z.object({
  tabId: tabIdSchema,
  clientId: clientIdSchema,
})

const listTabsResultSchema = z.array(tabListItemSchema)
const selectTabResultSchema = tabSnapshotSchema.nullable()
const upsertSyncCursorResultSchema = syncCursorSchema.nullable()

export function toTabSnapshot(tab: TabModel): TabSnapshot {
  return {
    id: tab.id,
    title: tab.title,
    topText: tab.topText,
    bottomText: tab.bottomText,
    titleVersion: tab.titleVersion,
    topTextVersion: tab.topTextVersion,
    bottomTextVersion: tab.bottomTextVersion,
    titleUpdatedAt: tab.titleUpdatedAt.toISOString(),
    topTextUpdatedAt: tab.topTextUpdatedAt.toISOString(),
    bottomTextUpdatedAt: tab.bottomTextUpdatedAt.toISOString(),
    createdAt: tab.createdAt.toISOString(),
    updatedAt: tab.updatedAt.toISOString(),
    mode: tab.mode,
    youtubeId: tab.youtubeId,
    youtubeReused: tab.youtubeReused,
  }
}

// Lazy-enriches a tab snapshot with read-only yt.* fields (displayTitle,
// transcript status). Required for every snapshot returned to the client —
// otherwise the client state would lose ytDisplayTitle on the next field-update
// response and the 🎬-badge would fall back to the raw youtubeId.
//
// createServerOnlyFn hält den ytPrisma-Zugriff innerhalb einer vom
// Start-Compiler erkannten Server-Boundary: Der Body wird im Client-Build durch
// einen Throw-Stub ersetzt und der `@repo/yt-notes-scripts/db`-Import (→ pg
// adapter + @prisma/client-Runtime mit node:*-Builtins) samt Chunk entfernt.
// enrichTabSnapshot ist ein exportierter Helper, der aus dem Modulgraph
// erreichbar ist — ohne den Wrapper landet der Prisma-Client im Browser-Bundle
// (ein dynamischer import() verschiebt ihn nur in einen Lazy-Chunk, der im
// Client-Build ebenfalls gebaut wird und an den node:*-Builtins bricht). Siehe
// TanStack-Start "Import Protection" (Common Pitfall: Why Some Imports Stay
// Alive).
export const enrichTabSnapshot = createServerOnlyFn(
  async (tab: TabModel): Promise<TabSnapshot> => {
    const base = toTabSnapshot(tab)
    if (!tab.youtubeId) {
      return base
    }
    const [transcript, video] = await Promise.all([
      ytPrisma.transcript.findUnique({
        where: { youtubeId: tab.youtubeId },
        select: { auditStatus: true, auditError: true },
      }),
      ytPrisma.video.findUnique({
        where: { youtubeId: tab.youtubeId },
        select: { displayTitle: true, title: true },
      }),
    ])
    return {
      ...base,
      ytTranscriptStatus: transcript?.auditStatus ?? null,
      ytTranscriptError: transcript?.auditError ?? null,
      ytDisplayTitle: video?.displayTitle ?? video?.title ?? null,
    }
  },
)

// TODO after v0 features implemented: eval if ts-patterns makes this code better looking and undestandable
function readTabFieldValue(tab: TabModel, field: TabSyncField): string {
  if (field === "title") {
    return tab.title
  }

  if (field === "topText") {
    return tab.topText
  }

  return tab.bottomText
}

function readTabFieldVersion(tab: TabModel, field: TabSyncField): number {
  if (field === "title") {
    return tab.titleVersion
  }

  if (field === "topText") {
    return tab.topTextVersion
  }

  return tab.bottomTextVersion
}

function readTabFieldUpdatedAt(tab: TabModel, field: TabSyncField): Date {
  if (field === "title") {
    return tab.titleUpdatedAt
  }

  if (field === "topText") {
    return tab.topTextUpdatedAt
  }

  return tab.bottomTextUpdatedAt
}

function appendTopTextToBottomText(bottomText: string, topText: string) {
  if (topText.length === 0) {
    return bottomText
  }

  if (bottomText.length === 0) {
    return topText
  }

  if (/\s$/.test(bottomText)) {
    return `${bottomText}${topText}`
  }

  return `${bottomText} ${topText}`
}

async function upsertSyncStateFromTab(params: {
  tab: TabModel
  clientId: string
  lastPulledAt?: Date
  lastPushedAt?: Date
}) {
  const { tab, clientId, lastPulledAt, lastPushedAt } = params

  const syncState = await prisma.tabSyncState.upsert({
    where: {
      tabId_clientId: {
        tabId: tab.id,
        clientId,
      },
    },
    create: {
      tabId: tab.id,
      clientId,
      knownTitleVersion: tab.titleVersion,
      knownTopTextVersion: tab.topTextVersion,
      knownBottomTextVersion: tab.bottomTextVersion,
      lastPulledAt: lastPulledAt ?? new Date(),
      ...(lastPushedAt ? { lastPushedAt } : {}),
    },
    update: {
      knownTitleVersion: tab.titleVersion,
      knownTopTextVersion: tab.topTextVersion,
      knownBottomTextVersion: tab.bottomTextVersion,
      ...(lastPulledAt ? { lastPulledAt } : {}),
      ...(lastPushedAt ? { lastPushedAt } : {}),
    },
  })

  return syncCursorSchema.parse({
    tabId: syncState.tabId,
    clientId: syncState.clientId,
    knownTitleVersion: syncState.knownTitleVersion,
    knownTopTextVersion: syncState.knownTopTextVersion,
    knownBottomTextVersion: syncState.knownBottomTextVersion,
    lastPulledAt: syncState.lastPulledAt.toISOString(),
    lastPushedAt: syncState.lastPushedAt?.toISOString() ?? null,
  })
}

async function createFieldConflictResult(input: {
  tab: TabModel
  field: TabSyncField
  expectedVersion: number
  clientValue: string
}): Promise<TabWriteResult> {
  const { tab, field, expectedVersion, clientValue } = input

  return {
    status: "conflict",
    conflict: {
      field,
      expectedVersion,
      serverVersion: readTabFieldVersion(tab, field),
      clientValue,
      serverValue: readTabFieldValue(tab, field),
      serverUpdatedAt: readTabFieldUpdatedAt(tab, field).toISOString(),
    },
    tab: await enrichTabSnapshot(tab),
  }
}

async function writeTabFieldWithExpectedVersion(
  input: UpdateTabFieldInput,
): Promise<TabWriteResult> {
  const now = new Date()

  // mode has no version-field on the Tab model — skip the optimistic version
  // check entirely. Clients pass a placeholder expectedVersion which is ignored.
  if (input.field === "mode") {
    const parsedMode = tabModeSchema.parse(input.value)

    // updateMany (not findUnique + update) so a delete racing between the
    // existence check and the write yields not_found instead of a thrown P2025.
    const updateResult = await prisma.tab.updateMany({
      where: { id: input.tabId },
      data: { mode: parsedMode },
    })

    if (updateResult.count === 0) {
      return {
        status: "not_found",
        tabId: input.tabId,
      }
    }

    const updatedTab = await prisma.tab.findUnique({
      where: { id: input.tabId },
    })

    if (!updatedTab) {
      return {
        status: "not_found",
        tabId: input.tabId,
      }
    }

    await upsertSyncStateFromTab({
      tab: updatedTab,
      clientId: input.clientId,
      lastPulledAt: now,
      lastPushedAt: now,
    })

    return {
      status: "updated",
      tab: await enrichTabSnapshot(updatedTab),
    }
  }

  let updateResultCount = 0

  if (input.field === "title") {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
        titleVersion: input.expectedVersion,
      },
      data: {
        title: input.value,
        titleVersion: {
          increment: 1,
        },
        titleUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  } else if (input.field === "topText") {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
        topTextVersion: input.expectedVersion,
      },
      data: {
        topText: input.value,
        topTextVersion: {
          increment: 1,
        },
        topTextUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  } else {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
        bottomTextVersion: input.expectedVersion,
      },
      data: {
        bottomText: input.value,
        bottomTextVersion: {
          increment: 1,
        },
        bottomTextUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  }

  const latestTab = await prisma.tab.findUnique({
    where: {
      id: input.tabId,
    },
  })

  if (!latestTab) {
    return {
      status: "not_found",
      tabId: input.tabId,
    }
  }

  if (updateResultCount === 0) {
    return createFieldConflictResult({
      tab: latestTab,
      field: input.field,
      expectedVersion: input.expectedVersion,
      clientValue: input.value,
    })
  }

  await upsertSyncStateFromTab({
    tab: latestTab,
    clientId: input.clientId,
    lastPulledAt: now,
    lastPushedAt: now,
  })

  return {
    status: "updated",
    tab: await enrichTabSnapshot(latestTab),
  }
}

async function moveTopTextToBottom(
  input: MoveTopTextToBottomInput,
): Promise<TabWriteResult> {
  const now = new Date()
  const normalizedTopText = input.topText.trimStart()
  const nextBottomText = appendTopTextToBottomText(
    input.bottomText,
    normalizedTopText,
  )

  const updateResult = await prisma.tab.updateMany({
    where: {
      id: input.tabId,
      topTextVersion: input.topTextExpectedVersion,
      bottomTextVersion: input.bottomTextExpectedVersion,
    },
    data: {
      topText: "",
      topTextVersion: {
        increment: 1,
      },
      topTextUpdatedAt: now,
      bottomText: nextBottomText,
      bottomTextVersion: {
        increment: 1,
      },
      bottomTextUpdatedAt: now,
    },
  })

  const latestTab = await prisma.tab.findUnique({
    where: {
      id: input.tabId,
    },
  })

  if (!latestTab) {
    return {
      status: "not_found",
      tabId: input.tabId,
    }
  }

  if (updateResult.count === 0) {
    const topTextVersionMatched =
      latestTab.topTextVersion === input.topTextExpectedVersion
    const conflictField: TabSyncField = topTextVersionMatched
      ? "bottomText"
      : "topText"

    return createFieldConflictResult({
      tab: latestTab,
      field: conflictField,
      expectedVersion:
        conflictField === "topText"
          ? input.topTextExpectedVersion
          : input.bottomTextExpectedVersion,
      clientValue: conflictField === "topText" ? "" : nextBottomText,
    })
  }

  await upsertSyncStateFromTab({
    tab: latestTab,
    clientId: input.clientId,
    lastPulledAt: now,
    lastPushedAt: now,
  })

  return {
    status: "updated",
    tab: await enrichTabSnapshot(latestTab),
  }
}

async function overwriteTabFieldOnServer(
  input: OverwriteClientInput,
): Promise<TabWriteResult> {
  const now = new Date()

  let updateResultCount = 0

  if (input.field === "title") {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
      },
      data: {
        title: input.value,
        titleVersion: {
          increment: 1,
        },
        titleUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  } else if (input.field === "topText") {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
      },
      data: {
        topText: input.value,
        topTextVersion: {
          increment: 1,
        },
        topTextUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  } else {
    const updateResult = await prisma.tab.updateMany({
      where: {
        id: input.tabId,
      },
      data: {
        bottomText: input.value,
        bottomTextVersion: {
          increment: 1,
        },
        bottomTextUpdatedAt: now,
      },
    })

    updateResultCount = updateResult.count
  }

  if (updateResultCount === 0) {
    return {
      status: "not_found",
      tabId: input.tabId,
    }
  }

  const latestTab = await prisma.tab.findUnique({
    where: {
      id: input.tabId,
    },
  })

  if (!latestTab) {
    return {
      status: "not_found",
      tabId: input.tabId,
    }
  }

  await upsertSyncStateFromTab({
    tab: latestTab,
    clientId: input.clientId,
    lastPulledAt: now,
    lastPushedAt: now,
  })

  return {
    status: "updated",
    tab: await enrichTabSnapshot(latestTab),
  }
}

export const listTabsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const tabs = await prisma.tab.findMany({
      orderBy: [{ createdAt: "asc" }],
    })

    return listTabsResultSchema.parse(
      tabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
        titleVersion: tab.titleVersion,
        titleUpdatedAt: tab.titleUpdatedAt.toISOString(),
        updatedAt: tab.updatedAt.toISOString(),
      })),
    )
  },
)

export const createTabFn = createServerFn({ method: "POST" })
  .inputValidator((data) => createTabInputSchema.parse(data))
  .handler(async ({ data }) => {
    const createdTab = await prisma.$transaction(async (tx) => {
      if (data.title) {
        return await tx.tab.create({
          data: {
            title: data.title,
          },
        })
      }

      const tabCount = await tx.tab.count()

      return await tx.tab.create({
        data: {
          title: `Tab ${tabCount + 1}`,
        },
      })
    })

    return tabSnapshotSchema.parse(await enrichTabSnapshot(createdTab))
  })

export const deleteTabFn = createServerFn({ method: "POST" })
  .inputValidator((data) => deleteTabInputSchema.parse(data))
  .handler(async ({ data }) => {
    const deleteResult = await prisma.tab.deleteMany({
      where: {
        id: data.tabId,
      },
    })

    if (deleteResult.count === 0) {
      return deleteTabResultSchema.parse({
        status: "not_found",
        tabId: data.tabId,
      })
    }

    return deleteTabResultSchema.parse({
      status: "deleted",
      tabId: data.tabId,
    })
  })

export const selectTabFn = createServerFn({ method: "GET" })
  .inputValidator((data) => selectTabInputSchema.parse(data))
  .handler(async ({ data }) => {
    const tab = await prisma.tab.findUnique({
      where: {
        id: data.tabId,
      },
    })

    if (!tab) {
      return selectTabResultSchema.parse(null)
    }

    await upsertSyncStateFromTab({
      tab,
      clientId: data.clientId,
      lastPulledAt: new Date(),
    })

    return selectTabResultSchema.parse(await enrichTabSnapshot(tab))
  })

export const renameTabFn = createServerFn({ method: "POST" })
  .inputValidator((data) => renameTabInputSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await writeTabFieldWithExpectedVersion({
      tabId: data.tabId,
      field: "title",
      value: data.title,
      expectedVersion: data.expectedVersion,
      clientId: data.clientId,
    })

    return tabWriteResultSchema.parse(result)
  })

export const updateTabFieldFn = createServerFn({ method: "POST" })
  .inputValidator((data) => updateTabFieldInputSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await writeTabFieldWithExpectedVersion(data)
    return tabWriteResultSchema.parse(result)
  })

export const moveTopTextToBottomFn = createServerFn({ method: "POST" })
  .inputValidator((data) => moveTopTextToBottomInputSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await moveTopTextToBottom(data)
    return tabWriteResultSchema.parse(result)
  })

export const overwriteServerFn = createServerFn({ method: "POST" })
  .inputValidator((data) => overwriteServerInputSchema.parse(data))
  .handler(async ({ data }) => {
    const tab = await prisma.tab.findUnique({
      where: {
        id: data.tabId,
      },
    })

    if (!tab) {
      return tabWriteResultSchema.parse({
        status: "not_found",
        tabId: data.tabId,
      })
    }

    await upsertSyncStateFromTab({
      tab,
      clientId: data.clientId,
      lastPulledAt: new Date(),
    })

    return tabWriteResultSchema.parse({
      status: "updated",
      tab: await enrichTabSnapshot(tab),
    })
  })

export const overwriteClientFn = createServerFn({ method: "POST" })
  .inputValidator((data) => overwriteClientInputSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await overwriteTabFieldOnServer(data)
    return tabWriteResultSchema.parse(result)
  })

export const upsertSyncCursorFn = createServerFn({ method: "POST" })
  .inputValidator((data) => upsertSyncCursorInputSchema.parse(data))
  .handler(async ({ data }) => {
    const tab = await prisma.tab.findUnique({
      where: {
        id: data.tabId,
      },
    })

    if (!tab) {
      return upsertSyncCursorResultSchema.parse(null)
    }

    const syncCursor = await prisma.tabSyncState.upsert({
      where: {
        tabId_clientId: {
          tabId: data.tabId,
          clientId: data.clientId,
        },
      },
      create: {
        tabId: data.tabId,
        clientId: data.clientId,
        knownTitleVersion: data.knownTitleVersion,
        knownTopTextVersion: data.knownTopTextVersion,
        knownBottomTextVersion: data.knownBottomTextVersion,
        lastPulledAt: new Date(data.lastPulledAt),
        ...(data.lastPushedAt
          ? { lastPushedAt: new Date(data.lastPushedAt) }
          : {}),
      },
      update: {
        knownTitleVersion: data.knownTitleVersion,
        knownTopTextVersion: data.knownTopTextVersion,
        knownBottomTextVersion: data.knownBottomTextVersion,
        lastPulledAt: new Date(data.lastPulledAt),
        ...(data.lastPushedAt
          ? { lastPushedAt: new Date(data.lastPushedAt) }
          : {}),
      },
    })

    return upsertSyncCursorResultSchema.parse({
      tabId: syncCursor.tabId,
      clientId: syncCursor.clientId,
      knownTitleVersion: syncCursor.knownTitleVersion,
      knownTopTextVersion: syncCursor.knownTopTextVersion,
      knownBottomTextVersion: syncCursor.knownBottomTextVersion,
      lastPulledAt: syncCursor.lastPulledAt.toISOString(),
      lastPushedAt: syncCursor.lastPushedAt?.toISOString() ?? null,
    })
  })
