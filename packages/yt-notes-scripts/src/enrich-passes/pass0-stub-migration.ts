import {
  findH2Sections,
  getBodyBetweenH1AndFirstH2OrEnd,
} from "../markdown-parser"

/**
 * Hebt User-Inhalt direkt unter H1 in eine `## Notizen`-Sektion.
 * Wenn schon H2-Sektionen vorhanden sind: unverändert.
 * Wenn nur Whitespace zwischen H1 und EOF: unverändert.
 */
export function migrateStubBody(body: string): string {
  const sections = findH2Sections(body)
  if (sections.length > 0) return body
  const content = getBodyBetweenH1AndFirstH2OrEnd(body).trim()
  if (content.length === 0) return body
  const h1Match = /^# .*$/m.exec(body)
  if (!h1Match) return body
  const afterH1End = h1Match.index + h1Match[0].length
  return `${body.slice(0, afterH1End)}\n\n## Notizen\n\n${content}\n`
}
