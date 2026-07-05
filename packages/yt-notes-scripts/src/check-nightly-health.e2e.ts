import { afterAll, beforeAll, describe, expect, test } from "bun:test"

import { fetchRepeatedFailures } from "./check-nightly-health"
import { prisma } from "./db"

const E2E_VIDEO_ID = "__test_morning_check__"
const E2E_CHANNEL_ID = "__test_channel__"

describe("check-nightly-health e2e (echte DB)", () => {
  beforeAll(async () => {
    // Setup: Test-Channel + Video + Transcript mit consecutive_failure_count=2
    await prisma.channel.upsert({
      where: { id: E2E_CHANNEL_ID },
      create: { id: E2E_CHANNEL_ID, name: "Test", classification: "arbeit" },
      update: {},
    })
    await prisma.video.upsert({
      where: { youtubeId: E2E_VIDEO_ID },
      create: {
        youtubeId: E2E_VIDEO_ID,
        title: "E2E Test Video",
        channelId: E2E_CHANNEL_ID,
        updatedAt: new Date(),
      },
      update: {},
    })
    await prisma.transcript.upsert({
      where: { youtubeId: E2E_VIDEO_ID },
      create: {
        youtubeId: E2E_VIDEO_ID,
        auditStatus: "error_pass1",
        consecutiveFailureCount: 2,
        firstErroredAt: new Date("2026-06-13T03:00:00Z"),
        lastErroredAt: new Date("2026-06-15T03:00:00Z"),
        auditError: "e2e-test-error",
        updatedAt: new Date(),
      },
      update: {
        auditStatus: "error_pass1",
        consecutiveFailureCount: 2,
        firstErroredAt: new Date("2026-06-13T03:00:00Z"),
        lastErroredAt: new Date("2026-06-15T03:00:00Z"),
        auditError: "e2e-test-error",
      },
    })
  })

  afterAll(async () => {
    await prisma.transcript
      .delete({ where: { youtubeId: E2E_VIDEO_ID } })
      .catch(() => {})
    await prisma.video
      .delete({ where: { youtubeId: E2E_VIDEO_ID } })
      .catch(() => {})
    await prisma.channel
      .delete({ where: { id: E2E_CHANNEL_ID } })
      .catch(() => {})
    await prisma.$disconnect()
  })

  test("fetchRepeatedFailures findet das Test-Video", async () => {
    const failures = await fetchRepeatedFailures(prisma)
    const match = failures.find((f) => f.youtubeId === E2E_VIDEO_ID)
    expect(match).toBeDefined()
    expect(match?.consecutiveFailureCount).toBe(2)
    expect(match?.title).toBe("E2E Test Video")
  })
})
