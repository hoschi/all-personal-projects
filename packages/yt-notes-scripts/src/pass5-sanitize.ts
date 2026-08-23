// Single-backtick inline-code span (no newline, no nested backtick).
const INLINE_CODE_RE = /`([^`\n]+)`/g

// A span content is a "wrapped link" when it STARTS with a wikilink (`[[`)
// or a markdown link (`[text](`). Trailing description after the link is fine
// — the LLM is prompted with examples like `[[name]] — desc` and copies the
// backticks around the whole bullet, which we want to unwrap entirely.
const STARTS_WITH_LINK_RE = /^!?\[(\[|[^\]]*\]\()/

/**
 * Removes backticks that the summary LLM wrongly wraps around Obsidian links,
 * which would otherwise render the link as inline code instead of a clickable
 * link. Only spans whose content starts with link syntax are unwrapped, so
 * genuine inline code (`const x = 1`, `arr[0]`, `score_native >= 0.8`) and
 * fenced code blocks stay untouched.
 */
export function stripLinkBackticks(text: string): string {
  return text.replace(INLINE_CODE_RE, (match, content: string) =>
    STARTS_WITH_LINK_RE.test(content.trim()) ? content : match,
  )
}

/**
 * Verwirft alles vor der ersten `## `-Überschrift und heilt dabei einen
 * fehlenden Zeilenumbruch davor.
 *
 * Der Pass-5-Prompt verbietet Vorrede, aber Modelle halten sich nicht immer
 * daran. Klebt die Vorrede ohne Zeilenumbruch an der ersten Überschrift
 * (`…Konzepte.## Worum es geht`), dann sieht `findH2Sections` diese Sektion
 * nicht — sie prüft `line.startsWith("## ")` — und `assembleEnrichedBody`
 * lässt sie ersatzlos weg. Gemessen am 2026-08-23 an Video `qnIu-Xu64H0`:
 * `## Worum es geht` fehlte in der erzeugten Vault-Datei, die übrigen fünf
 * Sektionen waren da. Eine Vorrede darf keine Sektion kosten.
 *
 * Regeln:
 * - Fenced Code Blocks werden übersprungen, gleiche Fence-Logik wie
 *   `findH2Sections`, damit beide dieselbe erste Überschrift sehen.
 * - `###` und tiefer zählen nicht als Treffer.
 * - Ohne `## `-Überschrift bleibt der Text unverändert — lieber Vorrede
 *   behalten als alles verwerfen.
 *
 * Bekannte Unschärfe: enthält die Vorrede selbst die Zeichenfolge `## `
 * (z.B. weil das Modell die Sektionsnamen aufzählt), schneidet die Funktion
 * an dieser Stelle. Das erzeugt eine schiefe Überschrift statt einer
 * fehlenden Sektion — der billigere der beiden Schäden.
 */
export function dropPreambleBeforeFirstH2(text: string): string {
  const lines = text.split("\n")
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ""
    if (/^```/.test(line.trim())) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const idx = line.indexOf("## ")
    // `### `/`#### ` treffen die Suche eine Position später — der Zeichen
    // davor ist dann eine Raute und der Treffer keine H2.
    if (idx < 0 || line[idx - 1] === "#") continue
    if (line.slice(idx + 3).trim() === "") continue
    if (i === 0 && idx === 0) return text
    return [line.slice(idx), ...lines.slice(i + 1)].join("\n")
  }
  return text
}
