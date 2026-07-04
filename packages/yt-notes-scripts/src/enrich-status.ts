#!/usr/bin/env bun
import { Command } from "commander"
import { prisma } from "./db"

async function showDefault() {
  const runs = await prisma.enrichRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 5,
  })
  console.log(`YT-Enrich Status (Stand ${new Date().toISOString()})\n`)
  console.log("Letzte 5 Runs:")
  console.log(
    "Run-ID                              | Start             | Trigger        | Total | OK | Skipped | Errored",
  )
  for (const r of runs) {
    console.log(
      `${r.id} | ${r.startedAt.toISOString().slice(0, 16)} | ${r.trigger.padEnd(14)} | ${String(r.countTotal).padStart(5)} | ${String(r.countOk).padStart(2)} | ${String(r.countSkipped).padStart(7)} | ${String(r.countErrored).padStart(7)}`,
    )
  }

  const counts = await prisma.transcript.groupBy({
    by: ["auditStatus"],
    _count: { auditStatus: true },
  })
  console.log("\nAudit-Status-Verteilung:")
  const total = counts.reduce((a, c) => a + c._count.auditStatus, 0)
  for (const c of counts) {
    const pct = ((c._count.auditStatus / total) * 100).toFixed(1)
    console.log(
      `  ${c.auditStatus.padEnd(30)} ${String(c._count.auditStatus).padStart(6)} (${pct}%)`,
    )
  }
}

async function showErrors() {
  const rows = await prisma.transcript.findMany({
    where: {
      OR: [
        // Pre-Critical: audited_md fehlt
        { auditStatus: "error_llm" },
        { auditStatus: "error_empty_output" },
        // Post-Critical: audited_md gesetzt, später Pass kaputt
        { auditStatus: "error_pass3_display_title" },
        { auditStatus: "error_pass4_description" },
        { auditStatus: "error_pass5_summary_long" },
        { auditStatus: "error_stub_write" },
        // Skip / Upstream-Probleme
        { auditStatus: "transcript_missing" },
        { auditStatus: "transcript_error_upstream" },
        { auditStatus: "skip_too_long" },
      ],
    },
    include: { video: { include: { channel: true } } },
    orderBy: { auditedAt: "desc" },
    take: 50,
  })
  console.log(`Problemfälle (${rows.length}):\n`)
  console.log(
    "Status                          | YouTube-ID  | Titel (display||title)                          | Channel               | Fehler",
  )
  for (const r of rows) {
    const title = (r.video.displayTitle ?? r.video.title).slice(0, 48)
    const channel = (r.video.channel?.name ?? "—").slice(0, 20)
    const err = (r.auditError ?? "").slice(0, 60).replace(/\n/g, " ")
    console.log(
      `${r.auditStatus.padEnd(31)} | ${r.youtubeId.padEnd(11)} | ${title.padEnd(48)} | ${channel.padEnd(21)} | ${err}`,
    )
  }
}

const program = new Command()
program
  .name("enrich-status")
  .description("Reporting für YT-Enrichment-Pipeline (Cluster 4)")
  .option("--errors", "Nur Problemfälle anzeigen")
  .option("--since <date>", "Filter ab Datum (ISO YYYY-MM-DD)")

program.action(async (opts) => {
  if (opts.errors) await showErrors()
  else await showDefault()
  await prisma.$disconnect()
})

if (import.meta.main) {
  program.parseAsync(process.argv)
}
