import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import {
  createTabInputSchema,
  deleteTabInputSchema,
  deleteTabResultSchema,
  overwriteClientInputSchema,
  overwriteServerInputSchema,
  renameTabInputSchema,
  syncCursorSchema,
  tabIdSchema,
  tabListItemSchema,
  tabSnapshotSchema,
  tabWriteResultSchema,
  updateTabFieldInputSchema,
  upsertSyncCursorInputSchema,
  type OverwriteClientInput,
  type TabSnapshot,
  type TabSyncField,
  type TabWriteResult,
  type UpdateTabFieldInput,
} from "@/contracts/tab-sync"
import { prisma } from "@/data/prisma"
import type { TabModel } from "@/generated/prisma/models/Tab"

const clientIdSchema = z.string().trim().min(1)
const selectTabInputSchema = z.object({
  tabId: tabIdSchema,
  clientId: clientIdSchema,
})

const listTabsResultSchema = z.array(tabListItemSchema)
const selectTabResultSchema = tabSnapshotSchema.nullable()
const upsertSyncCursorResultSchema = syncCursorSchema.nullable()

function toTabSnapshot(tab: TabModel): TabSnapshot {
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
  }
}

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

function createFieldConflictResult(input: {
  tab: TabModel
  field: TabSyncField
  expectedVersion: number
  clientValue: string
}): TabWriteResult {
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
    tab: toTabSnapshot(tab),
  }
}

async function writeTabFieldWithExpectedVersion(
  input: UpdateTabFieldInput,
): Promise<TabWriteResult> {
  const now = new Date()

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
    tab: toTabSnapshot(latestTab),
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
    tab: toTabSnapshot(latestTab),
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

    return tabSnapshotSchema.parse(toTabSnapshot(createdTab))
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

    return selectTabResultSchema.parse(toTabSnapshot(tab))
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
      tab: toTabSnapshot(tab),
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
