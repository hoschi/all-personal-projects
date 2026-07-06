import axios from "axios"
import { Command } from "commander"
import { prisma } from "./db"
import { parseChapters, parseISODuration } from "./utils/parser"

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"
const STALE_DAYS = 30
const STALE_MS = STALE_DAYS * 24 * 60 * 60 * 1000

interface VideoSnippet {
  title: string
  description: string
  publishedAt: string
  channelTitle: string
  channelId: string
  tags?: string[]
  thumbnails?: { high?: { url: string }; default?: { url: string } }
}

interface VideoContentDetails {
  duration: string
}

interface VideoItem {
  id: string
  snippet: VideoSnippet
  contentDetails: VideoContentDetails
}

interface ApiResponse {
  items: VideoItem[]
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export const fetchVideo = async (videoId: string): Promise<VideoItem> => {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new HttpError("YOUTUBE_API_KEY missing", 400)
  try {
    const res = await axios.get<ApiResponse>(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: { part: "snippet,contentDetails", id: videoId, key: apiKey },
    })
    if (res.data.items.length === 0)
      throw new HttpError(`Video ${videoId} not found`, 404)
    return res.data.items[0]
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status ?? 0
      const msg =
        (e.response?.data as { error?: { message?: string } } | undefined)
          ?.error?.message ?? e.message
      throw new HttpError(msg, status)
    }
    throw e
  }
}

interface ChannelStatsResponse {
  items: Array<{
    id: string
    statistics?: { subscriberCount?: string }
    snippet?: { title?: string }
  }>
}

export interface ChannelStatsItem {
  id: string
  subscribers: number | null
  name: string | null
}

export const fetchChannel = async (
  channelId: string,
): Promise<ChannelStatsItem> => {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new HttpError("YOUTUBE_API_KEY missing", 400)
  try {
    const res = await axios.get<ChannelStatsResponse>(
      `${YOUTUBE_API_BASE_URL}/channels`,
      {
        params: {
          part: "statistics,snippet",
          id: channelId,
          key: apiKey,
        },
      },
    )
    if (res.data.items.length === 0)
      throw new HttpError(`Channel ${channelId} not found`, 404)
    const item = res.data.items[0]
    const subStr = item.statistics?.subscriberCount
    return {
      id: item.id,
      subscribers: subStr ? Number.parseInt(subStr, 10) : null,
      name: item.snippet?.title ?? null,
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status ?? 0
      const msg =
        (e.response?.data as { error?: { message?: string } } | undefined)
          ?.error?.message ?? e.message
      throw new HttpError(msg, status)
    }
    throw e
  }
}

export const writeChannelStats = async (
  item: ChannelStatsItem,
): Promise<void> => {
  await prisma.channel.upsert({
    where: { id: item.id },
    update: {
      ...(item.subscribers !== null ? { subscribers: item.subscribers } : {}),
      ...(item.name !== null ? { name: item.name } : {}),
    },
    create: {
      id: item.id,
      name: item.name ?? "(unknown)",
      subscribers: item.subscribers,
      classification: "unknown",
    },
  })
}

export const writeVideo = async (item: VideoItem) => {
  const { snippet, contentDetails } = item
  const duration = parseISODuration(contentDetails.duration)
  const chapters = parseChapters(snippet.description ?? "")
  const thumbnailUrl =
    snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? null

  await prisma.channel.upsert({
    where: { id: snippet.channelId },
    update: { name: snippet.channelTitle },
    create: {
      id: snippet.channelId,
      name: snippet.channelTitle,
      classification: "unknown",
    },
  })

  await prisma.video.upsert({
    where: { youtubeId: item.id },
    update: {
      title: snippet.title,
      description: snippet.description,
      publishedAt: new Date(snippet.publishedAt),
      durationSec: duration.totalSeconds,
      chapters: chapters as never,
      hashtags: (snippet.tags ?? []) as never,
      thumbnailUrl,
      channelId: snippet.channelId,
    },
    create: {
      youtubeId: item.id,
      title: snippet.title,
      description: snippet.description,
      publishedAt: new Date(snippet.publishedAt),
      durationSec: duration.totalSeconds,
      chapters: chapters as never,
      hashtags: (snippet.tags ?? []) as never,
      thumbnailUrl,
      channelId: snippet.channelId,
    },
  })
}

const program = new Command()
  .name("get_video_details")
  .description(
    "Fetches video metadata via YouTube Data API v3 and stores it in yt.video / yt.channel",
  )

program
  .command("fetch <videoId>")
  .description("Fetch a single video and upsert to yt.video / yt.channel")
  .action(async (videoId: string) => {
    try {
      const item = await fetchVideo(videoId)
      await writeVideo(item)
      console.log(`[ok] ${videoId}`)
    } catch (e) {
      const err = e as HttpError
      console.error(`[fail] ${videoId}: ${err.message}`)
      process.exit(err.status === 403 ? 4 : 1)
    } finally {
      await prisma.$disconnect()
    }
  })

program
  .command("refresh-stale")
  .description(
    "Refreshes yt.video / yt.channel rows older than 30 days (YT Developer Policies §III.E.4)",
  )
  .option("--dry-run", "Show count, no API calls or DB writes", false)
  .option(
    "--delete-instead",
    "Delete stale rows instead of refresh (use if API key revoked)",
    false,
  )
  .action(async (opts: { dryRun: boolean; deleteInstead: boolean }) => {
    const cutoff = new Date(Date.now() - STALE_MS)
    const stale = await prisma.video.findMany({
      where: { updatedAt: { lt: cutoff } },
      select: { youtubeId: true },
    })
    console.log(
      `stale videos (updatedAt < ${cutoff.toISOString()}): ${stale.length}`,
    )

    if (opts.dryRun) {
      console.log(`\n[dry-run] no API calls or DB writes performed`)
      await prisma.$disconnect()
      return
    }

    let refreshed = 0
    let deleted = 0
    const skipped = 0
    let errors = 0

    if (opts.deleteInstead) {
      const result = await prisma.video.deleteMany({
        where: { updatedAt: { lt: cutoff } },
      })
      deleted = result.count
    } else {
      for (const { youtubeId } of stale) {
        try {
          const item = await fetchVideo(youtubeId)
          await writeVideo(item)
          refreshed++
        } catch (e) {
          const err = e as HttpError
          if (err.status === 404) {
            await prisma.video
              .delete({ where: { youtubeId } })
              .catch(() => undefined)
            deleted++
          } else if (err.status === 403) {
            console.error(
              `[quota] stopping early at ${youtubeId}: ${err.message}`,
            )
            break
          } else {
            errors++
            console.error(`[err] ${youtubeId}: ${err.message}`)
          }
        }
      }
    }

    console.log(`\n=== Summary ===`)
    console.log(`refreshed: ${refreshed}`)
    console.log(`deleted:   ${deleted}`)
    console.log(`skipped:   ${skipped}`)
    console.log(`errors:    ${errors}`)
    console.log(
      `remaining: ${stale.length - refreshed - deleted - skipped - errors}`,
    )
    await prisma.$disconnect()
  })

program.addHelpText(
  "after",
  `
Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"
  YOUTUBE_API_KEY       YouTube Data API v3 key

Examples:
  bun run src/get_video_details.ts fetch abc12345xyz
  bun run src/get_video_details.ts refresh-stale --dry-run
  bun run src/get_video_details.ts refresh-stale --delete-instead

Exit codes:
  0  success
  1  input/parse error
  2  DB connection error
  3  validation error
  4  API key / quota error (403)
`,
)

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
