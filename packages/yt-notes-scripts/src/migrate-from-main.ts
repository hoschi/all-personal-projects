import { Command } from "commander"
import { Client } from "pg"
import { prisma, USER_KB_VAULT_NAME } from "./db"
import { config } from "../prisma.config"

interface Summary {
  inserted: number
  updated: number
  skipped: number
  errors: number
}

const newSummary = (): Summary => ({
  inserted: 0,
  updated: 0,
  skipped: 0,
  errors: 0,
})

const tableExists = async (pg: Client, table: string): Promise<boolean> => {
  const res = await pg.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'main' AND table_name = $1
     ) AS exists`,
    [table],
  )
  return res.rows[0]?.exists ?? false
}

const hasColumn = async (
  pg: Client,
  table: string,
  column: string,
): Promise<boolean> => {
  const res = await pg.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'main' AND table_name = $1 AND column_name = $2
     ) AS exists`,
    [table, column],
  )
  return res.rows[0]?.exists ?? false
}

const tableCount = async (pg: Client, table: string): Promise<number> => {
  const res = await pg.query<{ n: string }>(
    `SELECT count(*)::text AS n FROM main.${table}`,
  )
  return parseInt(res.rows[0]?.n ?? "0", 10)
}

const printSummary = (name: string, s: Summary) => {
  console.log(`\n=== ${name} ===`)
  console.log(`inserted: ${s.inserted}`)
  console.log(`updated:  ${s.updated}`)
  console.log(`skipped:  ${s.skipped}`)
  console.log(`errors:   ${s.errors}`)
}

const program = new Command()
  .name("migrate-from-main")
  .description(
    "One-shot migration of main.youtube_* legacy tables into yt.* schema",
  )
  .option("--dry-run", "Print counts and column probes only, no writes", false)
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"

Examples:
  bun run src/migrate-from-main.ts
  bun run src/migrate-from-main.ts --dry-run

Exit codes:
  0  success
  1  pre-flight check failed
  2  DB connection error
  3  migration error
`,
  )
  .action(async (opts) => {
    const pg = new Client({ connectionString: config.datasource.url })
    try {
      await pg.connect()
    } catch (e) {
      console.error(`DB connection error: ${(e as Error).message}`)
      process.exit(2)
    }

    try {
      // Pre-flight: Tabellen-Existenz prüfen
      const existsHistory = await tableExists(pg, "youtube_history")
      const existsNoteLinks = await tableExists(pg, "youtube_note_links")
      const existsTranscript = await tableExists(pg, "youtube_transcript")
      const existsVideoDetails = await tableExists(pg, "youtube_video_details")

      const counts = {
        history: existsHistory ? await tableCount(pg, "youtube_history") : null,
        noteLinks: existsNoteLinks
          ? await tableCount(pg, "youtube_note_links")
          : null,
        transcripts: existsTranscript
          ? await tableCount(pg, "youtube_transcript")
          : null,
        videoDetails: existsVideoDetails
          ? await tableCount(pg, "youtube_video_details")
          : null,
      }
      console.log("=== Pre-flight Counts (main.*) ===")
      console.log(`history:       ${counts.history ?? "MISSING"}`)
      console.log(`note_links:    ${counts.noteLinks ?? "MISSING"}`)
      console.log(`transcripts:   ${counts.transcripts ?? "MISSING"}`)
      console.log(`video_details: ${counts.videoDetails ?? "MISSING"}`)

      const noteLinksHasVault = existsNoteLinks
        ? await hasColumn(pg, "youtube_note_links", "vault")
        : false
      if (existsNoteLinks) {
        console.log(
          `note_links.vault column: ${noteLinksHasVault ? "present" : "MISSING (defaulting to legacy vault name)"}`,
        )
      }

      if (opts.dryRun) {
        console.log("\n[dry-run] no writes performed.")
        return
      }

      // 1) Channels + 2) Videos: nur wenn video_details existiert
      if (existsVideoDetails) {
        const channelSummary = newSummary()
        const channelRes = await pg.query<{
          channel_id: string | null
          channel_title: string | null
        }>(
          `SELECT DISTINCT channel_id, channel_title FROM main.youtube_video_details WHERE channel_id IS NOT NULL`,
        )
        for (const row of channelRes.rows) {
          if (!row.channel_id) continue
          try {
            const before = await prisma.channel.findUnique({
              where: { id: row.channel_id },
            })
            await prisma.channel.upsert({
              where: { id: row.channel_id },
              update: {},
              create: {
                id: row.channel_id,
                name: row.channel_title ?? row.channel_id,
                classification: "unknown",
              },
            })
            if (before) channelSummary.skipped++
            else channelSummary.inserted++
          } catch (e) {
            channelSummary.errors++
            console.error(
              `channel error for ${row.channel_id}: ${(e as Error).message}`,
            )
          }
        }
        printSummary("channels", channelSummary)

        const videoSummary = newSummary()
        const videoRes = await pg.query(
          `SELECT youtube_id, title, description, published_at, duration_sec, thumbnail_url, channel_id
           FROM main.youtube_video_details`,
        )
        for (const row of videoRes.rows as Array<{
          youtube_id: string
          title: string | null
          description: string | null
          published_at: Date | null
          duration_sec: number | null
          thumbnail_url: string | null
          channel_id: string | null
        }>) {
          try {
            const before = await prisma.video.findUnique({
              where: { youtubeId: row.youtube_id },
            })
            await prisma.video.upsert({
              where: { youtubeId: row.youtube_id },
              update: {
                title: row.title ?? "",
                description: row.description,
                publishedAt: row.published_at,
                durationSec: row.duration_sec,
                thumbnailUrl: row.thumbnail_url,
                channelId: row.channel_id,
              },
              create: {
                youtubeId: row.youtube_id,
                title: row.title ?? "",
                description: row.description,
                publishedAt: row.published_at,
                durationSec: row.duration_sec,
                thumbnailUrl: row.thumbnail_url,
                channelId: row.channel_id,
              },
            })
            if (before) videoSummary.updated++
            else videoSummary.inserted++
          } catch (e) {
            videoSummary.errors++
            console.error(
              `video error for ${row.youtube_id}: ${(e as Error).message}`,
            )
          }
        }
        printSummary("videos", videoSummary)
      } else {
        console.log(
          "\n[skip] main.youtube_video_details fehlt — channels + videos werden nicht migriert. " +
            "Stub-Videos für WatchHistory/NoteLinks/Transcripts werden bei Bedarf angelegt.",
        )
      }

      // 3) WatchHistory — videos müssen als Stubs existieren (FK-Constraint)
      if (existsHistory) {
        const historySummary = newSummary()
        const historyRes = await pg.query(
          `SELECT youtube_id, watched_time, details, activity_controls
           FROM main.youtube_history`,
        )
        const historyData = (
          historyRes.rows as Array<{
            youtube_id: string
            watched_time: Date
            details: unknown
            activity_controls: unknown
          }>
        ).map((row) => ({
          youtubeId: row.youtube_id,
          watchedAt: row.watched_time,
          details: row.details ?? undefined,
          activityControls: (row.activity_controls as never) ?? [],
        }))
        // Stub-Videos sicherstellen
        const uniqueHistoryIds = Array.from(
          new Set(historyData.map((d) => d.youtubeId)),
        )
        for (const id of uniqueHistoryIds) {
          await prisma.video.upsert({
            where: { youtubeId: id },
            update: {},
            create: { youtubeId: id, title: "" },
          })
        }
        const histResult = await prisma.watchHistory.createMany({
          data: historyData,
          skipDuplicates: true,
        })
        historySummary.inserted = histResult.count
        historySummary.skipped = historyData.length - histResult.count
        printSummary("watch_history", historySummary)
      }

      // 4) NoteLinks
      if (existsNoteLinks) {
        const noteSummary = newSummary()
        const noteSelect = noteLinksHasVault
          ? `SELECT youtube_id, title, file_name, vault FROM main.youtube_note_links`
          : `SELECT youtube_id, title, file_name, NULL::text AS vault FROM main.youtube_note_links`
        const noteRes = await pg.query(noteSelect)
        const noteData = (
          noteRes.rows as Array<{
            youtube_id: string
            title: string | null
            file_name: string
            vault: string | null
          }>
        ).map((row) => ({
          youtubeId: row.youtube_id,
          title: row.title,
          filePath: row.file_name,
          vault: row.vault ?? USER_KB_VAULT_NAME,
        }))
        // Stub-Videos
        const uniqueNoteIds = Array.from(
          new Set(noteData.map((d) => d.youtubeId)),
        )
        for (const id of uniqueNoteIds) {
          await prisma.video.upsert({
            where: { youtubeId: id },
            update: {},
            create: { youtubeId: id, title: "" },
          })
        }
        const noteResult = await prisma.noteLink.createMany({
          data: noteData,
          skipDuplicates: true,
        })
        noteSummary.inserted = noteResult.count
        noteSummary.skipped = noteData.length - noteResult.count
        printSummary("note_links", noteSummary)
      }

      // 5) Transcripts
      if (existsTranscript) {
        const transcriptSummary = newSummary()
        const transcriptRes = await pg.query(
          `SELECT youtube_id, transcript_original, lang, error FROM main.youtube_transcript`,
        )
        for (const row of transcriptRes.rows as Array<{
          youtube_id: string
          transcript_original: string | null
          lang: string | null
          error: string | null
        }>) {
          try {
            // Stub-Video falls noch nicht existiert
            await prisma.video.upsert({
              where: { youtubeId: row.youtube_id },
              update: {},
              create: { youtubeId: row.youtube_id, title: "" },
            })
            const before = await prisma.transcript.findUnique({
              where: { youtubeId: row.youtube_id },
            })
            await prisma.transcript.upsert({
              where: { youtubeId: row.youtube_id },
              update: {
                srt: row.transcript_original,
                lang: row.lang,
                error: row.error,
              },
              create: {
                youtubeId: row.youtube_id,
                srt: row.transcript_original,
                lang: row.lang,
                error: row.error,
              },
            })
            if (before) transcriptSummary.updated++
            else transcriptSummary.inserted++
          } catch (e) {
            transcriptSummary.errors++
            console.error(
              `transcript error for ${row.youtube_id}: ${(e as Error).message}`,
            )
          }
        }
        printSummary("transcripts", transcriptSummary)
      }

      console.log("\n=== migration done ===")
    } catch (e) {
      console.error(`Migration error: ${(e as Error).message}`)
      process.exit(3)
    } finally {
      await pg.end()
      await prisma.$disconnect()
    }
  })

program.parseAsync(process.argv)
