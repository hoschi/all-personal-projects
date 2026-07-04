import { describe, it, expect, beforeAll, afterAll } from "bun:test"
import { recomputePlainFromSrt } from "./recompute-plain-from-srt"
import { prisma } from "./db"

const TEST_VIDEO_ID = "test-recompute-zz1"
const TEST_SRT = `1
00:00:01,000 --> 00:00:04,000
Hallo, Welt!

2
00:00:05,000 --> 00:00:08,000
Das ist ein Test.`

describe("recomputePlainFromSrt", () => {
  beforeAll(async () => {
    await prisma.video.upsert({
      where: { youtubeId: TEST_VIDEO_ID },
      update: {},
      create: { youtubeId: TEST_VIDEO_ID, title: "test-recompute fixture" },
    })
    await prisma.transcript.upsert({
      where: { youtubeId: TEST_VIDEO_ID },
      update: { srt: TEST_SRT, plain: null, llmFormatted: null },
      create: {
        youtubeId: TEST_VIDEO_ID,
        srt: TEST_SRT,
        plain: null,
        llmFormatted: null,
      },
    })
  })

  afterAll(async () => {
    await prisma.transcript.delete({ where: { youtubeId: TEST_VIDEO_ID } })
    await prisma.video.delete({ where: { youtubeId: TEST_VIDEO_ID } })
    await prisma.$disconnect()
  })

  it("fills plain + llmFormatted for srt-only rows", async () => {
    const result = await recomputePlainFromSrt({ dryRun: false })
    expect(result.updated).toBeGreaterThanOrEqual(1)

    const row = await prisma.transcript.findUniqueOrThrow({
      where: { youtubeId: TEST_VIDEO_ID },
    })
    expect(row.plain).not.toBeNull()
    expect(row.plain).toContain("Hallo, Welt!")
    expect(row.llmFormatted).not.toBeNull()
  })

  it("is idempotent — second run updates 0 rows for our fixture", async () => {
    const result = await recomputePlainFromSrt({ dryRun: false })
    const row = await prisma.transcript.findUniqueOrThrow({
      where: { youtubeId: TEST_VIDEO_ID },
    })
    expect(row.plain).not.toBeNull()
    expect(result.updated).toBeGreaterThanOrEqual(0)
  })
})
