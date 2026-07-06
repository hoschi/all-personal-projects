import { test, expect, beforeEach, afterEach } from "bun:test"
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
  existsSync,
  readFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { PrismaClient } from "./generated/prisma/client"

// Wir mocken den Prisma-Client minimal — nur die note_link-API,
// die createStubFile braucht. findFirst und upsert teilen sich einen
// In-Memory-Store, damit die Kollisions-Erkennung (findFirst sieht die zuvor
// per upsert geschriebenen Rows) realistisch abläuft.
interface NoteLinkRow {
  youtubeId: string
  vault: string
  filePath: string
  title?: string | null
}
interface UpsertArgs {
  where: {
    youtubeId_vault_filePath: {
      youtubeId: string
      vault: string
      filePath: string
    }
  }
  create: NoteLinkRow
}
const noteLinkRows: NoteLinkRow[] = []
const noteLinkUpserts: Array<UpsertArgs> = []
const fakePrisma = {
  noteLink: {
    findFirst: async (args: {
      where: { vault: string; filePath: string }
    }): Promise<NoteLinkRow | null> => {
      const { vault, filePath } = args.where
      return (
        noteLinkRows.find(
          (row) => row.vault === vault && row.filePath === filePath,
        ) ?? null
      )
    },
    upsert: async (args: UpsertArgs) => {
      noteLinkUpserts.push(args)
      const key = args.where.youtubeId_vault_filePath
      const existing = noteLinkRows.find(
        (row) =>
          row.youtubeId === key.youtubeId &&
          row.vault === key.vault &&
          row.filePath === key.filePath,
      )
      if (!existing) noteLinkRows.push(args.create)
      return { id: 1 }
    },
  },
} as unknown as PrismaClient

import { createStubFile, type CreateStubInput } from "./stub-creation"

function makeVideo(
  overrides: Partial<CreateStubInput["video"]> = {},
): CreateStubInput["video"] {
  return {
    youtubeId: "abc123XYZ-1",
    title: "Test Video Title",
    channel: { name: "Test Channel" },
    ...overrides,
  }
}

let vaultRoot: string
let templatePath: string

beforeEach(() => {
  vaultRoot = mkdtempSync(join(tmpdir(), "stub-test-"))
  templatePath = join(vaultRoot, "template.md")
  writeFileSync(
    templatePath,
    `---
title: {{title}}
youtubeUrl: {{youtubeUrl}}
channelName: {{channelName}}
---

# {{title}}

`,
    "utf-8",
  )
  noteLinkUpserts.length = 0
  noteLinkRows.length = 0
})

afterEach(() => {
  rmSync(vaultRoot, { recursive: true, force: true })
})

test("erzeugt MD-Datei mit gefilltem Template", async () => {
  const result = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo(),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  expect(result.relPath).toBe("youtube/Test Channel/Test Video Title.md")
  expect(existsSync(result.absPath)).toBe(true)
  const content = readFileSync(result.absPath, "utf-8")
  expect(content).toContain("title: Test Video Title")
  expect(content).toContain("channelName: Test Channel")
  expect(content).toContain("# Test Video Title")
})

test("schreibt note_link-Eintrag in DB", async () => {
  await createStubFile({
    prisma: fakePrisma,
    video: makeVideo(),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  expect(noteLinkUpserts).toHaveLength(1)
  const upsert = noteLinkUpserts[0]
  expect(upsert.where.youtubeId_vault_filePath.youtubeId).toBe("abc123XYZ-1")
  expect(upsert.where.youtubeId_vault_filePath.vault).toBe(
    "stefans-vault/shared",
  )
})

test("ist idempotent — zweiter Aufruf überschreibt nicht", async () => {
  const result1 = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo(),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  writeFileSync(result1.absPath, "USER EDIT", "utf-8")
  const result2 = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo(),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  expect(result2.relPath).toBe(result1.relPath)
  expect(readFileSync(result2.absPath, "utf-8")).toBe("USER EDIT")
})

test("rendert publishDate aus publishedAt", async () => {
  writeFileSync(
    templatePath,
    `---\npublish_date: {{publishDate}}\n---\n`,
    "utf-8",
  )
  const result = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo({
      title: "Date Test Video",
      publishedAt: new Date("2024-03-15T10:00:00Z"),
    }),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const content = readFileSync(result.absPath, "utf-8")
  expect(content).toContain("publish_date: 2024-03-15")
})

test("publishDate ist leer bei publishedAt=null", async () => {
  writeFileSync(
    templatePath,
    `---\npublish_date: {{publishDate}}\n---\n`,
    "utf-8",
  )
  const result = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo({
      youtubeId: "abc123XYZ-2",
      title: "No Date Video",
      publishedAt: null,
    }),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const content = readFileSync(result.absPath, "utf-8")
  expect(content).toContain("publish_date: \n")
})

test("youtubeUrl hat watch?v= Format", async () => {
  writeFileSync(templatePath, `{{youtubeUrl}}`, "utf-8")
  const result = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo({
      title: "URL Format Test",
    }),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const content = readFileSync(result.absPath, "utf-8")
  expect(content).toBe("https://www.youtube.com/watch?v=abc123XYZ-1")
})

test("sanitisiert Filenames mit Slashes/Doppelpunkten", async () => {
  const result = await createStubFile({
    prisma: fakePrisma,
    video: makeVideo({
      title: "Title: with / forbidden \\ chars?",
    }),
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  // Pfad hat genau 3 Segmente: youtube/<channel>/<filename>
  // Außer den Pfad-Slashes (Segmenttrennern) darf der Dateiname keine
  // verbotenen Zeichen enthalten.
  const parts = result.relPath.split("/")
  expect(parts).toHaveLength(3)
  expect(parts[0]).toBe("youtube")
  expect(parts[2]).not.toMatch(/[:/\\?]/)
})

test("kollision: zweites Video mit gleichem Titel+Channel bekommt eigenen Pfad", async () => {
  const videoA = makeVideo({
    youtubeId: "collideAAA-1",
    title: "Same Title",
    channel: { name: "Same Channel" },
  })
  const videoB = makeVideo({
    youtubeId: "collideBBB-2",
    title: "Same Title",
    channel: { name: "Same Channel" },
  })

  const resultA = await createStubFile({
    prisma: fakePrisma,
    video: videoA,
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const resultB = await createStubFile({
    prisma: fakePrisma,
    video: videoB,
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })

  // Erstes (eindeutiges) Video behält den unsuffixierten Pfad.
  expect(resultA.relPath).toBe("youtube/Same Channel/Same Title.md")
  // Zweites Video weicht auf <title>-<youtubeId>.md aus.
  expect(resultB.relPath).toBe(
    "youtube/Same Channel/Same Title-collideBBB-2.md",
  )
  expect(resultB.relPath).not.toBe(resultA.relPath)

  // Beide Dateien existieren getrennt und tragen ihren eigenen Inhalt.
  expect(existsSync(resultA.absPath)).toBe(true)
  expect(existsSync(resultB.absPath)).toBe(true)
  expect(readFileSync(resultA.absPath, "utf-8")).toContain(
    "watch?v=collideAAA-1",
  )
  expect(readFileSync(resultB.absPath, "utf-8")).toContain(
    "watch?v=collideBBB-2",
  )

  // Zwei getrennte note_link-Rows, je eine pro youtubeId, jeweils auf den
  // eigenen filePath zeigend.
  expect(noteLinkUpserts).toHaveLength(2)
  expect(noteLinkUpserts[0].where.youtubeId_vault_filePath).toMatchObject({
    youtubeId: "collideAAA-1",
    filePath: "youtube/Same Channel/Same Title.md",
  })
  expect(noteLinkUpserts[1].where.youtubeId_vault_filePath).toMatchObject({
    youtubeId: "collideBBB-2",
    filePath: "youtube/Same Channel/Same Title-collideBBB-2.md",
  })
})

test("kollision ist idempotent — erneuter Lauf für dieselbe youtubeId doppel-suffixt nicht", async () => {
  const videoA = makeVideo({
    youtubeId: "dupAAA-1",
    title: "Dup Title",
    channel: { name: "Dup Channel" },
  })
  const videoB = makeVideo({
    youtubeId: "dupBBB-2",
    title: "Dup Title",
    channel: { name: "Dup Channel" },
  })

  await createStubFile({
    prisma: fakePrisma,
    video: videoA,
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const first = await createStubFile({
    prisma: fakePrisma,
    video: videoB,
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })
  const second = await createStubFile({
    prisma: fakePrisma,
    video: videoB,
    vaultRoot,
    vaultName: "stefans-vault/shared",
    templatePath,
  })

  expect(first.relPath).toBe("youtube/Dup Channel/Dup Title-dupBBB-2.md")
  // Zweiter Lauf löst auf denselben (bereits suffixierten) Pfad auf, ohne
  // einen weiteren -<youtubeId>-Suffix anzuhängen.
  expect(second.relPath).toBe(first.relPath)
})
