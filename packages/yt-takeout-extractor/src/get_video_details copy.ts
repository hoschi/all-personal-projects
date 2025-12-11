import {
  Effect,
  pipe,
  Data,
  Schema,
  Context,
  Layer,
  Command,
  Args,
  CliCommand,
  Console,
  Duration,
  FileSystem,
  String,
  Schedule,
} from "effect"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Client } from "pg"
import * as dotenv from "dotenv"

dotenv.config()

// ============= Type Definitions =============

interface Chapter {
  title: string
  time: string
  timeInSeconds: number
}

interface VideoSnippet {
  title: string
  description: string
  publishedAt: string
  channelTitle: string
  tags?: string[]
}

interface VideoContentDetails {
  duration: string
}

interface VideoItem {
  id: string
  snippet: VideoSnippet
  contentDetails: VideoContentDetails
}

interface YouTubeApiResponse {
  items: VideoItem[]
}

interface VideoData {
  id: string
  title: string
  description: string
  publishedAt: string
  channelTitle: string
  tags: string[]
  duration: string
  chapters: Chapter[]
}

// ============= Effect Error Classes =============

class YouTubeApiError extends Data.TaggedError("YouTubeApiError")<{
  videoId: string
  message: string
}> {}

class DatabaseError extends Data.TaggedError("DatabaseError")<{
  operation: string
  message: string
}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{
  field: string
  message: string
}> {}

// ============= Effect Schema =============

const VideoItemSchema = Schema.Struct({
  id: Schema.String,
  snippet: Schema.Struct({
    title: Schema.String,
    description: Schema.String,
    publishedAt: Schema.String,
    channelTitle: Schema.String,
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
  contentDetails: Schema.Struct({
    duration: Schema.String,
  }),
})

const YouTubeApiResponseSchema = Schema.Struct({
  items: Schema.NonEmptyArray(VideoItemSchema),
})

// ============= Effect Contexts and Layers =============

const ConfigService = Context.Tag<{
  getYoutubeApiKey: () => Effect.Effect<string, ValidationError>
}>()

const ConfigServiceLive = Layer.effect(
  ConfigService,
  Effect.gen(function* () {
    const apiKey = process.env.YOUTUBE_API_KEY
    return {
      getYoutubeApiKey: () =>
        apiKey
          ? Effect.succeed(apiKey)
          : Effect.fail(
              new ValidationError({
                field: "YOUTUBE_API_KEY",
                message:
                  "YouTube API Key ist nicht gesetzt. Bitte .env Datei prüfen.",
              }),
            ),
    }
  }),
)

const DatabaseService = Context.Tag<{
  saveVideoDetails: (video: VideoData) => Effect.Effect<void, DatabaseError>
  videoExists: (videoId: string) => Effect.Effect<boolean, DatabaseError>
}>()

const DatabaseServiceLive = Layer.effect(
  DatabaseService,
  Effect.gen(function* () {
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      yield* Effect.fail(
        new ValidationError({
          field: "DATABASE_URL",
          message: "DATABASE_URL ist nicht gesetzt. Bitte .env Datei prüfen.",
        }),
      )
    }

    const client = new Client({ connectionString: DATABASE_URL })

    yield* Effect.tryPromise({
      try: () => client.connect(),
      catch: (error) =>
        new DatabaseError({
          operation: "connect",
          message: `Datenbankverbindung fehlgeschlagen: ${error}`,
        }),
    })

    return {
      saveVideoDetails: (video: VideoData) =>
        Effect.tryPromise({
          try: () =>
            client.query(
              `INSERT INTO main.youtube_video_details (
                        youtube_id, title, description, published_at, duration, chapters, created_at, updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                    ON CONFLICT (youtube_id) 
                    DO UPDATE SET 
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        published_at = EXCLUDED.published_at,
                        duration = EXCLUDED.duration,
                        chapters = EXCLUDED.chapters,
                        updated_at = NOW()`,
              [
                video.id,
                video.title,
                video.description,
                video.publishedAt,
                video.duration,
                JSON.stringify(video.chapters),
              ],
            ),
          catch: (error) =>
            new DatabaseError({
              operation: "save",
              message: `Fehler beim Speichern der Video-Details: ${error}`,
            }),
        }),
      videoExists: (videoId: string) =>
        Effect.tryPromise({
          try: () =>
            client.query(
              "SELECT 1 FROM main.youtube_video_details WHERE youtube_id = $1",
              [videoId],
            ),
          catch: (error) =>
            new DatabaseError({
              operation: "exists",
              message: `Fehler beim Prüfen ob Video existiert: ${error}`,
            }),
        }).pipe(Effect.map((result) => (result as any).rows.length > 0)),
    }
  }),
)

// ============= Effect Utilities =============

const extractChaptersFromDescription = (
  description: string,
): Effect.Effect<Chapter[], ValidationError> =>
  Effect.gen(function* () {
    const timestampPattern =
      /(\d{1,2}):(\d{2}):?(\d{2})?\s*[-–]\s*(.+?)(?=\n|$)/g
    const chapters: Chapter[] = []
    let match: RegExpExecArray | null

    while ((match = timestampPattern.exec(description)) !== null) {
      const hours = parseInt(match[1]!, 10)
      const minutes = parseInt(match[2]!, 10)
      const seconds = match[3] ? parseInt(match[3]!, 10) : 0
      const title = match[4]!.trim()

      const totalSeconds = hours * 3600 + minutes * 60 + seconds

      chapters.push({
        title,
        time: `${match[1]?.padStart(2, "0")}:${match[2]?.padStart(2, "0")}:${(match[3] || "00").padStart(2, "0")}`,
        timeInSeconds: totalSeconds,
      })
    }

    if (chapters.length === 0) {
      yield* Effect.logWarning("Keine Kapitel in der Beschreibung gefunden")
    }

    return chapters
  })

const formatDuration = (isoDuration: string): string => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const match = isoDuration.match(regex)

  if (!match) return isoDuration

  const hours = match[1] ? parseInt(match[1]!, 10) : 0
  const minutes = match[2] ? parseInt(match[2]!, 10) : 0
  const seconds = match[3] ? parseInt(match[3]!, 10) : 0

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ============= Effect API Functions =============

const getVideoData = (
  videoId: string,
): Effect.Effect<VideoData, YouTubeApiError | ValidationError> =>
  Effect.gen(function* () {
    // Validate video ID
    if (!videoId || videoId.trim() === "") {
      yield* Effect.fail(
        new ValidationError({
          field: "videoId",
          message: "Video ID darf nicht leer sein.",
        }),
      )
    }

    const apiKey = yield* ConfigService.getYoutubeApiKey()
    const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"

    // Make API request using axios
    const axios = await import("axios")

    const response = yield* Effect.tryPromise({
      try: () =>
        axios.default.get<YouTubeApiResponse>(
          `${YOUTUBE_API_BASE_URL}/videos`,
          {
            params: {
              part: "snippet,contentDetails",
              id: videoId,
              key: apiKey,
            },
          },
        ),
      catch: (error) =>
        new YouTubeApiError({
          videoId,
          message: `Fehler beim Abrufen der Video-Informationen: ${error instanceof Error ? error.message : String(error)}`,
        }),
    })

    // Validate API response
    const validatedResponse = yield* Schema.parse(YouTubeApiResponseSchema)(
      response.data,
    ).pipe(
      Effect.mapError(
        (e) =>
          new YouTubeApiError({
            videoId,
            message: `API Response Validation: ${e.toString()}`,
          }),
      ),
    )

    if (validatedResponse.items.length === 0) {
      yield* Effect.fail(
        new YouTubeApiError({
          videoId,
          message: `Kein Video mit der ID "${videoId}" gefunden.`,
        }),
      )
    }

    const videoItem = validatedResponse.items[0]
    const snippet = videoItem.snippet
    const description = snippet.description || ""

    // Extract chapters
    const chapters = yield* extractChaptersFromDescription(description)

    const videoData: VideoData = {
      id: videoItem.id,
      title: snippet.title,
      description,
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
      tags: snippet.tags || [],
      duration: videoItem.contentDetails.duration,
      chapters,
    }

    yield* Effect.log(`Video-Daten erfolgreich abgerufen: ${videoData.title}`)
    return videoData
  })

const saveVideoDetails = (
  video: VideoData,
): Effect.Effect<void, DatabaseError> =>
  Effect.gen(function* () {
    const database = yield* DatabaseService
    const exists = yield* database.videoExists(video.id)

    if (exists) {
      yield* Effect.log(`Video ${video.id} bereits vorhanden, überspringe`)
      return
    }

    yield* database.saveVideoDetails(video)
    yield* Effect.log(`Video ${video.id} erfolgreich in Datenbank gespeichert`)
  })

// ============= Effect Processing Pipeline =============

const processVideo = (
  videoId: string,
): Effect.Effect<void, YouTubeApiError | ValidationError | DatabaseError> =>
  Effect.gen(function* () {
    yield* Effect.log(`⏳ Verarbeite Video: ${videoId}`)

    const videoData = yield* getVideoData(videoId)
    yield* saveVideoDetails(videoData)

    yield* Effect.log(`✅ Video ${videoId} erfolgreich verarbeitet`)
  })

// ============= CLI Integration =============

const videoIdArg = Args.text({ name: "videoId" }).pipe(
  Args.withDescription("YouTube Video ID (z.B. wkTHCRSNhYo)"),
)

const command = CliCommand.make(
  "get-video-details",
  { videoId: videoIdArg },
  ({ videoId }: { videoId: string }) =>
    pipe(
      processVideo(videoId),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError(`❌ Fehler: ${error.message}`)
          yield* Console.error(`Fehler bei der Verarbeitung: ${error.message}`)
        }),
      ),
    ),
)

const cli = CliCommand.run(command, {
  name: "YouTube Video Details Extractor",
  version: "1.0.0",
})

// ============= Main Program =============

const main = (args: string[]) =>
  pipe(
    cli(args),
    Effect.provide(
      Layer.mergeAll(ConfigServiceLive, DatabaseServiceLive, BunContext.layer),
    ),
    Effect.scoped,
    BunRuntime.runMain,
  )

// Run the program
main(process.argv)
