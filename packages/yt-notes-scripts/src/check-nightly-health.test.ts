import { describe, expect, mock, test } from "bun:test"
import type { PrismaClient } from "./generated/prisma/client"
import {
  classifyJobHealth,
  fetchRepeatedFailures,
  formatReport,
  parseLastNightlyRun,
  type NightlyRunStatus,
} from "./check-nightly-health"

const SAMPLE_LOG = `
[yt-pipeline-nightly] start 2026-06-14 03:00:05 CEST
... stuff ...
[yt-pipeline-nightly] end 2026-06-14 07:00:27 CEST  step1=0 step2=0 step3=0 step4=0
[yt-pipeline-nightly] start 2026-06-15 03:00:05 CEST
... stuff ...
[yt-pipeline-nightly] end 2026-06-15 05:00:37 CEST  step1=0 step2=0 step3=0 step4=0
`

describe("parseLastNightlyRun", () => {
  test("findet letzten end-Marker mit Step-Exits", () => {
    const result = parseLastNightlyRun(SAMPLE_LOG)
    expect(result.kind).toBe("ended")
    if (result.kind !== "ended") return
    expect(result.endTime).toBe("2026-06-15 05:00:37 CEST")
    expect(result.steps).toEqual({ step1: 0, step2: 0, step3: 0, step4: 0 })
  })

  test("erkennt start ohne folgendes end als 'hanging'", () => {
    const log = `
[yt-pipeline-nightly] start 2026-06-15 03:00:05 CEST
... stuff but no end ...
`
    const result = parseLastNightlyRun(log)
    expect(result.kind).toBe("hanging")
    if (result.kind !== "hanging") return
    expect(result.startTime).toBe("2026-06-15 03:00:05 CEST")
  })

  test("leeres Log → 'no-run'", () => {
    const result = parseLastNightlyRun("")
    expect(result.kind).toBe("no-run")
  })

  test("parst non-zero Step-Exits korrekt", () => {
    const log = `
[yt-pipeline-nightly] start 2026-06-15 03:00:05 CEST
[yt-pipeline-nightly] end 2026-06-15 05:00:37 CEST  step1=0 step2=2 step3=0 step4=1
`
    const result = parseLastNightlyRun(log)
    expect(result.kind).toBe("ended")
    if (result.kind !== "ended") return
    expect(result.steps).toEqual({ step1: 0, step2: 2, step3: 0, step4: 1 })
  })

  test("start nach letztem end → 'hanging' (nicht 'ended')", () => {
    const log = `
[yt-pipeline-nightly] start 2026-06-14 03:00:05 CEST
... stuff ...
[yt-pipeline-nightly] end 2026-06-14 07:00:27 CEST  step1=0 step2=0 step3=0 step4=0
[yt-pipeline-nightly] start 2026-06-15 03:00:05 CEST
... stuff but no end yet ...
`
    const result = parseLastNightlyRun(log)
    expect(result.kind).toBe("hanging")
    if (result.kind !== "hanging") return
    expect(result.startTime).toBe("2026-06-15 03:00:05 CEST")
  })
})

describe("classifyJobHealth", () => {
  test("ended heute mit allen Steps exit=0 → ok", () => {
    const today = new Date("2026-06-15T08:00:00Z")
    const status: NightlyRunStatus = {
      kind: "ended",
      endTime: "2026-06-15 05:00:37 CEST",
      steps: { step1: 0, step2: 0, step3: 0, step4: 0 },
    }
    const result = classifyJobHealth(status, today)
    expect(result.kind).toBe("ok")
  })

  test("ended gestern (älter als heute 00:00) → stale", () => {
    const today = new Date("2026-06-15T08:00:00Z")
    const status: NightlyRunStatus = {
      kind: "ended",
      endTime: "2026-06-14 05:00:37 CEST",
      steps: { step1: 0, step2: 0, step3: 0, step4: 0 },
    }
    const result = classifyJobHealth(status, today)
    expect(result.kind).toBe("stale")
    if (result.kind !== "stale") return
    expect(result.lastEnd).toBe("2026-06-14 05:00:37 CEST")
  })

  test("ended heute mit Step exit != 0 → step-error", () => {
    const today = new Date("2026-06-15T08:00:00Z")
    const status: NightlyRunStatus = {
      kind: "ended",
      endTime: "2026-06-15 05:00:37 CEST",
      steps: { step1: 0, step2: 2, step3: 0, step4: 0 },
    }
    const result = classifyJobHealth(status, today)
    expect(result.kind).toBe("step-error")
    if (result.kind !== "step-error") return
    expect(result.failedSteps).toEqual([{ step: "step2", code: 2 }])
  })

  test("hanging → hanging", () => {
    const today = new Date("2026-06-15T08:00:00Z")
    const status: NightlyRunStatus = {
      kind: "hanging",
      startTime: "2026-06-15 03:00:05 CEST",
    }
    const result = classifyJobHealth(status, today)
    expect(result.kind).toBe("hanging")
  })

  test("no-run → no-run", () => {
    const today = new Date("2026-06-15T08:00:00Z")
    const result = classifyJobHealth({ kind: "no-run" }, today)
    expect(result.kind).toBe("no-run")
  })
})

type FailureRow = {
  youtubeId: string
  auditStatus: string
  consecutiveFailureCount: number
  firstErroredAt: Date | null
  lastErroredAt: Date | null
  auditError: string | null
  video: { title: string }
}

function makeMockPrismaForFailures(rows: FailureRow[]) {
  return {
    transcript: {
      findMany: mock(async () => rows),
    },
  } as unknown as PrismaClient
}

describe("fetchRepeatedFailures", () => {
  test("liefert nur Videos mit count >= 2, sortiert nach lastErroredAt DESC", async () => {
    const rows = [
      {
        youtubeId: "abc",
        auditStatus: "error_pass1",
        consecutiveFailureCount: 3,
        firstErroredAt: new Date("2026-06-13T03:00:00Z"),
        lastErroredAt: new Date("2026-06-15T03:00:00Z"),
        auditError: "session limit · resets 8am",
        video: { title: "Some Video Title" },
      },
      {
        youtubeId: "def",
        auditStatus: "error_pass2",
        consecutiveFailureCount: 2,
        firstErroredAt: new Date("2026-06-14T03:00:00Z"),
        lastErroredAt: new Date("2026-06-14T05:00:00Z"),
        auditError: "API Error 529",
        video: { title: "Another Title" },
      },
    ]
    const prisma = makeMockPrismaForFailures(rows)
    const result = await fetchRepeatedFailures(prisma)
    expect(result.length).toBe(2)
    expect(result[0]?.youtubeId).toBe("abc")
    expect(result[0]?.consecutiveFailureCount).toBe(3)
    expect(result[0]?.title).toBe("Some Video Title")
  })

  test("kürzt audit_error auf 200 Zeichen", async () => {
    const longError = "x".repeat(500)
    const prisma = makeMockPrismaForFailures([
      {
        youtubeId: "abc",
        auditStatus: "error_llm",
        consecutiveFailureCount: 2,
        firstErroredAt: new Date(),
        lastErroredAt: new Date(),
        auditError: longError,
        video: { title: "T" },
      },
    ])
    const result = await fetchRepeatedFailures(prisma)
    expect(result[0]?.auditErrorShort?.length).toBeLessThanOrEqual(200)
  })

  test("leeres Result wenn keine Wiederholungs-Fails", async () => {
    const prisma = makeMockPrismaForFailures([])
    const result = await fetchRepeatedFailures(prisma)
    expect(result).toEqual([])
  })
})

describe("formatReport", () => {
  test("alles ok: 1-Zeilen-Bestätigung", () => {
    const report = formatReport({
      jobHealth: { kind: "ok" },
      failures: [],
      now: new Date("2026-06-15T08:00:00Z"),
      jobEndTime: "2026-06-15 05:00:37 CEST",
    })
    expect(report.severity).toBe("ok")
    expect(report.markdown).toContain("✅")
    expect(report.markdown).toContain("alle 4 Steps exit=0")
  })

  test("Wiederholungs-Fails: Tabelle mit Spalten", () => {
    const report = formatReport({
      jobHealth: { kind: "ok" },
      failures: [
        {
          youtubeId: "abc",
          title: "Some Video",
          auditStatus: "error_pass1",
          consecutiveFailureCount: 3,
          firstErroredAt: new Date("2026-06-13T03:00:00Z"),
          lastErroredAt: new Date("2026-06-15T03:00:00Z"),
          auditErrorShort: "session limit",
        },
      ],
      now: new Date("2026-06-15T08:00:00Z"),
      jobEndTime: "2026-06-15 05:00:37 CEST",
    })
    expect(report.severity).toBe("findings")
    expect(report.markdown).toContain("Wiederholte Fehler")
    expect(report.markdown).toContain("abc")
    expect(report.markdown).toContain("error_pass1")
    expect(report.markdown).toContain("session limit")
  })

  test("Job lief nicht (stale): Finding-Header", () => {
    const report = formatReport({
      jobHealth: { kind: "stale", lastEnd: "2026-06-13 05:00 CEST" },
      failures: [],
      now: new Date("2026-06-15T08:00:00Z"),
      jobEndTime: null,
    })
    expect(report.severity).toBe("findings")
    expect(report.markdown).toContain("Job lief heute Nacht nicht")
    expect(report.markdown).toContain("2026-06-13 05:00 CEST")
  })

  test("Step-Error: Failed-Steps in Output", () => {
    const report = formatReport({
      jobHealth: {
        kind: "step-error",
        endTime: "2026-06-15 05:00:37 CEST",
        failedSteps: [{ step: "step3", code: 2 }],
      },
      failures: [],
      now: new Date("2026-06-15T08:00:00Z"),
      jobEndTime: "2026-06-15 05:00:37 CEST",
    })
    expect(report.severity).toBe("findings")
    expect(report.markdown).toContain("step3=2")
  })

  test("Hanging: Hinweis auf abgebrochenen Job", () => {
    const report = formatReport({
      jobHealth: {
        kind: "hanging",
        startTime: "2026-06-15 03:00:05 CEST",
      },
      failures: [],
      now: new Date("2026-06-15T08:00:00Z"),
      jobEndTime: null,
    })
    expect(report.severity).toBe("findings")
    expect(report.markdown).toContain("hängt oder Process abgebrochen")
  })
})
