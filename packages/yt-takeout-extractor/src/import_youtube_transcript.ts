import { Effect, pipe, Duration, Data, Console } from "effect";
import { Command as CliCommand, Args } from "@effect/cli";
import { Command } from "@effect/platform";
import { FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

interface TranscriptFile {
    filename: string;
    lang: string;
    content: string;
}

interface VideoRecord {
    youtube_id: string;
    titel: string;
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL nicht in .env gefunden");
}

const buildYouTubeUrl = (videoId: string): string =>
    `https://www.youtube.com/watch?v=${videoId}`;


class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
    message: string,
    commandLog: string
}> { }
const executeYtDlp = (videoId: string) =>
    Effect.gen(function* () {
        const url = buildYouTubeUrl(videoId);
        const command = Command.make(
            "yt-dlp",
            "--skip-download",
            "--write-subs",
            "--write-auto-subs",
            "--sub-format",
            "srt",
            "--cookies-from-browser=chrome",
            "-o",
            "transcript.%(ext)s",
            url
        )

        yield* Effect.logInfo(`Führe yt-dlp aus für Video: ${videoId}`);

        const output: string = yield* Command.string(command)

        if (output.includes('There are no subtitles for the requested languages')) {
            return yield* new TranscriptionError({
                message: `yt-dlp fehlgeschlagen, keine subtitles für dieses Video!`,
                commandLog: output
            });
        }
        if (output.includes('Unable to download video subtitles')) {
            return yield* new TranscriptionError({
                message: `yt-dlp fehlgeschlagen, konnte subtitle sicht herunterladen!`,
                commandLog: output
            });
        }

        if (output.includes('Writing video subtitles')) {
            yield* Effect.log(output);
            return yield* Effect.log(`CLI erfolgreich ausgeführt für Video: ${videoId}`);
        }

        yield* Effect.fail(new Error(`Unknown error during yt-dlp execution for Video "${videoId}". Output:\n\n${output}`))
    })

const program = Effect.gen(function* () {
    yield* executeYtDlp('abc123')
}).pipe(
    // Catch and handle the tagged error
    Effect.catchTag("TranscriptionError", (err) =>
        Console.error(`error`)
    )
)


const findAndReadTranscripts = () =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;

        const files = yield* fs.readDirectory(".");
        const transcriptFiles = files.filter(
            (f) => f.startsWith("transcript.") && f.endsWith(".srt")
        );

        if (transcriptFiles.length === 0) {
            yield* Effect.logError("Keine Transkriptdateien gefunden nach CLI-Ausführung");
            return yield* Effect.fail(
                new Error("Keine Transkriptdateien gefunden")
            );
        }

        const transcripts: TranscriptFile[] = [];

        for (const filename of transcriptFiles) {
            const content = yield* fs.readFileString(filename).pipe(
                Effect.mapError(
                    (error) => new Error(`Fehler beim Lesen von ${filename}: ${error}`)
                )
            );

            const langMatch = filename.match(/transcript\.([^.]+)\.srt/);
            const lang = langMatch?.[1] ?? "unknown";

            transcripts.push({ filename, lang, content });
            yield* Effect.logTrace(
                `Transkriptdatei gefunden: ${filename} (${lang})`
            );
        }

        return transcripts;
    }).pipe(Effect.orDie);

const saveTranscriptsToDb = (
    client: Client,
    videoId: string,
    transcripts: TranscriptFile[]
) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;

        yield* Effect.tryPromise({
            try: async () => {
                for (const transcript of transcripts) {
                    await client.query(
                        `INSERT INTO main.youtube_transcript (youtube_id, transcript_original, lang, created_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW())
             ON CONFLICT (youtube_id) 
             DO UPDATE SET 
               transcript_original = EXCLUDED.transcript_original,
               lang = EXCLUDED.lang,
               updated_at = NOW()`,
                        [videoId, transcript.content, transcript.lang]
                    );
                }
                return void 0;
            },
            catch: (error) => new Error(`Datenbankfehler beim Speichern: ${error}`),
        });

        yield* Effect.forEach(transcripts, (transcript) =>
            pipe(
                fs.remove(transcript.filename),
                Effect.tapError((error) =>
                    Effect.logError(`Fehler beim Löschen von ${transcript.filename}: ${error}`)
                ),
                Effect.flatMap(() =>
                    Effect.logTrace(`Datei gelöscht: ${transcript.filename}`)
                )
            )
        );

        yield* Effect.log(
            `Transkripte für Video ${videoId} (${transcripts.length} Dateien) verarbeitet`
        );
    });

const videoExistsInDb = (client: Client, videoId: string) =>
    Effect.tryPromise({
        try: async () => {
            const result = await client.query(
                "SELECT youtube_id FROM main.youtube_transcript WHERE youtube_id = $1",
                [videoId]
            );
            return result.rows.length > 0;
        },
        catch: (error) => new Error(`Datenbankfehler beim Prüfen: ${error}`),
    });

const loadVideoIds = (client: Client, tableName: string) =>
    Effect.tryPromise({
        try: async () => {
            const result = await client.query<VideoRecord>(
                `SELECT youtube_id,titel FROM ${tableName}`
            );
            return result.rows.map((row) => [row.youtube_id, row.titel]);
        },
        catch: (error) =>
            new Error(`Fehler beim Laden der Video-IDs aus ${tableName}: ${error}`),
    });

const processVideo = (client: Client, videoId: string) =>
    pipe(
        videoExistsInDb(client, videoId),
        Effect.flatMap((exists) =>
            exists
                ? Effect.logInfo(`Video ${videoId} bereits vorhanden, überspringe`)
                : pipe(
                    Effect.log(`Verarbeite Video: ${videoId}`),
                    Effect.flatMap(() => executeYtDlp(videoId)),
                    Effect.flatMap(() => findAndReadTranscripts()),
                    Effect.flatMap((transcripts) =>
                        saveTranscriptsToDb(client, videoId, transcripts)
                    ),
                    Effect.flatMap(() =>
                        Effect.log(`Video ${videoId} erfolgreich verarbeitet`)
                    ),
                    Effect.flatMap(() => Effect.sleep(Duration.seconds(30))),
                    Effect.catchTag("TranscriptionError", ({}))
                )
        )
    );

const mainProgram = (schemaAndTable: string) =>
    Effect.gen(function* () {
        const client = new Client({ connectionString: DATABASE_URL });
        let sleepMinutes = 10

        yield* Effect.tryPromise({
            try: () => client.connect(),
            catch: (error) =>
                new Error(`Datenbankverbindung fehlgeschlagen: ${error}`),
        });

        yield* Effect.log(`Verbunden mit Datenbank`);

        const videoIds = yield* loadVideoIds(client, schemaAndTable);

        yield* Effect.log(`${videoIds.length} Videos gefunden`);

        for (const [videoId, titel] of videoIds) {
            if (!videoId) {
                return yield* Effect.fail("No video id!")
            }
            yield* pipe(
                processVideo(client, videoId),
                Effect.catchAll((error) => pipe(
                    Effect.logError(`Fehler bei Video ${videoId} "${titel}": ${error}. WARTE ${sleepMinutes}min.`),
                ))
            );
        }

        yield* Effect.tryPromise({
            try: () => client.end(),
            catch: (error) =>
                new Error(`Fehler beim Schließen der Verbindung: ${error}`),
        });

        yield* Effect.log("Alle Videos verarbeitet");
    });

const tableArg = Args.text({ name: "table" }).pipe(
    Args.withDescription("Schema und Tabellenname (z.B. public.videos)")
);

const command = CliCommand.make(
    "download-transcripts",
    { table: tableArg },
    ({ table }) => mainProgram(table)
);

const cli = CliCommand.run(command, {
    name: "YouTube Transcript Downloader",
    version: "1.0.0",
});

pipe(
    cli(process.argv),
    Effect.provide(BunContext.layer),
    Effect.scoped,
    BunRuntime.runMain
);
