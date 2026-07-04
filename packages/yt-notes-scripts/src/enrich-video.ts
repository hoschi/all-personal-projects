#!/usr/bin/env bun
import { Command } from "commander"
import { Prisma } from "./generated/prisma/client"
import { prisma } from "./db"
import { enrichVideo } from "./enrich-pipeline"
import { findStubPath } from "./stub-path-finder"
import type { Classification } from "./llm-caller"
import { commitAllInVault } from "./git-commit-helper"

const stubPathFor = (youtubeId: string) => findStubPath(prisma, youtubeId)

async function preRunCleanup(runId: string): Promise<void> {
  const vaults = await prisma.vault.findMany()
  for (const v of vaults) {
    const result = await commitAllInVault(
      v.rootPath,
      `yt-enrich: pre-run cleanup (run ${runId})`,
      "youtube/**",
    )
    if (result.committed) {
      console.log(`[pre-run] ${v.name}: alle dirty/untracked Files committed`)
    } else {
      console.log(`[pre-run] ${v.name}: kein Commit nötig (${result.reason})`)
    }
  }
}

async function runMode(
  mode: "pending" | "id" | "bulk" | "retry-errors" | "retry-post-critical",
  classification: Classification,
  singleId?: string,
  limit?: number,
) {
  const trigger = mode === "id" ? "manual-single" : `manual-${mode}`
  const run = await prisma.enrichRun.create({
    data: { trigger, classification },
  })

  let videos: { youtubeId: string }[] = []
  if (mode === "id") {
    if (!singleId) throw new Error("--id requires <youtube-id>")
    videos = [{ youtubeId: singleId }]
  } else if (mode === "pending") {
    videos = await prisma.video.findMany({
      where: {
        channel: { classification },
        transcript: { auditStatus: "pending" },
      },
      select: { youtubeId: true },
      take: limit,
    })
  } else if (mode === "retry-errors") {
    videos = await prisma.video.findMany({
      where: {
        channel: { classification },
        transcript: { auditStatus: "error_llm" },
      },
      select: { youtubeId: true },
      take: limit,
    })
    await prisma.transcript.updateMany({
      where: { youtubeId: { in: videos.map((v) => v.youtubeId) } },
      data: { auditStatus: "pending" },
    })
  } else if (mode === "retry-post-critical") {
    // Critical-Phase-Fehler (Pass 1 / Pass 3 / Pass 4): audited_md wegwerfen,
    // Critical neu durchlaufen. Pre-Task-6-Legacy-Stati (pass3_display_title,
    // pass4_description) waren früher Post-Pass-2 — heute sind alle drei
    // Critical-Phase und werden unter error_pass1 zusammengefasst.
    const criticalErrors = await prisma.video.findMany({
      where: {
        channel: { classification },
        transcript: {
          auditStatus: {
            in: [
              "error_pass1",
              "error_pass3_display_title",
              "error_pass4_description",
            ],
          },
        },
      },
      select: { youtubeId: true },
    })
    await prisma.transcript.updateMany({
      where: { youtubeId: { in: criticalErrors.map((v) => v.youtubeId) } },
      data: {
        auditStatus: "pending",
        auditedMd: null,
        namedEntities: Prisma.DbNull,
      },
    })

    // Background-Phase-Fehler (Pass 2 / Pass 5 / Stub-Write): audited_md
    // recyclen — Reset auf critical_ok triggert shouldSkip-Idempotenz in
    // enrichVideoCritical, dann läuft enrichVideoBackground() neu.
    const backgroundErrors = await prisma.video.findMany({
      where: {
        channel: { classification },
        transcript: {
          auditStatus: {
            in: ["error_pass2", "error_pass5_summary_long", "error_stub_write"],
          },
        },
      },
      select: { youtubeId: true },
    })
    await prisma.transcript.updateMany({
      where: { youtubeId: { in: backgroundErrors.map((v) => v.youtubeId) } },
      data: { auditStatus: "critical_ok" },
    })

    videos = [...criticalErrors, ...backgroundErrors]
    if (limit !== undefined) {
      videos = videos.slice(0, limit)
    }
  } else if (mode === "bulk") {
    videos = await prisma.video.findMany({
      where: { channel: { classification } },
      select: { youtubeId: true },
      take: limit,
    })
  }

  console.log(`Run ${run.id} (${trigger}): ${videos.length} videos`)
  await preRunCleanup(run.id)
  let ok = 0,
    skipped = 0,
    errored = 0
  for (const v of videos) {
    try {
      const res = await enrichVideo({
        prisma,
        youtubeId: v.youtubeId,
        classification,
        runId: run.id,
        stubPath: stubPathFor,
      })
      if (res.status === "ok") ok++
      else if (res.status.startsWith("skip_") || res.skipped) skipped++
      else errored++
    } catch (e) {
      console.error(`Video ${v.youtubeId} failed hard:`, e)
      errored++
    }
  }

  await prisma.enrichRun.update({
    where: { id: run.id },
    data: {
      finishedAt: new Date(),
      countTotal: videos.length,
      countOk: ok,
      countSkipped: skipped,
      countErrored: errored,
    },
  })
  console.log(
    `Run ${run.id} done: ok=${ok} skipped=${skipped} errored=${errored}`,
  )
}

const program = new Command()
program
  .name("enrich-video")
  .description("YouTube-Video-Enrichment via Sub-Agent (Cluster 4)")
  .option("--pending", "Process all pending videos for given classification")
  .option("--id <id>", "Process a single video by YouTube-ID")
  .option(
    "--bulk",
    "Process all videos (ignores idempotency check via existing audited_md? See pipeline)",
  )
  .option("--retry-errors", "Reset error_llm to pending and retry")
  .option(
    "--retry-post-critical-errors",
    "Recovery für Pipeline-Fehler. Critical (pass1, pass3, pass4) → pending + audited_md=null, voll neu. Background (pass2, pass5, stub_write) → critical_ok, nur Background-Phase neu (Smart-Partial — audited_md wird recycelt).",
  )
  .option("--classification <c>", "arbeit | privat", "arbeit")
  .option(
    "--limit <n>",
    "Max. n Videos pro Lauf verarbeiten (zählt OK + Skip + Fail). Sinnvoll im Nightly, damit ein Lauf zeitlich bounded ist.",
    (v) => parseInt(v, 10),
  )

program.action(async (opts) => {
  const classification = opts.classification as Classification
  if (classification === "privat") {
    console.error(
      "Privat-Content ist via Claude nicht unterstützt — Privat/Secret-Enrichment läuft (später) über separate Codex-Pipeline. Siehe yt-pipeline-decisions.md (R18, verworfen 2026-06-05).",
    )
    process.exit(2)
  }
  const limit = typeof opts.limit === "number" ? opts.limit : undefined
  if (opts.id) await runMode("id", classification, opts.id, limit)
  else if (opts.pending)
    await runMode("pending", classification, undefined, limit)
  else if (opts.bulk) await runMode("bulk", classification, undefined, limit)
  else if (opts.retryErrors)
    await runMode("retry-errors", classification, undefined, limit)
  else if (opts.retryPostCriticalErrors)
    await runMode("retry-post-critical", classification, undefined, limit)
  else {
    console.error(
      "Specify one of: --pending --id <id> --bulk --retry-errors --retry-post-critical-errors",
    )
    process.exit(1)
  }
  await prisma.$disconnect()
})

if (import.meta.main) {
  program.parseAsync(process.argv)
}
