import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';
import { z } from 'zod';

// https://www.perplexity.ai/search/du-bist-eine-coding-ki-fur-ein-XTsxFCmKTn2oAEsk_K_S8g#1

// Lade .env
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL nicht gesetzt');
  process.exit(2);
}

// --- SCHEMAS ---
const NoteLinkSchema = z.object({
  youtube_id: z.string().min(5),
  titel: z.string().optional(),
  file_name: z.string().min(1),
});
type NoteLink = z.infer<typeof NoteLinkSchema>;

// -- Hilfsfunktionen --
const isYouTubeUrl = (url: string): boolean =>
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url);

const extractYouTubeId = (url: string): string | null => {
  // Unterstützung für verschiedene URL-Formate
  let m = url.match(/[?&]v=([\w-]{11})/);
  if (m) return m[1];
  m = url.match(/youtu\.be\/([\w-]{11})/);
  if (m) return m[1];
  m = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (m) return m[1];
  return null;
};

const extractFirstH1 = (md: string): string | undefined =>
  (md.match(/^# (.+)$/m) || [])[1];

const findAllMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? findAllMarkdownFiles(res) : res.endsWith('.md') ? [res] : [];
  }));
  return files.flat();
};

const extractLinks = (markdown: string): { label: string; url: string }[] => {
  // Regex für [text](url)
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const result: { label: string; url: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(markdown))) {
    result.push({ label: m[1], url: m[2] });
  }
  return result;
};

// --- DB LOGIK ---
const insertNoteLink = async (
  client: Client,
  note: NoteLink
): Promise<'inserted' | 'duplicate' | 'title-mismatch'> => {
  const { youtube_id, titel, file_name } = note;

  // Prüfe, ob exakt dieser Eintrag schon existiert (youtube_id + titel + file_name)
  const exactMatch = await client.query(
    'SELECT * FROM youtube_note_links WHERE youtube_id = $1 AND titel IS NOT DISTINCT FROM $2 AND file_name = $3',
    [youtube_id, titel ?? null, file_name]
  );

  if (exactMatch.rows.length > 0) {
    return 'duplicate';
  }

  // Prüfe, ob YouTube-ID mit anderem Titel existiert
  const conflictingRes = await client.query(
    'SELECT * FROM youtube_note_links WHERE youtube_id = $1 AND titel IS DISTINCT FROM $2',
    [youtube_id, titel ?? null]
  );

  if (conflictingRes.rows.length > 0) {
    return 'title-mismatch';
  }

  // Insert neuen Eintrag
  await client.query(
    'INSERT INTO youtube_note_links (youtube_id, titel, file_name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [youtube_id, titel ?? null, file_name]
  );

  return 'inserted';
};

// --- HAUPTLOGIK ---
const logInfo = (msg: string) => console.log('\x1b[34m[INFO]\x1b[0m', msg);
const logWarn = (msg: string) => console.warn('\x1b[33m[WARN]\x1b[0m', msg);
const logErr = (msg: string) => console.error('\x1b[31m[ERR]\x1b[0m', msg);

const main = async (): Promise<number> => {
  const [_, __, folder] = process.argv;
  if (!folder) {
    logErr('Ordnername fehlt als Argument.');
    return 2;
  }

  // DB Connect
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  let inserted = 0;
  let errors = 0;

  try {
    const files = await findAllMarkdownFiles(folder);
    logInfo(`${files.length} Markdown-Dateien gefunden.`);

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const titel = extractFirstH1(content);
      const links = extractLinks(content).filter(l => l.label === "URL");

      for (const link of links) {
        const { url } = link;

        if (!isYouTubeUrl(url)) {
          logErr(`${file}: Link kein YouTube-Link: ${url}`);
          errors++;
          continue;
        }

        const youtube_id = extractYouTubeId(url);
        if (!youtube_id) {
          logErr(`${file}: konnte YouTube-Id nicht extrahieren: ${url}`);
          errors++;
          continue;
        }

        const data: NoteLink = {
          youtube_id,
          file_name: path.resolve(file),
          ...(titel ? { titel } : {})
        };

        const parse = NoteLinkSchema.safeParse(data);
        if (!parse.success) {
          logErr(`Validierungsfehler: ${JSON.stringify(parse.error)}`);
          errors++;
          continue;
        }

        const result = await insertNoteLink(client, data);
        if (result === 'inserted') {
          logInfo(`DB: Eingefügt: id=${youtube_id}, titel=${titel}, datei=${file}`);
          inserted++;
        } else if (result === 'duplicate') {
          logWarn(`Bereits vorhanden (kein Fehler): id=${youtube_id} / titel=${titel} / datei=${file}`);
        } else if (result === 'title-mismatch') {
          logErr(`Fehler: id ${youtube_id} existiert mit anderem Titel als "${titel}" (in ${file})`);
          errors++;
        }
      }
    }
  } finally {
    await client.end();
  }

  logInfo(`\nFertig. Neu eingetragen: ${inserted}. Fehler: ${errors}`);
  return errors > 0 ? 1 : 0;
};

main().then(code => process.exit(code));
