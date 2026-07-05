#!/usr/bin/env bun
import { readFile } from "node:fs/promises"

import { Command } from "commander"

import { prisma } from "./db"
import type { Prisma } from "./generated/prisma/client"
import { parseStub } from "./markdown-parser"

export type LookupField =
  | "plain"
  | "audited_md"
  | "llm_formatted"
  | "srt"
  | "named_entities"
  | "description_short"
  | "all"

export type LookupFormat = "markdown" | "json" | "raw"

export interface LookupOpts {
  id?: string
  file?: string
  field: LookupField
  format: LookupFormat
  noHeader: boolean
}

const VALID_FIELDS: LookupField[] = [
  "plain",
  "audited_md",
  "llm_formatted",
  "srt",
  "named_entities",
  "description_short",
  "all",
]

const VALID_FORMATS: LookupFormat[] = ["markdown", "json", "raw"]

export function parseLookupOpts(raw: {
  id?: string
  file?: string
  field?: string
  format?: string
  noHeader?: boolean
}): LookupOpts {
  if (!raw.id && !raw.file) {
    throw new Error("--id ODER --file ist Pflicht")
  }
  if (raw.id && raw.file) {
    throw new Error("--id UND --file sind gegenseitig exklusiv — eines davon")
  }
  const field = (raw.field ?? "audited_md") as string
  if (!VALID_FIELDS.includes(field as LookupField)) {
    throw new Error(
      `unbekanntes Feld "${field}". Erlaubt: ${VALID_FIELDS.join(", ")}`,
    )
  }
  const format = (raw.format ?? "markdown") as string
  if (!VALID_FORMATS.includes(format as LookupFormat)) {
    throw new Error(
      `unbekanntes Format "${format}". Erlaubt: ${VALID_FORMATS.join(", ")}`,
    )
  }
  return {
    id: raw.id,
    file: raw.file,
    field: field as LookupField,
    format: format as LookupFormat,
    noHeader: raw.noHeader ?? false,
  }
}

// yt-IDs sind exakt 11 Zeichen [A-Za-z0-9_-]. Regex-Längenbeschränkung
// schützt vor false-positives (z.B. Tracking-Param-IDs in URLs).
const YT_ID_URL_REGEX =
  /(?:youtu\.be\/|youtube\.com\/watch\?(?:[^&]*&)*v=)([A-Za-z0-9_-]{11})/

export function resolveYtIdFromFile(md: string): string {
  const parsed = parseStub(md)
  const fm = parsed.frontmatter
  if (typeof fm.youtube_id === "string" && fm.youtube_id.length > 0) {
    return fm.youtube_id
  }
  const m = parsed.body.match(YT_ID_URL_REGEX)
  if (m) {
    return m[1]!
  }
  throw new Error(
    "keine yt-id in Datei gefunden (kein youtube_id-Frontmatter, kein URL-Match)",
  )
}

const HELP_TEXT = `
yt-lookup.ts — DB-Detail-Lookup für ein einzelnes YouTube-Video

PFLICHT (eines davon):
  --id <yt-id>         konkrete YouTube-ID (z.B. wv779vmyPVY)
  --file <pfad>        Pfad zu Stub-MD im shared-Vault — Skript parst
                       youtube_id-Frontmatter oder fallback URL-Regex aus Body

OPTIONAL:
  --field <name>       welches Feld aus der DB (default: audited_md):
                       plain             — roher Transcript-Volltext, keine
                                           Markdown-Strukturierung
                       audited_md        — Pass-2-Output, ### HH:MM — Sektion
                                           strukturiert, Marker-Links aktiv
                       llm_formatted     — Pass-1-Output, eigennamen-korrigierter
                                           Roh-Transcript ohne Strukturierung
                       srt               — ursprüngliche SRT-Datei mit Zeit-Stempeln
                       named_entities    — JSON-Array Eigennamen (Pass 1)
                       description_short — Pass-4 deutsche Kurz-Beschreibung
                       all               — alle Felder + Metadaten-Header

  --format <name>      Output-Format (default: markdown):
                       markdown — H1-Header + Metadaten + Feld-Inhalt
                       json     — strukturiertes JSON (für Agent-Konsum)
                       raw      — nur der Feld-Inhalt als String, kein Wrapper

  --no-header          unterdrückt Metadaten-Header in markdown-Format
                       (sinnvoll für direkte Verkettung in Markdown-Dokumente)

EXIT-CODES:
  0  OK
  1  yt-id nicht in DB gefunden
  2  --file nicht parsebar (keine yt-id, kein Frontmatter, kein URL-Match)
  3  DB-Verbindungs-Fehler

WANN LEER:
  - plain/audited_md/llm_formatted/srt: leer wenn audit_status='pending'
    oder 'transcript_missing' (vor Pass-1-Lauf)
  - named_entities: NULL für Videos enriched vor 2026-06-07 (Cluster-7-Migration);
    seitdem JSON-Array
  - description_short: leer wenn Pass 4 noch nicht gelaufen ODER fehlgeschlagen
    (audit_status='error_pass4_description')

BEISPIELE:
  bun run yt-lookup.ts --id wv779vmyPVY
  bun run yt-lookup.ts --id wv779vmyPVY --field plain --format raw
  bun run yt-lookup.ts --file ~/.../youtube/EO/Some-Title.md --field all --format json
  bun run yt-lookup.ts --id wv779vmyPVY --field named_entities --format json
`.trim()

// Prisma-generierter Payload-Typ statt handgepflegter Interfaces: er driftet
// automatisch mit dem Schema (Feld-Rename/Nullability-Änderung → Typfehler hier
// statt Silent-Fail zur Laufzeit). select (nicht include), weil der Formatter
// nur diese Teilmenge liest — der volle include-Row aus lookupAndPrint ist
// strukturell zuweisbar. So bleibt der Formatter-Kontrakt schmal und die
// nullable Felder (youtubeId, auditStatus) kommen korrekt aus dem Schema.
type TranscriptRowForFormat = Prisma.TranscriptGetPayload<{
  select: {
    youtubeId: true
    auditStatus: true
    auditedMd: true
    plain: true
    llmFormatted: true
    srt: true
    namedEntities: true
    video: {
      select: {
        displayTitle: true
        title: true
        publishedAt: true
        durationSec: true
        descriptionShort: true
        channel: { select: { name: true; classification: true } }
      }
    }
  }
}>

function getFieldValue(
  row: TranscriptRowForFormat,
  field: LookupField,
): unknown {
  switch (field) {
    case "plain":
      return row.plain ?? ""
    case "audited_md":
      return row.auditedMd ?? ""
    case "llm_formatted":
      return row.llmFormatted ?? ""
    case "srt":
      return row.srt ?? ""
    case "named_entities":
      return row.namedEntities ?? []
    case "description_short":
      return row.video.descriptionShort ?? ""
    case "all":
      return null
  }
}

function buildHeader(row: TranscriptRowForFormat): string {
  const title = row.video.displayTitle ?? row.video.title
  const date = row.video.publishedAt
    ? row.video.publishedAt.toISOString().slice(0, 10)
    : "?"
  const secs = row.video.durationSec
  const dur =
    secs != null
      ? secs >= 3600
        ? `${Math.floor(secs / 3600)}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`
        : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`
      : "?"
  const channelStr = row.video.channel
    ? `${row.video.channel.name} (${row.video.channel.classification})`
    : "(unknown)"
  return `# ${title} (${row.youtubeId})

**Channel:** ${channelStr}
**Published:** ${date} | **Duration:** ${dur}
**Audit-Status:** ${row.auditStatus}
`
}

export function formatOutput(
  row: TranscriptRowForFormat,
  field: LookupField,
  format: LookupFormat,
  noHeader: boolean,
): string {
  if (format === "raw") {
    if (field === "all") {
      throw new Error("--field all + --format raw nicht sinnvoll kombinierbar")
    }
    const v = getFieldValue(row, field)
    return typeof v === "string" ? v : JSON.stringify(v)
  }
  if (format === "json") {
    const value =
      field === "all"
        ? {
            plain: row.plain,
            audited_md: row.auditedMd,
            llm_formatted: row.llmFormatted,
            srt: row.srt,
            named_entities: row.namedEntities,
            description_short: row.video.descriptionShort,
          }
        : getFieldValue(row, field)
    return JSON.stringify(
      {
        youtube_id: row.youtubeId,
        display_title: row.video.displayTitle ?? row.video.title,
        channel: row.video.channel
          ? {
              name: row.video.channel.name,
              classification: row.video.channel.classification,
            }
          : null,
        audit_status: row.auditStatus,
        field,
        value,
      },
      null,
      2,
    )
  }
  // markdown
  const header = noHeader ? "" : buildHeader(row)
  if (field === "all") {
    const sections = [
      ["audited_md", row.auditedMd ?? ""],
      ["plain", row.plain ?? ""],
      ["llm_formatted", row.llmFormatted ?? ""],
      ["srt", row.srt ?? ""],
      ["named_entities", JSON.stringify(row.namedEntities ?? [], null, 2)],
      ["description_short", row.video.descriptionShort ?? ""],
    ]
      .map(([k, v]) => `## ${k}\n${v}`)
      .join("\n\n")
    return header ? `${header}\n${sections}` : sections
  }
  const v = getFieldValue(row, field)
  const vStr = typeof v === "string" ? v : JSON.stringify(v, null, 2)
  return header ? `${header}\n## ${field}\n${vStr}` : vStr
}

export async function lookupAndPrint(opts: LookupOpts): Promise<number> {
  let ytId = opts.id
  if (!ytId && opts.file) {
    let md: string
    try {
      md = await readFile(opts.file, "utf-8")
    } catch (e) {
      console.error(`yt-lookup: readFile fehlgeschlagen: ${e}`)
      return 2
    }
    try {
      ytId = resolveYtIdFromFile(md)
    } catch (e) {
      console.error(`yt-lookup: ${e instanceof Error ? e.message : e}`)
      return 2
    }
  }
  if (!ytId) {
    console.error("yt-lookup: keine yt-id ermittelt")
    return 2
  }
  let row: Prisma.TranscriptGetPayload<{
    include: { video: { include: { channel: true } } }
  }> | null
  try {
    row = await prisma.transcript.findUnique({
      where: { youtubeId: ytId },
      include: { video: { include: { channel: true } } },
    })
  } catch (e) {
    console.error(
      `yt-lookup: DB-Verbindungs-Fehler: ${e instanceof Error ? e.message : e}`,
    )
    return 3
  }
  if (!row) {
    console.error(`yt-lookup: yt-id "${ytId}" nicht in DB`)
    return 1
  }
  try {
    const out = formatOutput(row, opts.field, opts.format, opts.noHeader)
    console.log(out)
    return 0
  } catch (e) {
    console.error(`yt-lookup: ${e instanceof Error ? e.message : e}`)
    return 2
  }
}

if (import.meta.main) {
  const program = new Command()
  program
    .name("yt-lookup")
    .description("DB-Detail-Lookup für ein einzelnes YouTube-Video")
    .option("--id <yt-id>", "konkrete YouTube-ID")
    .option("--file <pfad>", "Pfad zu Stub-MD")
    .option("--field <name>", "welches Feld (default: audited_md)")
    .option("--format <name>", "Output-Format (default: markdown)")
    .option("--no-header", "Metadaten-Header unterdrücken")
    .addHelpText("after", `\n${HELP_TEXT}`)
    .parse()
  const raw = program.opts()
  let opts: LookupOpts
  try {
    opts = parseLookupOpts({
      id: raw.id,
      file: raw.file,
      field: raw.field,
      format: raw.format,
      noHeader: raw.header === false,
    })
  } catch (e) {
    console.error(`yt-lookup: ${e instanceof Error ? e.message : e}`)
    process.exit(2)
  }
  let exitCode: number
  try {
    exitCode = await lookupAndPrint(opts)
  } finally {
    await prisma.$disconnect()
  }
  process.exit(exitCode)
}
