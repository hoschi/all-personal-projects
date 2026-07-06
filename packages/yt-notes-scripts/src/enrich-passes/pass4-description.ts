import { callClaudeCli } from "../llm-caller"

export interface Pass4Input {
  description: string
  auditedMd: string
}

export function buildPass4Prompt(input: Pass4Input): string {
  return `Schreibe eine kompakte 3-Satz-Beschreibung des Video-Inhalts:
- Satz 1: Was wird gezeigt/erklärt (Subjekt, Aktion, Objekt).
- Satz 2: Konkrete Substanz — welche Tools, Konzepte, Schritte werden gezeigt.
- Satz 3: Für wen relevant / wofür einsetzbar (Use Case oder Kontext).

Constraints:
- exakt 3 Sätze
- keine Marketing-Sprache, keine Wertungen
- Tools/Konzepte beim Namen nennen
- Sprache: deutsch

Description:
${input.description}

audited_md (ggf. gekürzt):
${input.auditedMd}`
}

export async function runPass4(
  description: string,
  auditedMd: string,
): Promise<string> {
  const prompt = buildPass4Prompt({ description, auditedMd })
  const raw = await callClaudeCli({
    prompt,
    allowedTools: "",
    model: "sonnet",
    effort: "low",
  })
  return raw.trim()
}
