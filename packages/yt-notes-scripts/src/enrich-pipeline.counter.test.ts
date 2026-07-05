/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, mock } from "bun:test"
import { updateAuditStatus } from "./enrich-pipeline"

// DI-Pattern aus backfill-frontmatter-yt-id.test.ts übernommen:
// mock.module() würde global im selben bun-test-Run wirken und andere
// Tests brechen.

function makeMockPrisma(currentRow: {
  auditStatus: string
  consecutiveFailureCount: number
  firstErroredAt: Date | null
}) {
  const updateCalls: any[] = []
  return {
    transcript: {
      findUniqueOrThrow: mock(async () => currentRow),
      update: mock(async (args: any) => {
        updateCalls.push(args)
        return args.data
      }),
    },
    _calls: { updateCalls },
  } as any
}

test("Übergang 1: pending → error_pass1 setzt counter=1, first/last erstmals", async () => {
  const prisma = makeMockPrisma({
    auditStatus: "pending",
    consecutiveFailureCount: 0,
    firstErroredAt: null,
  })
  await updateAuditStatus(prisma, "yt-id-1", "error_pass1", {
    auditError: "boom",
    auditRunId: "run-1",
  })
  const call = prisma._calls.updateCalls[0]
  expect(call.data.auditStatus).toBe("error_pass1")
  expect(call.data.consecutiveFailureCount).toBe(1)
  expect(call.data.firstErroredAt).toBeInstanceOf(Date)
  expect(call.data.lastErroredAt).toBeInstanceOf(Date)
  expect(call.data.firstErroredAt).toEqual(call.data.lastErroredAt)
})

test("Übergang 2: error_pass1 → error_pass1 inkrementiert counter, first unverändert, last neu", async () => {
  const firstAt = new Date("2026-06-14T10:00:00Z")
  const prisma = makeMockPrisma({
    auditStatus: "error_pass1",
    consecutiveFailureCount: 2,
    firstErroredAt: firstAt,
  })
  await updateAuditStatus(prisma, "yt-id-1", "error_pass1", {
    auditError: "still broken",
    auditRunId: "run-2",
  })
  const call = prisma._calls.updateCalls[0]
  expect(call.data.consecutiveFailureCount).toBe(3)
  expect(call.data.firstErroredAt).toBe(firstAt)
  expect(call.data.lastErroredAt).not.toBe(firstAt)
  expect(call.data.lastErroredAt.getTime()).toBeGreaterThan(firstAt.getTime())
})

test("Übergang 3: error_pass1 → ok resettet counter und nullt Timestamps", async () => {
  const prisma = makeMockPrisma({
    auditStatus: "error_pass1",
    consecutiveFailureCount: 3,
    firstErroredAt: new Date("2026-06-14T10:00:00Z"),
  })
  await updateAuditStatus(prisma, "yt-id-1", "ok", {
    auditError: null,
    auditRunId: "run-3",
  })
  const call = prisma._calls.updateCalls[0]
  expect(call.data.auditStatus).toBe("ok")
  expect(call.data.consecutiveFailureCount).toBe(0)
  expect(call.data.firstErroredAt).toBeNull()
  expect(call.data.lastErroredAt).toBeNull()
})

test("Übergang 4: error_pass1 → critical_ok lässt counter + Timestamps unverändert", async () => {
  const firstAt = new Date("2026-06-14T10:00:00Z")
  const prisma = makeMockPrisma({
    auditStatus: "error_pass1",
    consecutiveFailureCount: 2,
    firstErroredAt: firstAt,
  })
  await updateAuditStatus(prisma, "yt-id-1", "critical_ok", {})
  const call = prisma._calls.updateCalls[0]
  expect(call.data.auditStatus).toBe("critical_ok")
  expect(call.data.consecutiveFailureCount).toBeUndefined()
  expect(call.data.firstErroredAt).toBeUndefined()
  expect(call.data.lastErroredAt).toBeUndefined()
})

test("Übergang 5: ok → error_pass1 setzt counter=1, first/last erstmals", async () => {
  const prisma = makeMockPrisma({
    auditStatus: "ok",
    consecutiveFailureCount: 0,
    firstErroredAt: null,
  })
  await updateAuditStatus(prisma, "yt-id-1", "error_pass1", {
    auditError: "regression",
    auditRunId: "run-5",
  })
  const call = prisma._calls.updateCalls[0]
  expect(call.data.consecutiveFailureCount).toBe(1)
  expect(call.data.firstErroredAt).toBeInstanceOf(Date)
  expect(call.data.lastErroredAt).toBeInstanceOf(Date)
})

test("Übergang 6: error_pass1 → pending lässt counter + Timestamps unverändert (Retry-Setup)", async () => {
  const firstAt = new Date("2026-06-14T10:00:00Z")
  const prisma = makeMockPrisma({
    auditStatus: "error_pass1",
    consecutiveFailureCount: 2,
    firstErroredAt: firstAt,
  })
  await updateAuditStatus(prisma, "yt-id-1", "pending", {})
  const call = prisma._calls.updateCalls[0]
  expect(call.data.auditStatus).toBe("pending")
  expect(call.data.consecutiveFailureCount).toBeUndefined()
  expect(call.data.firstErroredAt).toBeUndefined()
  expect(call.data.lastErroredAt).toBeUndefined()
})
