import { stringify as stringifyYaml } from "yaml"
import { parseStub, findH2Sections, type H2Section } from "./markdown-parser"

export function setFrontmatterFields(
  md: string,
  fields: Record<string, string | string[]>,
): string {
  const { frontmatter, body } = parseStub(md)
  const merged = { ...frontmatter, ...fields }
  const fm = stringifyYaml(merged).trimEnd()
  return `---\n${fm}\n---\n\n${body}`
}

/**
 * Merge ein einzelnes display_title in eine bestehende aliases-Liste.
 * Tolerant gegen YAML-Eingabe: aliases kann null, string, oder Array sein.
 * Dedupliziert, bewahrt bestehende Reihenfolge.
 *
 * Cluster 4e Format-Update: display_title soll als Alias verfügbar sein,
 * damit Obsidian-Quick-Finder + Wikilink-Auflösung darauf zeigen.
 */
export function mergeAliasField(
  existing: unknown,
  displayTitle: string,
): string[] {
  let list: string[]
  if (Array.isArray(existing)) {
    list = existing.filter((x): x is string => typeof x === "string")
  } else if (typeof existing === "string" && existing.length > 0) {
    list = [existing]
  } else {
    list = []
  }
  if (!list.includes(displayTitle)) list.push(displayTitle)
  return list
}

/**
 * Extrahiert nur den Content einer H2-Sektion (ohne die "## Heading"-Zeile).
 */
function extractH2Content(body: string, section: H2Section): string {
  const slice = body.slice(section.start, section.end)
  const firstNewline = slice.indexOf("\n")
  return firstNewline === -1 ? "" : slice.slice(firstNewline + 1)
}

/**
 * Findet den H1-Header im Body (`# ...`). Liefert die ganze Zeile oder "".
 */
function findH1Line(body: string): string {
  const m = /^# .*$/m.exec(body)
  return m?.[0] ?? ""
}

/**
 * Erlaubte H2-Sektionen aus dem Pass-5-Output (außer "Worum es geht", das
 * separat als erste Sektion behandelt wird). Alles andere — insbesondere vom
 * LLM erfundene Headings wie "Agent Zusammenfassung", unter denen Reasoning-
 * Vorrede leakt — wird in assembleEnrichedBody verworfen. Lowercase für
 * case-insensitiven Lookup.
 */
const ALLOWED_REST_HEADINGS = new Set([
  "besprochene konzepte",
  "behauptungen",
  "demos / schritte",
  "genannte tools",
  "verwandt",
])

/**
 * Cluster 4e Format-Update: Setzt den Stub-Body neu zusammen aus
 * - H1 (aus existingBody bewahrt)
 * - ## Worum es geht (aus Pass-5-Output, erste Sektion)
 * - --- Trenner
 * - ## Notizen (aus existingBody bewahrt — wichtig für Idempotenz; falls fehlend leer)
 * - --- Trenner
 * - Restliche Pass-5-Sektionen, gefiltert gegen ALLOWED_REST_HEADINGS
 *   (## Besprochene Konzepte, ## Behauptungen, ...)
 *
 * Wirft kein ## Agent Zusammenfassung mehr in den Output — weder ein
 * bestehender Block aus altem existingBody noch eine vom LLM frisch im
 * Pass-5-Output erzeugte (Reasoning-Leakage). Unerwartete Headings werden
 * verworfen und geloggt.
 */
export function assembleEnrichedBody(
  passSummary: string,
  existingBody: string,
): string {
  const passSections = findH2Sections(passSummary)
  const wieGehts = passSections.find((s) => s.heading === "Worum es geht")
  const restSections = passSections.filter((s) => s.heading !== "Worum es geht")

  const existingSections = findH2Sections(existingBody)
  const existingNotizen = existingSections.find((s) => s.heading === "Notizen")
  const notizenContent = existingNotizen
    ? extractH2Content(existingBody, existingNotizen).replace(/\n+$/, "")
    : ""

  const h1 = findH1Line(existingBody)

  const parts: string[] = []
  if (h1) parts.push(h1, "")

  if (wieGehts) {
    parts.push(
      "## Worum es geht",
      "",
      extractH2Content(passSummary, wieGehts).trim(),
      "",
      "---",
      "",
    )
  }

  parts.push("## Notizen", "", notizenContent.trim(), "", "---", "")

  for (const sec of restSections) {
    if (!ALLOWED_REST_HEADINGS.has(sec.heading.toLowerCase())) {
      console.warn(
        `[assembleEnrichedBody] unerwartete H2-Sektion verworfen: "${sec.heading}"`,
      )
      continue
    }
    parts.push(
      `## ${sec.heading}`,
      "",
      extractH2Content(passSummary, sec).trim(),
      "",
    )
  }

  return parts
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+$/, "\n")
}

export interface InsertOpts {
  /** Heading-Name (ohne "## ") vor dem die neue Sektion eingefügt werden soll. */
  before?: string
}

export function insertOrReplaceH2Section(
  body: string,
  heading: string,
  content: string,
  opts: InsertOpts = {},
): string {
  const sections = findH2Sections(body)
  const existing = sections.find((s) => s.heading === heading)
  const sectionMd = `## ${heading}\n\n${content.trimEnd()}\n`

  if (existing) {
    return `${body.slice(0, existing.start)}${sectionMd}\n${body.slice(existing.end)}`
  }

  if (opts.before) {
    const beforeSec = sections.find((s) => s.heading === opts.before)
    if (beforeSec) {
      return `${body.slice(0, beforeSec.start)}${sectionMd}\n${body.slice(beforeSec.start)}`
    }
  }

  // append am Ende
  const trimmed = body.replace(/\n+$/, "")
  return `${trimmed}\n\n${sectionMd}`
}
