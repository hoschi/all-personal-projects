import { Effect, Schedule, Logger, pipe, Chunk } from "effect";
import { Command as CliCommand, Args } from "@effect/cli";
import { Command, CommandExecutor } from "@effect/platform";
import { FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

// Typen
interface TranscriptFile {
    filename: string;
    lang: string;
    content: string;
}

interface VideoRecord {
    youtube_id: string;
}

// Konfiguration
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL nicht in .env gefunden");
}

// Helper: YouTube URL erstellen
const buildYouTubeUrl = (videoId: string): string =>
    `https://www.youtube.com/watch?v=${videoId}`;

// Helper: CLI ausführen mit Retry-Logik
const executeYtDlp = (videoId: string) =>
    pipe(
        Effect.gen(function* (_) {
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

            const executor = yield* _(CommandExecutor.CommandExecutor);
            const result = yield* _(
                executor.start(command),
                Effect.flatMap((process) =>
                    Effect.gen(function* (_) {
                        const exitCode = yield* _(process.exitCode);
                        const stdout = yield* _(process.stdout, Effect.flatMap(Effect.runCollect));
                        const stderr = yield* _(process.stderr, Effect.flatMap(Effect.runCollect));

                        const stdoutText = stdout.map((chunk) => new TextDecoder().decode(chunk)).join("");
                        const stderrText = stderr.map((chunk) => new TextDecoder().decode(chunk)).join("");

                        if (stdoutText) {
                            yield* _(Effect.logTrace(`Standardausgabe: ${stdoutText}`));
                        }

                        if (stderrText) {
                            yield* _(Effect.logError(`Standardfehler: ${stderrText}`));
                        }

                        if (exitCode !== 0) {
                            return yield* _(Effect.fail(new Error(`yt-dlp fehlgeschlagen mit Exit-Code ${exitCode}`)));
                        }

                        return { stdout: stdoutText, stderr: stderrText };
                    })
                )
            );

            yield* _(Effect.log(`CLI erfolgreich ausgeführt für Video ${videoId}`));
            return result;
        }),
        Effect.retry(
            pipe(
                Schedule.exponential("30 seconds"),
                Schedule.compose(Schedule.recurs(5)),
                Schedule.tapInput((attempt) =>
                    Effect.logWarning(`Versuch ${attempt + 1} für Video ${videoId}`)
                )
            )
        ),
        Effect.tapError((error) =>
            Effect.logError(`CLI-Fehler nach allen Versuchen für Video ${videoId}: ${error.message}`)
        )
    );

// Helper: Transkript-Dateien finden und einlesen
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
            const lang = langMatch ? langMatch[1] : "unknown";

            transcripts.push({ filename, lang, content });
            yield* _(Effect.logTrace(`Transkriptdatei gefunden: ${filename} (${lang})`));
        }

        return transcripts;
    }).pipe(Effect.orDie);

// Helper: Transkripte in Datenbank speichern und Dateien löschen
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

                        Effect.log(
                            `Transkript für Video ${videoId} (Sprache: ${transcript.lang}) in DB gespeichert`
                        ).pipe(Effect.runSync);
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

// Helper: Prüfen ob Video bereits existiert
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

// Helper: Video-IDs aus Eingabetabelle laden
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

// Haupt-Workflow für ein einzelnes Video
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

// Haupt-Programm
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

// CLI-Definitionen
const tableArg = Args.text({ name: "table" }).pipe(
    Args.withDescription("Schema und Tabellenname (z.B. public.videos)")
);

const command = CliCommand.make("download-transcripts", { table: tableArg }, ({ table }) =>
    pipe(
        mainProgram(table),
        Effect.tapError((error) => Effect.logError(`Hauptfehler: ${error.message}`)),
        Effect.provide(BunContext.layer)
    )
);

const cli = CliCommand.run(command, {
    name: "YouTube Transcript Downloader",
    version: "1.0.0",
});

// Programm ausführen
pipe(
    cli(process.argv),
    Effect.provide(BunContext.layer),
    BunRuntime.runMain
);
