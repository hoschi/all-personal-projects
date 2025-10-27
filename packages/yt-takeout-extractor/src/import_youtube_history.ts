import { readFile } from 'fs/promises';
import { config } from 'dotenv';
import { Client } from 'pg';
import { z } from 'zod';

// https://www.perplexity.ai/search/ich-brauche-ein-typescript-scr-46H3EuQ7QMmR_sZi.v_SAQ#5

config();

const RawYouTubeHistoryEntrySchema = z.object({
  header: z.string().optional(),
  title: z.string().min(1),
  titleUrl: z.string().url(),
  subtitles: z.array(z.object({
    name: z.string(),
    url: z.string().url()
  })).optional(),
  time: z.string().datetime(),
  products: z.array(z.string()).optional(),
  activityControls: z.array(z.string()).optional(),
  details: z.string().optional()
});

type RawYouTubeHistoryEntry = z.infer<typeof RawYouTubeHistoryEntrySchema>;

type ProcessedEntry = {
  title: string;
  youtubeId: string;
  watchedTime: Date;
  details: string | null;
  activityControls: string[];
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /embed\/([^?]+)/
  ];

  return patterns
    .map(pattern => url.match(pattern)?.[1])
    .find(id => id !== undefined) ?? null;
};

const processEntry = (entry: RawYouTubeHistoryEntry): ProcessedEntry | null => {
  const youtubeId = extractYouTubeId(entry.titleUrl);

  if (!youtubeId) {
    return null;
  }

  return {
    title: entry.title,
    youtubeId,
    watchedTime: new Date(entry.time),
    details: entry.details ?? null,
    activityControls: entry.activityControls ?? []
  };
};

const insertEntry = async (
  client: Client,
  entry: ProcessedEntry,
  rawEntry: RawYouTubeHistoryEntry
): Promise<{ success: boolean; isDuplicate: boolean }> => {
  try {
    const result = await client.query(
      `INSERT INTO main.youtube_history (title, youtube_id, watched_time, details, activity_controls)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (youtube_id, watched_time) DO NOTHING`,
      [entry.title, entry.youtubeId, entry.watchedTime, entry.details, JSON.stringify(entry.activityControls)]
    );

    const isDuplicate = result.rowCount === 0;

    if (isDuplicate) {
      console.log(`Duplikat übersprungen: ${entry.youtubeId} am ${entry.watchedTime.toISOString()}`);
    }

    return { success: true, isDuplicate };
  } catch (error) {
    console.error(
      `Fehler beim Einfügen von "${entry.title}":`,
      error instanceof Error ? error.message : error
    );
    console.error('Original-Daten:', JSON.stringify(rawEntry, null, 2));
    return { success: false, isDuplicate: false };
  }
};

const processBatch = async (
  client: Client,
  entries: Array<{ processed: ProcessedEntry; raw: RawYouTubeHistoryEntry }>
): Promise<{ successful: number; failed: number; duplicates: number }> => {
  const results = await Promise.all(
    entries.map(({ processed, raw }) => insertEntry(client, processed, raw))
  );

  return results.reduce(
    (acc, result) => ({
      successful: acc.successful + (result.success && !result.isDuplicate ? 1 : 0),
      failed: acc.failed + (result.success ? 0 : 1),
      duplicates: acc.duplicates + (result.isDuplicate ? 1 : 0)
    }),
    { successful: 0, failed: 0, duplicates: 0 }
  );
};

const main = async (): Promise<number> => {
  const filename = process.argv[2];

  if (!filename) {
    console.error('Fehler: Kein Dateiname angegeben');
    console.error('Verwendung: tsx import-youtube-history.ts <dateiname>');
    return 1;
  }

  if (!process.env.DATABASE_URL) {
    console.error('Fehler: DATABASE_URL nicht in .env gesetzt');
    return 1;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  let totalStats = { successful: 0, failed: 0, duplicates: 0 };
  let hasErrors = false;

  const BATCH_SIZE = 8;

  try {
    const fileContent = await readFile(filename, 'utf-8');
    let rawEntries: unknown[];

    try {
      rawEntries = JSON.parse(fileContent);
    } catch (error) {
      console.error('Fehler beim Parsen der JSON-Datei:', error instanceof Error ? error.message : error);
      return 1;
    }

    if (!Array.isArray(rawEntries)) {
      console.error('Fehler: Datei enthält kein JSON-Array');
      return 1;
    }

    // Validierung und Verarbeitung
    const processedEntries: Array<{ processed: ProcessedEntry; raw: RawYouTubeHistoryEntry }> = [];

    for (const [index, rawEntry] of rawEntries.entries()) {
      try {
        const validated = RawYouTubeHistoryEntrySchema.parse(rawEntry);
        const processed = processEntry(validated);

        if (!processed) {
          console.error(
            `Fehler bei Eintrag ${index}: Keine YouTube-ID aus URL extrahierbar`
          );
          console.error('Original-Daten:', JSON.stringify(rawEntry, null, 2));
          hasErrors = true;
          continue;
        }

        processedEntries.push({ processed, raw: validated });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`Validierungsfehler bei Eintrag ${index}:`);
          console.error(JSON.stringify(error, null, 2));
        } else {
          console.error(`Fehler bei Eintrag ${index}:`, error instanceof Error ? error.message : error);
        }
        console.error('Original-Daten:', JSON.stringify(rawEntry, null, 2));
        hasErrors = true;
      }
    }

    await client.connect();
    console.log(`\nVerarbeite ${processedEntries.length} validierte Einträge in Batches à ${BATCH_SIZE}...`);

    // Batch-Verarbeitung
    for (let i = 0; i < processedEntries.length; i += BATCH_SIZE) {
      const batch = processedEntries.slice(i, i + BATCH_SIZE);
      const batchStats = await processBatch(client, batch);

      totalStats.successful += batchStats.successful;
      totalStats.failed += batchStats.failed;
      totalStats.duplicates += batchStats.duplicates;

      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchStats.successful} erfolgreich, ${batchStats.failed} Fehler, ${batchStats.duplicates} Duplikate`);
    }

  } catch (error) {
    console.error(
      'Kritischer Fehler:',
      error instanceof Error ? error.message : error
    );
    hasErrors = true;
  } finally {
    await client.end();
  }

  console.log('\n========== Zusammenfassung ==========');
  console.log(`Erfolgreich importiert: ${totalStats.successful}`);
  console.log(`Duplikate übersprungen: ${totalStats.duplicates}`);
  console.log(`Fehler: ${totalStats.failed}`);

  return (totalStats.failed > 0 || hasErrors) ? 1 : 0;
};

main().then(process.exit);

