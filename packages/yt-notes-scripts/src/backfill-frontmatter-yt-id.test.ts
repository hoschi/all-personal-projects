/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test, mock, beforeEach } from "bun:test"
import { backfillFrontmatterYtId } from "./backfill-frontmatter-yt-id"

// Tests nutzen Dependency-Injection statt mock.module(), weil
// mock.module() in Bun **global** über alle Test-Files im selben
// `bun test`-Run wirkt. mock.module("./db", ...) würde z.B.
// recompute-plain-from-srt.test.ts brechen (nutzt echten Prisma-Client);
// mock.module("./git-commit-helper", ...) würde git-commit-helper.test.ts
// brechen (testet echte commitFile-Funktion). Die DI-Hooks in
// backfillFrontmatterYtId(opts) bleiben isoliert auf dieses File.

function makeMockPrisma(rows: any[]) {
  return {
    transcript: {
      findMany: mock(async () => rows),
    },
  } as any
}

function makeRow(
  overrides: Partial<{
    youtubeId: string
    filePath: string
    rootPath: string
  }> = {},
) {
  return {
    youtubeId: overrides.youtubeId ?? "abc123",
    auditStatus: "ok",
    video: {
      youtubeId: overrides.youtubeId ?? "abc123",
      noteLinks: [
        {
          filePath: overrides.filePath ?? "youtube/Chan/Title.md",
          vaultRef: { rootPath: overrides.rootPath ?? "/fake/vault" },
        },
      ],
    },
  }
}

const readMock = mock(
  async (_path: string, _enc: "utf-8") => "---\ntitle: Title\n---\n\n# Body",
)
const writeMock = mock(
  async (_path: string, _data: string, _enc: "utf-8") => undefined,
)
const commitMock = mock(async (_root: string, _rel: string, _msg: string) => ({
  committed: true,
}))
const existsMock = mock((_path: string) => true)

beforeEach(() => {
  readMock.mockClear()
  readMock.mockImplementation(async () => "---\ntitle: Title\n---\n\n# Body")
  writeMock.mockClear()
  commitMock.mockClear()
  existsMock.mockClear()
  existsMock.mockImplementation(() => true)
})

describe("backfillFrontmatterYtId", () => {
  test("setzt youtube_id wenn nicht vorhanden", async () => {
    const prisma = makeMockPrisma([makeRow()])
    const result = await backfillFrontmatterYtId({
      dryRun: false,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.edited).toBe(1)
    expect(result.skipped).toBe(0)
    expect(result.errored).toBe(0)
    const written = writeMock.mock.calls[0]?.[1] as string
    expect(written).toContain("youtube_id: abc123")
    expect(commitMock).toHaveBeenCalledTimes(1)
  })

  test("idempotent — skippt wenn youtube_id schon gesetzt", async () => {
    readMock.mockImplementationOnce(
      async () => "---\ntitle: Title\nyoutube_id: abc123\n---\n\n# Body",
    )
    const prisma = makeMockPrisma([makeRow()])
    const result = await backfillFrontmatterYtId({
      dryRun: false,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.edited).toBe(0)
    expect(result.skipped).toBe(1)
    expect(result.errored).toBe(0)
    expect(writeMock).not.toHaveBeenCalled()
    expect(commitMock).not.toHaveBeenCalled()
  })

  test("--dry-run macht keinen Write", async () => {
    const prisma = makeMockPrisma([makeRow()])
    const result = await backfillFrontmatterYtId({
      dryRun: true,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.edited).toBe(1)
    expect(writeMock).not.toHaveBeenCalled()
    expect(commitMock).not.toHaveBeenCalled()
  })

  test("skipped — kein passender note_link/Stub (verwaister Audit-Eintrag)", async () => {
    // Verwaister Audit-Eintrag: audit_status='ok' aber kein note_link mit
    // existierendem Stub. Aus Backfill-Sicht: nichts zu backfillen →
    // skipped, nicht errored (Pre-existing Daten-Lücke, kein
    // Backfill-Fehler).
    const row = makeRow()
    row.video.noteLinks = []
    const prisma = makeMockPrisma([row])
    const result = await backfillFrontmatterYtId({
      dryRun: false,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.skipped).toBe(1)
    expect(result.errored).toBe(0)
    expect(result.edited).toBe(0)
    expect(writeMock).not.toHaveBeenCalled()
    expect(commitMock).not.toHaveBeenCalled()
  })

  test("errored — readFile wirft", async () => {
    readMock.mockImplementationOnce(async () => {
      throw new Error("disk full")
    })
    const prisma = makeMockPrisma([makeRow()])
    const result = await backfillFrontmatterYtId({
      dryRun: false,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.errored).toBe(1)
    expect(result.edited).toBe(0)
    expect(writeMock).not.toHaveBeenCalled()
    expect(commitMock).not.toHaveBeenCalled()
  })

  test("errored — korruptes YAML wird nicht überschrieben", async () => {
    // parseStub liefert für korruptes YAML still {frontmatter: {}, body: md}.
    // Ohne den Guard in backfillFrontmatterYtId würde setFrontmatterFields
    // die kaputten Felder durch nur `youtube_id` ersetzen (Daten-Verlust).
    readMock.mockImplementationOnce(
      async () => "---\nkey: [unclosed\n---\n# Body",
    )
    const prisma = makeMockPrisma([makeRow()])
    const result = await backfillFrontmatterYtId({
      dryRun: false,
      prisma,
      readFile: readMock,
      writeFile: writeMock,
      commitFile: commitMock,
      fileExists: existsMock,
    })
    expect(result.errored).toBe(1)
    expect(result.edited).toBe(0)
    expect(writeMock).not.toHaveBeenCalled()
    expect(commitMock).not.toHaveBeenCalled()
  })
})
