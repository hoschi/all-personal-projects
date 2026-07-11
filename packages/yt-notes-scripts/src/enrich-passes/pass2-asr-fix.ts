import { callClaudeCli } from "../llm-caller"

export function buildPass2Prompt(auditedMd: string): string {
  return `Du bekommst ein audited_md eines YouTube-Video-Transcripts. Es wurde
automatisch transkribiert.

1. Lies das gesamte Transcript einmal komplett. Verstehe um was es geht
   und welches Vokabular/welche Tools/welche Domain das Video behandelt.

2. Gehe es dann durch und korrigiere klar erkennbare ASR-Fehler
   (Mishearings, falsche Wortzusammenziehungen, fehlende Satzgrenzen,
   triviale Tippfehler).

3. Tonalität, Stil, Wortwahl und Satzbau des Sprechers bleiben unangetastet.
   Du fixt Fehler, du polierst nicht.

Bei Unsicherheit ob etwas Fehler oder gewollter Stil ist: unverändert lassen.

Output: das korrigierte audited_md, sonst nichts.

Input audited_md:
${auditedMd}`
}

export async function runPass2(auditedMd: string): Promise<string> {
  const prompt = buildPass2Prompt(auditedMd)
  return await callClaudeCli({
    prompt,
    allowedTools: "",
    model: "opus",
    effort: "low",
  })
}
