import { parse as parseYaml } from "yaml"

export interface ParsedStub {
  frontmatter: Record<string, unknown>
  body: string
}

export function parseStub(md: string): ParsedStub {
  const fmMatch = /^---\n([\s\S]*?)\n---\n?/.exec(md)
  if (!fmMatch) return { frontmatter: {}, body: md }
  const fmYaml = fmMatch[1] ?? ""
  const body = md.slice(fmMatch[0].length).replace(/^\n+/, "")
  let frontmatter: Record<string, unknown> = {}
  try {
    frontmatter = (parseYaml(fmYaml) ?? {}) as Record<string, unknown>
  } catch {
    frontmatter = {}
  }
  return { frontmatter, body }
}

export interface H2Section {
  heading: string
  start: number // index in body where "## " line starts
  end: number // index of next H2 or end of body
}

export function findH2Sections(body: string): H2Section[] {
  const lines = body.split("\n")
  const sections: H2Section[] = []
  let offset = 0
  let current: { heading: string; start: number } | null = null
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current)
        sections.push({
          heading: current.heading,
          start: current.start,
          end: offset,
        })
      current = { heading: line.slice(3).trim(), start: offset }
    }
    offset += line.length + 1
  }
  if (current)
    sections.push({
      heading: current.heading,
      start: current.start,
      end: body.length,
    })
  return sections
}

export function getBodyBetweenH1AndFirstH2OrEnd(body: string): string {
  const h1Match = /^# .*$/m.exec(body)
  if (!h1Match) return body
  const afterH1Start = h1Match.index + h1Match[0].length
  const rest = body.slice(afterH1Start)
  const h2Match = /\n## /m.exec(rest)
  if (!h2Match) return rest
  return rest.slice(0, h2Match.index)
}
