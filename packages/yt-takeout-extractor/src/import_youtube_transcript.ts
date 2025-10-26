import { Effect, pipe, Duration, Data, String, Stream, Console } from "effect";
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
    title: string;
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL nicht in .env gefunden");
}

const buildYouTubeUrl = (videoId: string): string =>
    `https://www.youtube.com/watch?v=${videoId}`;

// Helper function to collect stream output as a string
const runString = <E, R>(
    stream: Stream.Stream<Uint8Array, E, R>
): Effect.Effect<string, E, R> =>
    stream.pipe(
        Stream.decodeText(),
        Stream.runFold(String.empty, String.concat)
    )


class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
    message: string,
    commandLog: string
}> { }

const executeYtDlp = (videoId: string) =>
    Effect.gen(function* () {
        const url = buildYouTubeUrl(videoId);

        const args = [
            "yt-dlp",
            "--skip-download",
            "--write-subs",
            "--write-auto-subs",
            "--sub-format",
            "srt",
            "--cookies-from-browser=chrome",
            "-o",
            `"transcript.%(ext)s"`,
            `"${url}"`
        ]
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
        yield* Effect.logInfo(`Führe yt-dlp aus für Video: ${videoId}: ${args.join(' ')}`);

        //const output: string = yield* Command.string(command)
        const [exitCode, stdout, stderr] = yield* pipe(
            // Start running the command and return a handle to the running process
            Command.start(command),
            Effect.flatMap((process) =>
                Effect.all(
                    [
                        // Waits for the process to exit and returns
                        // the ExitCode of the command that was run
                        process.exitCode,
                        // The standard output stream of the process
                        runString(process.stdout),
                        // The standard error stream of the process
                        runString(process.stderr)
                    ],
                    { concurrency: 3 }
                )
            )
        )
        const output = stdout + stderr
        if (output.includes('There are no subtitles for the requested languages')) {
            yield* new TranscriptionError({
                message: `yt-dlp fehlgeschlagen, keine subtitles für dieses Video!`,
                commandLog: output
            });
            return
        }
        if (output.includes('Unable to download video subtitles')) {
            yield* Effect.fail(new TranscriptionError({
                message: `yt-dlp fehlgeschlagen, konnte subtitle sicht herunterladen!`,
                commandLog: output
            }));
            return
        }

        if (output.includes('Writing video subtitles')) {
            console.log(output)
            yield* Effect.log(`CLI erfolgreich ausgeführt für Video: ${videoId}`);
            return
        }

        yield* Effect.dieMessage(`Unknown error during yt-dlp execution for Video "${videoId}". Output:\n\n${output}`)
    })

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


const saveErrorToDb = (
    client: Client,
    videoId: string,
    err: TranscriptionError
) =>
    Effect.tryPromise({
        try: async () => {
            await client.query(
                `INSERT INTO main.youtube_transcript (youtube_id, error)
                     VALUES ($1, $2)`,
                [videoId, `TranscriptionError: ${err.message}\n\n${err.commandLog}`]
            );

            return void 0;
        },
        catch: (error) => new Error(`Datenbankfehler beim Speichern: ${error}`),
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
                `SELECT youtube_id,title FROM ${tableName}`
            );
            return result.rows.map((row) => [row.youtube_id, row.title]);
        },
        catch: (error) =>
            new Error(`Fehler beim Laden der Video-IDs aus ${tableName}: ${error}`),
    });

const processVideo = (client: Client, videoId: string, title: string) =>
    pipe(
        videoExistsInDb(client, videoId),
        Effect.flatMap((exists) =>
            exists
                ? Effect.logInfo(`Video ${videoId} bereits vorhanden, überspringe`)
                : pipe(
                    Effect.log(`Verarbeite Video: ${videoId} - ${title}`),
                    Effect.flatMap(() => executeYtDlp(videoId)),
                    Effect.flatMap(() => findAndReadTranscripts()),
                    Effect.flatMap((transcripts) =>
                        saveTranscriptsToDb(client, videoId, transcripts)
                    ),
                    Effect.flatMap(() =>
                        Effect.log(`Video ${videoId} erfolgreich verarbeitet`)
                    ),
                    Effect.flatMap(() => Effect.sleep(Duration.seconds(30))),
                    Effect.catchTag("TranscriptionError", (err) => Effect.gen(function* () {
                        console.log(err.commandLog)
                        yield* Effect.logError(`TranscriptionError: ${err.message}`)
                        yield* saveErrorToDb(client, videoId, err)
                    })),
                )
        )
    );

const mainProgram = (schemaAndTable: string) =>
    Effect.gen(function* () {
        const client = new Client({ connectionString: DATABASE_URL });

        yield* Effect.tryPromise({
            try: () => client.connect(),
            catch: (error) =>
                new Error(`Datenbankverbindung fehlgeschlagen: ${error}`),
        });

        yield* Effect.log(`Verbunden mit Datenbank`);

        const videoIds = yield* loadVideoIds(client, schemaAndTable);

        yield* Effect.log(`${videoIds.length} Videos gefunden`);

        for (const [videoId, title] of videoIds) {
            if (!videoId || !title) {
                return yield* Effect.fail("No video id or title!")
            }
            yield* processVideo(client, videoId, title)
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
