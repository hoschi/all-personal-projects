import { callClaudeCli } from "../llm-caller"

export function extractFirstH3Section(auditedMd: string): string {
  const firstH3 = /^### .*$/m.exec(auditedMd)
  if (!firstH3) return auditedMd
  const afterFirst = auditedMd.slice(firstH3.index)
  const nextH3 = /\n### /.exec(afterFirst.slice(firstH3[0].length))
  return nextH3
    ? afterFirst.slice(0, firstH3[0].length + nextH3.index)
    : afterFirst
}

export interface Pass3Input {
  originalTitle: string
  description: string
  firstSection: string
}

export function buildPass3Prompt(input: Pass3Input): string {
  return `Du bekommst die Description und die erste inhaltliche Sektion eines
YouTube-Videos.

Aufgabe: Erzeuge einen Titel, der den Inhalt sachlich beschreibt —
kein Clickbait, keine Emojis, keine Caps-Lock-Wörter, keine rhetorischen Fragen.

Constraints:
- max 80 Zeichen
- deutsch ODER englisch (Original-Sprache des Videos beibehalten)
- nicht den Original-Titel umformulieren, sondern aus dem Inhalt schöpfen
- Format: "<Thema> — <konkrete Substanz>" oder "<Tool/Technik>: <was wird gezeigt>"

Original-Titel (zur Negativ-Referenz, nicht als Vorlage):
${input.originalTitle}

Description:
${input.description}

Erste Sektion:
${input.firstSection}

Antworte mit dem Titel als Klartext, keine Anführungszeichen, keine Erklärung.`
}

export async function runPass3(
  originalTitle: string,
  description: string,
  auditedMd: string,
): Promise<string> {
  const firstSection = extractFirstH3Section(auditedMd)
  const prompt = buildPass3Prompt({ originalTitle, description, firstSection })
  const raw = await callClaudeCli({
    prompt,
    allowedTools: "",
    model: "sonnet",
    effort: "low",
  })
  return raw.trim().replace(/^["']|["']$/g, "")
}
