import { mkdtemp, readFile, readdir, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { spawn } from "child_process"
import { Command } from "commander"
import { prisma } from "./db"
import { toLLMFormat, toPlainText } from "./subtitle-processors"
import { ChannelClass } from "./generated/prisma/enums"

const YT_DLP_FLAGS_BASE = [
  "--write-auto-subs",
  "--skip-download",
  "--write-sub",
  "--sub-format",
  "vtt/srt",
  // yt-dlp 2026.x braucht expliziten JS-Runtime für n-challenge-Solver;
  // default ist nur deno. Node ist im Repo via asdf shim verfügbar.
  "--js-runtimes",
  "node",
  // Sprach-Whitelist: DE+EN. Default-Verhalten von yt-dlp ist "en"-only,
  // was bei deutschsprachigen Videos zu HTTP-429-Wellen für übersetzte
  // Auto-Captions führt. Mit dieser Whitelist hat yt-dlp einen Fallback.
  "--sub-langs",
  "de,en",
  // 429 auf einer von zwei Sprachen darf nicht den ganzen Run abbrechen —
  // yt-dlp default-Verhalten ist "abort on first error". Mit --ignore-errors
  // wird der 429 zu WARNING, die zweite Sprache wird trotzdem versucht.
  "--ignore-errors",
]

const YT_DLP_CHROME_COOKIE_FLAG = "--cookies-from-browser=chrome"

const buildYouTubeUrl = (videoId: string): string =>
  `https://www.youtube.com/watch?v=${videoId}`

const runYtDlp = async (
  videoId: string,
  workdir: string,
  useCookies: boolean,
): Promise<{ stdout: string; stderr: string; code: number }> => {
  return new Promise((resolve, reject) => {
    const args = [
      ...YT_DLP_FLAGS_BASE,
      ...(useCookies ? [YT_DLP_CHROME_COOKIE_FLAG] : []),
      "-o",
      "transcript.%(ext)s",
      buildYouTubeUrl(videoId),
    ]
    const child = spawn("yt-dlp", args, { cwd: workdir })
    let stdout = ""
    let stderr = ""
    child.stdout.on("data", (d) => (stdout += d.toString()))
    child.stderr.on("data", (d) => (stderr += d.toString()))
    child.on("error", (err) => reject(err))
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }))
  })
}

const classifyYtDlpFailure = (output: string): string | null => {
  if (output.includes("There are no subtitles for the requested languages"))
    return "no subtitles available for languages requested"
  if (output.includes("Unable to download video subtitles"))
    return "unable to download video subtitles"
  if (output.includes("Video unavailable. This video is private"))
    return "video is private"
  if (output.includes("No subtitle format found"))
    return "no subtitle format found"
  return null
}

interface CapturedTranscript {
  filename: string
  lang: string
  content: string
}

const collectTranscripts = async (
  workdir: string,
): Promise<CapturedTranscript[]> => {
  const files = await readdir(workdir)
  const subs = files.filter(
    (f) =>
      f.startsWith("transcript.") && (f.endsWith(".srt") || f.endsWith(".vtt")),
  )
  return Promise.all(
    subs.map(async (filename) => {
      const content = await readFile(join(workdir, filename), "utf-8")
      const langMatch = filename.match(/transcript\.([^.]+)\.(srt|vtt)/)
      const lang = langMatch?.[1] ?? "unknown"
      return { filename, lang, content }
    }),
  )
}

const LANG_PRIORITY = ["de", "en"]

const pickPrimaryTranscript = (
  transcripts: CapturedTranscript[],
): CapturedTranscript | null => {
  if (transcripts.length === 0) return null
  const byPriority = (list: CapturedTranscript[]) =>
    LANG_PRIORITY.map((lang) => list.find((t) => t.lang === lang)).find(
      (t): t is CapturedTranscript => t !== undefined,
    )
  const srtCandidates = transcripts.filter((t) => t.filename.endsWith(".srt"))
  return (
    byPriority(srtCandidates) ??
    srtCandidates[0] ??
    byPriority(transcripts) ??
    transcripts[0]
  )
}

export const processTranscript = async (
  videoId: string,
  useCookies = false,
): Promise<{ ok: boolean; reason?: string }> => {
  const workdir = await mkdtemp(join(tmpdir(), `yt-tx-${videoId}-`))
  try {
    // Spawn-Fehler (z.B. ENOENT wenn yt-dlp nicht installiert) separat abfangen,
    // damit der for-Loop im CLI nicht abbricht und der Fehler in die DB geschrieben wird.
    let runResult: { stdout: string; stderr: string; code: number }
    try {
      runResult = await runYtDlp(videoId, workdir, useCookies)
    } catch (spawnErr) {
      const reason =
        (spawnErr as Error & { code?: string }).code === "ENOENT"
          ? "yt-dlp not installed"
          : `yt-dlp spawn error: ${spawnErr instanceof Error ? spawnErr.message : String(spawnErr)}`
      await prisma.transcript.upsert({
        where: { youtubeId: videoId },
        update: { error: reason },
        create: { youtubeId: videoId, error: reason },
      })
      return { ok: false, reason }
    }
    const { stdout, stderr } = runResult
    // Erst gucken ob Files da sind: yt-dlp kann mit non-zero exit kommen
    // (z.B. HTTP 429 für eine von zwei Sprachen), trotzdem die andere
    // Sprache erfolgreich geschrieben haben. Mit --sub-langs "de,en" ist
    // das der Normalfall bei deutschsprachigen Videos.
    const transcripts = await collectTranscripts(workdir)
    const primary = pickPrimaryTranscript(transcripts)
    if (!primary) {
      const failureReason =
        classifyYtDlpFailure(stdout + stderr) ?? "no transcript files produced"
      await prisma.transcript.upsert({
        where: { youtubeId: videoId },
        update: { error: failureReason },
        create: { youtubeId: videoId, error: failureReason },
      })
      return { ok: false, reason: failureReason }
    }
    const plain = toPlainText(primary.content)
    const llm = JSON.stringify(toLLMFormat(primary.content))
    await prisma.transcript.upsert({
      where: { youtubeId: videoId },
      update: {
        srt: primary.content,
        plain,
        llmFormatted: llm,
        lang: primary.lang,
        error: null,
      },
      create: {
        youtubeId: videoId,
        srt: primary.content,
        plain,
        llmFormatted: llm,
        lang: primary.lang,
      },
    })
    return { ok: true }
  } finally {
    await rm(workdir, { recursive: true, force: true })
  }
}

const program = new Command()
  .name("import_youtube_transcript")
  .description(
    "Downloads YouTube captions for videos in yt.video and stores them in yt.transcript. Uses yt-dlp in captions-only mode (no audio/video download).",
  )
  .option("--video-id <id>", "Process a single video id only")
  .option(
    "--limit <n>",
    "Process at most N videos missing a transcript (or with error if --retry-failed)",
    (v) => parseInt(v, 10),
  )
  .option(
    "--retry-failed",
    "Re-process videos whose transcript row currently has error != null (instead of videos missing a transcript). Combine with --with-chrome-cookies for the second pass.",
    false,
  )
  .option(
    "--with-chrome-cookies",
    "Pass --cookies-from-browser=chrome to yt-dlp (triggers a macOS Keychain prompt per video — see KB)",
    false,
  )
  .option(
    "--classification <value>",
    "Restrict bulk selection to videos of a channel classification (arbeit | privat | mixed | unknown). Ignored for --video-id.",
  )
  .addHelpText(
    "after",
    `
This pipeline uses yt-dlp ONLY for subtitles/captions. Audio/video downloads
are neither planned nor needed.

Hardcoded yt-dlp flags: --write-auto-subs --skip-download --write-sub --sub-format vtt/srt

Reason: YouTube Web ToS prohibits AV download; captions are not an AV stream
(EFF position + YouTube Data API has own captions endpoint).

Cookie strategy (two-pass):
  1) First pass (default): cookie-less. yt-dlp downloads captions for most public
     videos even without cookies (just emits SABR/decryption warnings). Failures
     are persisted to yt.transcript.error.
  2) Second pass: --retry-failed --with-chrome-cookies. The DB query switches
     from "videos with no transcript row" to "videos with transcript.error != null",
     and yt-dlp is called with --cookies-from-browser=chrome to retry region-locked
     or member-only videos.

Note: --with-chrome-cookies triggers a macOS Keychain prompt PER video, because
yt-dlp spawns are seen as new app identities by Keychain ACL. Background and
workarounds: knowledge-base/yt-dlp-chrome-cookies-keychain-prompt.md

Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"

Examples:
  bun run src/import_youtube_transcript.ts --video-id abc12345xyz
  bun run src/import_youtube_transcript.ts --limit 10
  bun run src/import_youtube_transcript.ts --limit 10 --classification arbeit
  bun run src/import_youtube_transcript.ts --retry-failed --with-chrome-cookies

Exit codes:
  0  success
  1  input error
  2  DB connection error
  3  yt-dlp not installed / unknown failure
`,
  )
  .action(
    async (opts: {
      videoId?: string
      limit?: number
      retryFailed: boolean
      withChromeCookies: boolean
      classification?: string
    }) => {
      let classification: ChannelClass | undefined
      if (opts.classification !== undefined) {
        const valid = Object.values(ChannelClass) as string[]
        if (!valid.includes(opts.classification)) {
          console.error(
            `Invalid --classification "${opts.classification}". Valid values: ${valid.join(" | ")}`,
          )
          process.exit(1)
        }
        classification = opts.classification as ChannelClass
      }

      let ids: string[]
      if (opts.videoId) {
        ids = [opts.videoId]
      } else if (opts.retryFailed) {
        const rows = await prisma.transcript.findMany({
          where: {
            error: { not: null },
            ...(classification
              ? { video: { channel: { classification } } }
              : {}),
          },
          select: { youtubeId: true },
          take: opts.limit,
        })
        ids = rows.map((r) => r.youtubeId)
      } else {
        const rows = await prisma.video.findMany({
          where: {
            transcript: { is: null },
            ...(classification ? { channel: { classification } } : {}),
          },
          select: { youtubeId: true },
          take: opts.limit,
        })
        ids = rows.map((r) => r.youtubeId)
      }
      const mode = opts.retryFailed ? "retry-failed" : "fresh"
      const classificationLabel = classification
        ? `, classification=${classification}`
        : ""
      console.log(
        `processing ${ids.length} videos (${mode}${classificationLabel}${opts.withChromeCookies ? ", with chrome cookies" : ""})`,
      )
      let ok = 0
      const failed: Array<{ videoId: string; reason: string }> = []

      for (const videoId of ids) {
        const r = await processTranscript(videoId, opts.withChromeCookies)
        if (r.ok) {
          console.log(`[ok] ${videoId}`)
          ok++
        } else {
          console.warn(`[fail] ${videoId}: ${r.reason}`)
          failed.push({ videoId, reason: r.reason ?? "unknown" })
        }
      }

      console.log(`\n=== Summary ===`)
      console.log(`ok:     ${ok}`)
      console.log(`failed: ${failed.length}`)

      if (failed.length > 0) {
        console.log(`\n=== Failed videos ===`)
        for (const f of failed) {
          console.log(`${f.videoId}\t${f.reason}`)
        }
        if (!opts.withChromeCookies) {
          console.log(
            `\nTip: re-run with --retry-failed --with-chrome-cookies to retry these from the DB with a logged-in session (e.g. German/region-locked videos).`,
          )
        }
      }
      await prisma.$disconnect()
    },
  )

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
