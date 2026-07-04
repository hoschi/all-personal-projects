import { Command } from "commander"
import { prisma } from "./db"
import { fetchVideo, writeVideo } from "./get_video_details"
import { processTranscript } from "./import_youtube_transcript"

const program = new Command()
  .name("index-video")
  .description(
    "Composer: ensures a video has details + transcript in yt.* (fetch via YT API + yt-dlp captions)",
  )
  .argument("<videoIds...>", "One or more YouTube video ids")
  .option(
    "--skip-details",
    "Don't fetch video details (assume video row exists)",
    false,
  )
  .option(
    "--skip-transcript",
    "Don't fetch transcript (only video details)",
    false,
  )
  .option(
    "--with-chrome-cookies",
    "Pass --cookies-from-browser=chrome to yt-dlp (triggers Keychain prompt per video — see KB)",
    false,
  )
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"
  YOUTUBE_API_KEY       YouTube Data API v3 key

Examples:
  bun run src/index-video.ts abc12345xyz
  bun run src/index-video.ts abc12345xyz def67890wxy --skip-transcript
  bun run src/index-video.ts abc12345xyz --with-chrome-cookies

Exit codes:
  0  success
  1  one or more videos failed
  2  DB connection error
`,
  )
  .action(
    async (
      videoIds: string[],
      opts: {
        skipDetails: boolean
        skipTranscript: boolean
        withChromeCookies: boolean
      },
    ) => {
      let detailsOk = 0
      let detailsFail = 0
      let transcriptOk = 0
      const transcriptFailed: Array<{ videoId: string; reason: string }> = []

      for (const id of videoIds) {
        if (!opts.skipDetails) {
          try {
            const item = await fetchVideo(id)
            await writeVideo(item)
            detailsOk++
          } catch (e) {
            detailsFail++
            console.error(`[details-fail] ${id}: ${(e as Error).message}`)
          }
        }
        if (!opts.skipTranscript) {
          const r = await processTranscript(id, opts.withChromeCookies)
          if (r.ok) transcriptOk++
          else {
            transcriptFailed.push({
              videoId: id,
              reason: r.reason ?? "unknown",
            })
            console.warn(`[transcript-fail] ${id}: ${r.reason}`)
          }
        }
      }

      console.log(`\n=== Summary ===`)
      console.log(`details_ok:     ${detailsOk}`)
      console.log(`details_fail:   ${detailsFail}`)
      console.log(`transcript_ok:  ${transcriptOk}`)
      console.log(`transcript_fail:${transcriptFailed.length}`)

      if (transcriptFailed.length > 0) {
        console.log(`\n=== Failed transcripts ===`)
        for (const f of transcriptFailed) {
          console.log(`${f.videoId}\t${f.reason}`)
        }
        if (!opts.withChromeCookies) {
          console.log(
            `\nTip: re-run with --with-chrome-cookies to retry failures that may need a logged-in session (e.g. German/region-locked videos).`,
          )
        }
      }

      await prisma.$disconnect()
      process.exit(detailsFail + transcriptFailed.length > 0 ? 1 : 0)
    },
  )

await program.parseAsync(process.argv)
