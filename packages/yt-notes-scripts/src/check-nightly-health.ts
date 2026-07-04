import { readFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import type { PrismaClient } from "./generated/prisma/client"

export type NightlyRunStatus =
  | { kind: "no-run" }
  | { kind: "hanging"; startTime: string }
  | {
      kind: "ended"
      endTime: string
      steps: { step1: number; step2: number; step3: number; step4: number }
    }

export function parseLastNightlyRun(logContent: string): NightlyRunStatus {
  if (!logContent.trim()) return { kind: "no-run" }

  const lines = logContent.split("\n")
  // Letzten end-Marker suchen
  const endRegex =
    /\[yt-pipeline-nightly\] end (.+?)\s+step1=(\d+) step2=(\d+) step3=(\d+) step4=(\d+)/
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i] ?? ""
    const m = endRegex.exec(line)
    if (m) {
      return {
        kind: "ended",
        endTime: m[1] ?? "",
        steps: {
          step1: parseInt(m[2] ?? "0", 10),
          step2: parseInt(m[3] ?? "0", 10),
          step3: parseInt(m[4] ?? "0", 10),
          step4: parseInt(m[5] ?? "0", 10),
        },
      }
    }
  }

  // Kein end gefunden — letzten start suchen
  const startRegex = /\[yt-pipeline-nightly\] start (.+)$/
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i] ?? ""
    const m = startRegex.exec(line)
    if (m) {
      return { kind: "hanging", startTime: m[1] ?? "" }
    }
  }

  return { kind: "no-run" }
}

export type JobHealth =
  | { kind: "ok" }
  | { kind: "stale"; lastEnd: string | null }
  | {
      kind: "step-error"
      endTime: string
      failedSteps: Array<{ step: string; code: number }>
    }
  | { kind: "hanging"; startTime: string }
  | { kind: "no-run" }

export function classifyJobHealth(
  status: NightlyRunStatus,
  now: Date,
): JobHealth {
  if (status.kind === "no-run") return { kind: "no-run" }
  if (status.kind === "hanging")
    return { kind: "hanging", startTime: status.startTime }

  // status.kind === "ended"
  const failedSteps = (["step1", "step2", "step3", "step4"] as const).flatMap(
    (s) => (status.steps[s] !== 0 ? [{ step: s, code: status.steps[s] }] : []),
  )
  if (failedSteps.length > 0) {
    return { kind: "step-error", endTime: status.endTime, failedSteps }
  }

  // Datum vergleichen: endTime ist "YYYY-MM-DD HH:MM:SS CEST"
  const endDateStr = status.endTime.slice(0, 10) // "YYYY-MM-DD"
  const todayStr = now.toISOString().slice(0, 10)
  if (endDateStr !== todayStr) {
    return { kind: "stale", lastEnd: status.endTime }
  }

  return { kind: "ok" }
}

export type RepeatedFailure = {
  youtubeId: string
  title: string
  auditStatus: string
  consecutiveFailureCount: number
  firstErroredAt: Date | null
  lastErroredAt: Date | null
  auditErrorShort: string | null
}

export async function fetchRepeatedFailures(
  prisma: PrismaClient,
): Promise<RepeatedFailure[]> {
  const rows = await prisma.transcript.findMany({
    where: { consecutiveFailureCount: { gte: 2 } },
    orderBy: { lastErroredAt: "desc" },
    select: {
      youtubeId: true,
      auditStatus: true,
      consecutiveFailureCount: true,
      firstErroredAt: true,
      lastErroredAt: true,
      auditError: true,
      video: { select: { title: true } },
    },
  })
  return rows.map((r) => ({
    youtubeId: r.youtubeId,
    title: r.video.title,
    auditStatus: r.auditStatus,
    consecutiveFailureCount: r.consecutiveFailureCount,
    firstErroredAt: r.firstErroredAt,
    lastErroredAt: r.lastErroredAt,
    auditErrorShort: r.auditError
      ? r.auditError.slice(0, 200).replace(/\s+/g, " ").trim()
      : null,
  }))
}

export type Report = {
  severity: "ok" | "findings"
  markdown: string
}

export function formatReport(opts: {
  jobHealth: JobHealth
  failures: RepeatedFailure[]
  now: Date
  jobEndTime: string | null
}): Report {
  const { jobHealth, failures, now } = opts
  const today = now.toISOString().slice(0, 10)
  const hasJobFinding = jobHealth.kind !== "ok"
  const hasFailures = failures.length > 0
  const hasFindings = hasJobFinding || hasFailures

  if (!hasFindings) {
    return {
      severity: "ok",
      markdown: `✅ YT-Pipeline ${opts.jobEndTime ?? today}: alle 4 Steps exit=0, keine wiederholten Fehler.\n`,
    }
  }

  const lines: string[] = [`# YT-Pipeline Morgen-Check ${today}\n`]

  if (hasFailures) {
    lines.push("## ❌ Wiederholte Fehler (Check C)")
    lines.push(`${failures.length} Video(s) zum 2.+ Mal gescheitert:\n`)
    lines.push("| Video | Status | Count | Seit | Zuletzt | Fehler (kurz) |")
    lines.push("|---|---|---|---|---|---|")
    for (const f of failures) {
      const seit = f.firstErroredAt
        ? f.firstErroredAt.toISOString().slice(0, 10)
        : "?"
      const zuletzt = f.lastErroredAt
        ? f.lastErroredAt.toISOString().slice(0, 10)
        : "?"
      lines.push(
        `| ${f.youtubeId} | ${f.auditStatus} | ${f.consecutiveFailureCount} | ${seit} | ${zuletzt} | ${f.auditErrorShort ?? ""} |`,
      )
    }
    lines.push("")
  }

  if (hasJobFinding) {
    lines.push("## ❌ Job-Health (Check A+B)")
    if (jobHealth.kind === "stale") {
      lines.push(
        `Job lief heute Nacht nicht. Letzter End-Marker: ${jobHealth.lastEnd ?? "keiner gefunden"}.`,
      )
    } else if (jobHealth.kind === "step-error") {
      const failed = jobHealth.failedSteps
        .map((s) => `${s.step}=${s.code}`)
        .join(", ")
      lines.push(`Letzter Lauf: ${jobHealth.endTime}`)
      lines.push(`Failed Steps: ${failed}`)
    } else if (jobHealth.kind === "hanging") {
      lines.push(
        `Job hängt oder Process abgebrochen. Letzter start ohne end: ${jobHealth.startTime}.`,
      )
    } else if (jobHealth.kind === "no-run") {
      lines.push("Kein Lauf-Marker im Log gefunden — Mac aus/Sleep?")
    }
    lines.push("")
  } else if (opts.jobEndTime) {
    lines.push("## ✅ Job-Health (Check A+B)")
    lines.push(`- Letzter Lauf: ${opts.jobEndTime}`)
    lines.push("- Steps: 1=0, 2=0, 3=0, 4=0")
    lines.push("")
  }

  return { severity: "findings", markdown: lines.join("\n") }
}

// Log-Pfad per Env-Var überschreibbar. Default folgt der „Nightly Pipeline"-
// Sektion in der README (Operator-Setup): Logs landen in `~/Library/Logs/`.
// Wenn dein Scheduler den Log woanders schreibt: `YT_PIPELINE_NIGHTLY_LOG_PATH`
// setzen.
const LOG_PATH =
  process.env.YT_PIPELINE_NIGHTLY_LOG_PATH ??
  join(homedir(), "Library/Logs/yt-pipeline-nightly.log")

export async function main(): Promise<number> {
  let logContent = ""
  try {
    logContent = await readFile(LOG_PATH, "utf-8")
  } catch (e) {
    console.error(`[check-nightly-health] log nicht lesbar: ${LOG_PATH}`)
    console.error(e instanceof Error ? e.message : String(e))
    return 2
  }

  const status = parseLastNightlyRun(logContent)
  const now = new Date()
  const jobHealth = classifyJobHealth(status, now)
  const jobEndTime = status.kind === "ended" ? status.endTime : null

  const { prisma } = await import("./db")
  let failures: RepeatedFailure[]
  try {
    failures = await fetchRepeatedFailures(prisma)
  } catch (e) {
    console.error("[check-nightly-health] DB-Query fehlgeschlagen")
    console.error(e instanceof Error ? e.message : String(e))
    return 2
  } finally {
    await prisma.$disconnect()
  }

  const report = formatReport({ jobHealth, failures, now, jobEndTime })
  process.stdout.write(report.markdown)
  return report.severity === "ok" ? 0 : 1
}

if (import.meta.main) {
  main().then(
    (code) => process.exit(code),
    (e) => {
      console.error(e)
      process.exit(2)
    },
  )
}
