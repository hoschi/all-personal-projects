import { Effect, Schedule, pipe } from "effect";
import { Command as CliCommand, Args } from "@effect/cli";
import { Command, CommandExecutor } from "@effect/platform";
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
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL nicht in .env gefunden");
}

const buildYouTubeUrl = (videoId: string): string =>
    `https://www.youtube.com/watch?v=${videoId}`;

const executeYtDlp = (videoId: string) =>
    Effect.gen(function* (_) {
        const executor = yield* _(CommandExecutor.CommandExecutor);
        const url = buildYouTubeUrl(videoId);
        const command = Command.make("yt-dlp",
            "--skip-download",
            "--write-subs",
            "--write-auto-subs",
            "--sub-format", "srt",
            "-o", "transcript.%(ext)s",
            url
        );

        yield* _(Effect.logTrace(`Führe yt-dlp aus für Video: ${videoId}`));

        const exitCode = yield* _(Command.exitCode(command));

        if (exitCode !== 0) {
            return yield* _(Effect.fail(new Error(`yt-dlp fehlgeschlagen mit Exit-Code ${exitCode}`)));
        }

        yield* _(Effect.log(`CLI erfolgreich ausgeführt für Video ${videoId}`));
        return exitCode;
    }).pipe(
        Effect.retry(
            Schedule.exponential("30 seconds").pipe(
                Schedule.intersect(Schedule.recurs(5)),
                Schedule.tapInput((attempt: number) =>
                    Effect.logWarning(`Versuch ${attempt + 1} für Video ${videoId}`)
                )
            )
        ),
        Effect.tapError((error: Error) =>
            Effect.logError(`CLI-Fehler nach allen Versuchen für Video ${videoId}: ${error.message}`)
        )
    );

const findAndReadTranscripts = () =>
    Effect.gen(function* (_) {
        const fs = yield* _(FileSystem.FileSystem);

        const files = yield* _(fs.readDirectory("."));
        const transcriptFiles = files.filter((f) => f.startsWith("transcript.") && f.endsWith(".srt"));

        if (transcriptFiles.length === 0) {
            yield* _(Effect.logError("Keine Transkriptdateien gefunden nach CLI-Ausführung"));
            return yield* _(Effect.fail(new Error("Keine Transkriptdateien gefunden")));
        }

        const transcripts: TranscriptFile[] = [];

        for (const filename of transcriptFiles) {
            const content = yield* _(
                fs.readFileString(filename),
                Effect.mapError((error) => new Error(`Fehler beim Lesen von ${filename}: ${error}`))
            );

            const langMatch = filename.match(/transcript\.([^.]+)\.srt/);
            const lang = langMatch?.[1] ?? "unknown";

            transcripts.push({ filename, lang, content });
            yield* _(Effect.logTrace(`Transkriptdatei gefunden: ${filename} (${lang})`));
        }

        return transcripts;
    }).pipe(Effect.orDie);

const saveTranscriptsToDb = (
    client: Client,
    videoId: string,
    transcripts: TranscriptFile[]
) =>
    Effect.gen(function* (_) {
        const fs = yield* _(FileSystem.FileSystem);

        yield* _(
            Effect.tryPromise({
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

                        yield * _(Effect.log(
                            `Transkript für Video ${videoId} (Sprache: ${transcript.lang}) in DB gespeichert`
                        ));
                    }
                },
                catch: (error) => new Error(`Datenbankfehler beim Speichern: ${error}`),
            })
        );

        for (const transcript of transcripts) {
            yield* _(
                fs.remove(transcript.filename),
                Effect.tapError((error) =>
                    Effect.logError(`Fehler beim Löschen von ${transcript.filename}: ${error}`)
                )
            );
            yield* _(Effect.logTrace(`Datei gelöscht: ${transcript.filename}`));
        }
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
                `SELECT youtube_id FROM ${tableName}`
            );
            return result.rows.map((row) => row.youtube_id);
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
                    Effect.flatMap((transcripts) => saveTranscriptsToDb(client, videoId, transcripts)),
                    Effect.flatMap(() => Effect.log(`Video ${videoId} erfolgreich verarbeitet`)),
                    Effect.flatMap(() => Effect.sleep("30 seconds"))
                )
        )
    );

const mainProgram = (schemaAndTable: string) =>
    Effect.gen(function* (_) {
        const client = new Client({ connectionString: DATABASE_URL });

        yield* _(Effect.tryPromise({
            try: () => client.connect(),
            catch: (error) => new Error(`Datenbankverbindung fehlgeschlagen: ${error}`),
        }));

        yield* _(Effect.log(`Verbunden mit Datenbank`));

        const videoIds = yield* _(loadVideoIds(client, schemaAndTable));

        yield* _(Effect.log(`${videoIds.length} Videos gefunden`));

        for (const videoId of videoIds) {
            yield* _(processVideo(client, videoId));
        }

        yield* _(Effect.tryPromise({
            try: () => client.end(),
            catch: (error) => new Error(`Fehler beim Schließen der Verbindung: ${error}`),
        }));

        yield* _(Effect.log("Alle Videos verarbeitet"));
    });

const tableArg = Args.text({ name: "table" }).pipe(
    Args.withDescription("Schema und Tabellenname (z.B. public.videos)")
);

const command = CliCommand.make("download-transcripts", { table: tableArg }, ({ table }) =>
    mainProgram(table)
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
