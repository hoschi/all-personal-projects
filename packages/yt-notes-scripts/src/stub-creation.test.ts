import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
  existsSync,
  readFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

// Wir mocken den Prisma-Client minimal — nur die note_link-API,
// die createStubFile braucht.
const noteLinkUpserts: Array<unknown> = []
const fakePrisma = {
  noteLink: {
    upsert: async (args: unknown) => {
      noteLinkUpserts.push(args)
      return { id: 1 }
    },
  },
} as never

import { createStubFile } from "./stub-creation"

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
})

afterEach(() => {
  rmSync(vaultRoot, { recursive: true, force: true })
})

describe("createStubFile", () => {
  it("erzeugt MD-Datei mit gefilltem Template", async () => {
    const result = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Test Video Title",
        channel: { name: "Test Channel" },
      },
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

  it("schreibt note_link-Eintrag in DB", async () => {
    await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Test Video Title",
        channel: { name: "Test Channel" },
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    expect(noteLinkUpserts).toHaveLength(1)
    const upsert = noteLinkUpserts[0] as {
      where: {
        youtubeId_vault_filePath: {
          youtubeId: string
          vault: string
          filePath: string
        }
      }
    }
    expect(upsert.where.youtubeId_vault_filePath.youtubeId).toBe("abc123XYZ-1")
    expect(upsert.where.youtubeId_vault_filePath.vault).toBe(
      "stefans-vault/shared",
    )
  })

  it("ist idempotent — zweiter Aufruf überschreibt nicht", async () => {
    const result1 = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Test Video Title",
        channel: { name: "Test Channel" },
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    writeFileSync(result1.absPath, "USER EDIT", "utf-8")
    const result2 = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Test Video Title",
        channel: { name: "Test Channel" },
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    expect(result2.relPath).toBe(result1.relPath)
    expect(readFileSync(result2.absPath, "utf-8")).toBe("USER EDIT")
  })

  it("rendert publishDate aus publishedAt", async () => {
    writeFileSync(
      templatePath,
      `---\npublish_date: {{publishDate}}\n---\n`,
      "utf-8",
    )
    const result = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Date Test Video",
        channel: { name: "Test Channel" },
        publishedAt: new Date("2024-03-15T10:00:00Z"),
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    const content = readFileSync(result.absPath, "utf-8")
    expect(content).toContain("publish_date: 2024-03-15")
  })

  it("publishDate ist leer bei publishedAt=null", async () => {
    writeFileSync(
      templatePath,
      `---\npublish_date: {{publishDate}}\n---\n`,
      "utf-8",
    )
    const result = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-2",
        title: "No Date Video",
        channel: { name: "Test Channel" },
        publishedAt: null,
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    const content = readFileSync(result.absPath, "utf-8")
    expect(content).toContain("publish_date: \n")
  })

  it("youtubeUrl hat watch?v= Format", async () => {
    writeFileSync(templatePath, `{{youtubeUrl}}`, "utf-8")
    const result = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "URL Format Test",
        channel: { name: "Test Channel" },
      },
      vaultRoot,
      vaultName: "stefans-vault/shared",
      templatePath,
    })
    const content = readFileSync(result.absPath, "utf-8")
    expect(content).toBe("https://www.youtube.com/watch?v=abc123XYZ-1")
  })

  it("sanitisiert Filenames mit Slashes/Doppelpunkten", async () => {
    const result = await createStubFile({
      prisma: fakePrisma,
      video: {
        youtubeId: "abc123XYZ-1",
        title: "Title: with / forbidden \\ chars?",
        channel: { name: "Test Channel" },
      },
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
})
