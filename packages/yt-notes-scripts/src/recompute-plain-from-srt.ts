#!/usr/bin/env bun
/**
 * Einmal-Migrationsskript: füllt plain + llmFormatted für srt-only-Rows
 * (Bug-Erblast aus Cluster-1-Migration migrate-from-main.ts:325).
 *
 * NICHT Teil der Nightly-Pipeline — import_youtube_transcript.ts schreibt
 * srt/plain/llmFormatted atomar (siehe Code-Audit Cluster 4e Task 1).
 */
import { Command } from "commander"
import { prisma } from "./db"
import { toPlainText, toLLMFormat } from "./subtitle-processors"

export interface RecomputeOptions {
  dryRun?: boolean
  limit?: number
}

export interface RecomputeResult {
  candidates: number
  updated: number
  errors: number
}

export async function recomputePlainFromSrt(
  opts: RecomputeOptions = {},
): Promise<RecomputeResult> {
  const candidates = await prisma.transcript.findMany({
    where: { srt: { not: null }, plain: null },
    select: { youtubeId: true, srt: true },
    ...(Number.isFinite(opts.limit) ? { take: opts.limit } : {}),
  })

  let updated = 0
  let errors = 0

  for (const row of candidates) {
    if (!row.srt) continue
    if (opts.dryRun) continue
    try {
      const plain = toPlainText(row.srt)
      const llmFormatted = JSON.stringify(toLLMFormat(row.srt))
      await prisma.transcript.update({
        where: { youtubeId: row.youtubeId },
        data: { plain, llmFormatted },
      })
      updated++
    } catch (err) {
      errors++
      console.error(`[recompute] ${row.youtubeId}: ${(err as Error).message}`)
    }
  }

  return { candidates: candidates.length, updated, errors }
}

const program = new Command()
  .name("recompute-plain-from-srt")
  .description(
    "Einmal-Migrationsskript: füllt plain + llmFormatted für yt.transcript-Rows, die srt haben aber plain == null. Schließt die Cluster-1-Migrations-Lücke aus migrate-from-main.ts:325. Nicht in die Nightly-Pipeline einbauen — der laufende Code (import_youtube_transcript.ts) schreibt srt+plain+llmFormatted atomar.",
  )
  .option("--dry-run", "Zählen, nicht schreiben", false)
  .option("--limit <n>", "Höchstens N Rows verarbeiten", (v) => parseInt(v, 10))
  .addHelpText(
    "after",
    `
Examples:
  bun run src/recompute-plain-from-srt.ts --dry-run
  bun run src/recompute-plain-from-srt.ts
  bun run src/recompute-plain-from-srt.ts --limit 10

Exit codes:
  0  success
  1  argument error
  2  DB error
`,
  )

if (import.meta.main) {
  await program.parseAsync(process.argv)
  const opts = program.opts<{ dryRun?: boolean; limit?: number }>()
  if (opts.limit !== undefined && !Number.isFinite(opts.limit)) {
    console.error(
      "[recompute-plain-from-srt] --limit muss eine positive Ganzzahl sein",
    )
    process.exit(1)
  }
  try {
    const result = await recomputePlainFromSrt(opts)
    console.log(
      `[recompute-plain-from-srt] candidates=${result.candidates} updated=${result.updated} errors=${result.errors} dryRun=${opts.dryRun ? "yes" : "no"}`,
    )
    if (result.errors > 0) process.exit(2)
  } catch (err) {
    console.error("[recompute-plain-from-srt] fatal:", err)
    process.exit(2)
  } finally {
    await prisma.$disconnect()
  }
}
