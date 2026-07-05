import { readFile } from "fs/promises"
import { Command } from "commander"
import { prisma } from "./db"
import { parseVideoId } from "./utils/parser"

interface RawEntry {
  title?: string
  titleUrl?: string
  time?: string
  details?: Array<{ name: string }>
  activityControls?: string[]
}

interface ProcessedEntry {
  youtubeId: string
  title: string
  watchedAt: Date
  details: unknown
  activityControls: string[]
}

const isAd = (entry: RawEntry): boolean =>
  (entry.details ?? []).some((d) => d.name.includes("Google Anzeigen"))

const processEntry = (entry: RawEntry): ProcessedEntry | null => {
  if (!entry.titleUrl || !entry.title || !entry.time) return null
  const youtubeId = parseVideoId(entry.titleUrl)
  if (!youtubeId) return null
  return {
    youtubeId,
    title: entry.title,
    watchedAt: new Date(entry.time),
    details: entry.details?.[0] ?? null,
    activityControls: entry.activityControls ?? [],
  }
}

const program = new Command()
  .name("import_youtube_history")
  .description(
    "Imports a Google Takeout watch-history.json into yt.watch_history (deduplicated on youtube_id+watched_at)",
  )
  .argument("<file>", "Path to watch-history.json (Google Takeout format)")
  .option("--dry-run", "Parse + count, no DB writes", false)
  .option("--limit <n>", "Process only first N entries", (v) => parseInt(v, 10))
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"

Examples:
  bun run src/import_youtube_history.ts packages/yt-notes-scripts/watched-small.json
  bun run src/import_youtube_history.ts ~/Downloads/watch-history.json --dry-run --limit 100

Exit codes:
  0  success
  1  parse error / missing file
  2  DB connection error
  3  validation error (Takeout format unexpected)
`,
  )
  .action(async (file: string, opts: { dryRun: boolean; limit?: number }) => {
    let raw: string
    try {
      raw = await readFile(file, "utf-8")
    } catch (e) {
      console.error(`File read error: ${(e as Error).message}`)
      process.exit(1)
    }

    let entries: unknown
    try {
      entries = JSON.parse(raw)
    } catch (e) {
      console.error(`JSON parse error: ${(e as Error).message}`)
      process.exit(1)
    }
    if (!Array.isArray(entries)) {
      console.error("Validation error: expected JSON array at top level")
      process.exit(3)
    }

    const slice = opts.limit ? entries.slice(0, opts.limit) : entries
    const processed: ProcessedEntry[] = []
    let skippedAd = 0
    let skippedNoId = 0

    for (const e of slice as RawEntry[]) {
      if (isAd(e)) {
        skippedAd++
        continue
      }
      const p = processEntry(e)
      if (!p) {
        skippedNoId++
        continue
      }
      processed.push(p)
    }

    console.log(`=== Summary ===`)
    console.log(`read:        ${slice.length}`)
    console.log(`processable: ${processed.length}`)
    console.log(`skipped_ad:  ${skippedAd}`)
    console.log(`skipped_no_id: ${skippedNoId}`)

    if (opts.dryRun) {
      console.log(`\n[dry-run] no writes performed`)
      await prisma.$disconnect()
      return
    }

    // Ensure video stubs exist (FK constraint on watch_history.youtubeId)
    const titleById = new Map<string, string>()
    for (const p of processed) {
      if (!titleById.has(p.youtubeId)) titleById.set(p.youtubeId, p.title)
    }
    for (const [id, title] of titleById) {
      await prisma.video.upsert({
        where: { youtubeId: id },
        update: {},
        create: { youtubeId: id, title },
      })
    }

    const result = await prisma.watchHistory.createMany({
      data: processed.map((p) => ({
        youtubeId: p.youtubeId,
        watchedAt: p.watchedAt,
        details: p.details as never,
        activityControls: p.activityControls as never,
      })),
      skipDuplicates: true,
    })

    console.log(`\ninserted:    ${result.count}`)
    console.log(`duplicates:  ${processed.length - result.count}`)
    await prisma.$disconnect()
  })

await program.parseAsync(process.argv)
