// Spiegel des Bash-Scripts bin/yt-marker-url.sh — beide Implementierungen
// müssen synchron bleiben. Tests in yt-marker.test.ts decken die gleichen
// Eingaben/Ausgaben ab wie das Bash-Script.

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/
const TS_MMSS_REGEX = /^(\d{1,2}):(\d{2})$/
const TS_HMMSS_REGEX = /^(\d{1,2}):(\d{2}):(\d{2})$/

export class TimestampParseError extends Error {}
export class YoutubeIdError extends Error {}

export function timestampToSeconds(ts: string): number {
  const hmm = TS_HMMSS_REGEX.exec(ts)
  if (hmm) {
    const h = Number(hmm[1])
    const m = Number(hmm[2])
    const s = Number(hmm[3])
    if (m > 59) throw new TimestampParseError(`Minuten > 59 in '${ts}'`)
    if (s > 59) throw new TimestampParseError(`Sekunden > 59 in '${ts}'`)
    return h * 3600 + m * 60 + s
  }
  const mm = TS_MMSS_REGEX.exec(ts)
  if (mm) {
    const m = Number(mm[1])
    const s = Number(mm[2])
    if (s > 59) throw new TimestampParseError(`Sekunden > 59 in '${ts}'`)
    return m * 60 + s
  }
  throw new TimestampParseError(
    `ungültiges Timestamp-Format '${ts}' (erwarte M:SS, MM:SS, H:MM:SS oder HH:MM:SS)`,
  )
}

export function buildMarkerUrl(youtubeId: string, ts: string): string {
  if (!YOUTUBE_ID_REGEX.test(youtubeId)) {
    throw new YoutubeIdError(`ungültige Video-ID '${youtubeId}'`)
  }
  const seconds = timestampToSeconds(ts)
  return `https://www.youtube.com/watch?v=${youtubeId}&t=${seconds}s`
}

// Regex für einen einzelnen Timestamp (M:SS, MM:SS, H:MM:SS, HH:MM:SS).
// Capture-Group 0 = ganzer Timestamp.
const TS_INLINE = String.raw`\d{1,2}(?::\d{2}){1,2}`

// Erkennt H3-Sektion-Header, die mit einem Timestamp beginnen. Trennzeichen
// zwischen Timestamp und Titel: em-dash `—`, en-dash `–`, doppelter Bindestrich
// `--`, einfacher Bindestrich `-` (jeweils umschlossen von Whitespace).
//
// Wenn der Timestamp schon in einem Markdown-Link `[ts](url)` steckt, matcht
// dieser Regex NICHT — das macht linkifyTimestamps idempotent.
const SECTION_HEADER_REGEX = new RegExp(
  String.raw`^(### )(${TS_INLINE})(\s+(?:—|–|--|-)\s+)`,
  "gm",
)

// Erkennt einen Timestamp innerhalb einer Werbung-Marker-Zeile:
//   > [!info] Werbung ausgeschnitten (3:24–5:12, ~Sponsor "...")
// Wir verlinken jeden Timestamp einzeln, behalten den Range-Separator (`–`)
// bei.
const AD_MARKER_LINE_REGEX = /^(\s*> ?\[!info\] Werbung ausgeschnitten .*)$/gm

// Erkennt einen Timestamp in Klammern, typischerweise in Pass-5-Behauptungen.
//   "- Behauptung ... (3:24)"
// Wir matchen nur wenn die Klammer einen einzelnen Timestamp enthält
// (optional mit Trailing-Whitespace), nicht z.B. "(3:24, weiter)".
const PAREN_TS_REGEX = new RegExp(String.raw`\((${TS_INLINE})\s*\)`, "g")

// Matcht einen Timestamp, der NICHT schon in einem Markdown-Link `[ts](url)`
// steckt. Wir nutzen das für die Werbung-Marker-Zeile, wo die Timestamps frei
// in Text stehen.
const FREE_TS_REGEX = new RegExp(String.raw`(?<!\[)(${TS_INLINE})(?!\]\()`, "g")

function safeLinkify(ts: string, youtubeId: string): string {
  // Wenn der Timestamp nicht valide ist (z.B. M > 59 in H:MM:SS), lassen wir
  // ihn unverändert stehen statt zu crashen — die Pipeline soll robust sein,
  // ein einzelner kaputter Timestamp blockiert nicht das ganze Video.
  try {
    const url = buildMarkerUrl(youtubeId, ts)
    return `[${ts}](${url})`
  } catch {
    return ts
  }
}

export function linkifyTimestamps(md: string, youtubeId: string): string {
  // Bewusst keine harte ID-Validation hier: linkifyTimestamps soll robust
  // sein. Bei kaputter ID fängt safeLinkify das pro Timestamp ab und gibt
  // die rohe Zeichenkette zurück → Pipeline crasht nicht wegen eines
  // ID-Validierungsproblems an dieser Stelle. `buildMarkerUrl` (public API)
  // wirft weiterhin sauber bei invalid IDs.
  let out = md

  // 1. Sektion-Header `### <ts> — <title>`
  out = out.replace(
    SECTION_HEADER_REGEX,
    (_full, prefix: string, ts: string, sep: string) => {
      return `${prefix}${safeLinkify(ts, youtubeId)}${sep}`
    },
  )

  // 2. Werbung-Marker-Zeile (alle freien Timestamps in der Zeile linkifizieren)
  out = out.replace(AD_MARKER_LINE_REGEX, (line: string) => {
    return line.replace(FREE_TS_REGEX, (_match, ts: string) => {
      return safeLinkify(ts, youtubeId)
    })
  })

  // 3. Pass-5-Behauptungen: Klammer-Timestamps `(<ts>)`. Idempotent, weil
  // PAREN_TS_REGEX nur `(<ts>)` ohne öffnende `[` matcht — `[ts](url)` bleibt
  // also unangetastet beim zweiten Lauf.
  out = out.replace(PAREN_TS_REGEX, (_full, ts: string) => {
    return `(${safeLinkify(ts, youtubeId)})`
  })

  return out
}
