import { callClaudeCli } from "../llm-caller"

export interface Chapter {
  timestamp: string
  title: string
}

export interface Pass1Input {
  chapters: Chapter[] | null
  plain: string
}

// Standalone/manual-only audit path (sections + ad removal, without the
// named-entity extraction that buildPass1ExtendedPrompt/runPass1Extended add).
// Production enriches via runPass1Extended (see enrich-pipeline.ts). This
// buildPass1Prompt/runPass1 pair is kept as the non-extended reference variant
// and as the regression guard referenced by enrich-pipeline.test.ts, which
// asserts the pipeline no longer calls runPass1.
export function buildPass1Prompt(input: Pass1Input): string {
  const chaptersJson = input.chapters
    ? JSON.stringify(input.chapters, null, 2)
    : "null"
  return `Du bekommst das plain-text Transcript eines YouTube-Videos.

Aufgaben:
1. Werbung erkennen und ausschneiden
2. Inhalt sektionieren mit H3-Headings

Werbung erkennen:
- Klare Sponsoren-Phrasen: "today's sponsor", "this video is brought to you by",
  "jetzt eine kurze Werbung", "let me tell you about <product>" mit
  promotional Pitch, Promo-Code/Discount-Hinweise, Affiliate-Links-Verweise
- Self-Promo des Channels (Kursverkauf, Patreon-Pitch, "subscribe and like"
  Outro) zählt nicht als Werbung — bleibt drin
- Bei Unsicherheit: drin lassen (false negative besser als content cut)

Ersetzen ausgeschnittener Werbung durch Marker:
    > [!info] Werbung ausgeschnitten (3:24–5:12, ~Sponsor "<sponsor name if known>")

Sektionierung (auf den verbleibenden Inhalt):
1. YouTube-Chapters vorhanden? → 1 Sektion pro Chapter
   Format: "### <timestamp> — <chapter-title>"
2. Sonst Themen-Wechsel → "### <timestamp> — <kurzer Thema-Titel>"
3. Kurzes Video (<3min) ohne klaren Wechsel: eine Sektion "### Inhalt"

Regeln:
- Inhalt NICHT umformulieren, nur sektionieren + Werbung ausschneiden
- Speaker-Lautmalereien ("uh", "ehm"): streichen wenn klar Füllwort
- ASR-erfasste On-Screen-Texte streichen, wenn klar keine Speaker-Aussage:
  Titelkarten ("Exploring Human Agency in the age of AI"), Chapter-Bauchbinden
  ("Chapter1.", "Chapter 2:"), Lower-Thirds-Sprechernamen. Bei Zweifel ob
  Caption oder Speech: drin lassen.
- Timestamps stammen aus dem Original-Transcript
- Timestamp-Format STRIKT übernehmen: M:SS, MM:SS, H:MM:SS oder HH:MM:SS.
  KEINE Klammern um den Timestamp im Sektion-Header, KEINE Markdown-Links
  selbst bauen — die Timestamps werden in einem deterministischen
  Post-Process zu YouTube-Marker-Links umgeschrieben. Wenn du einen Link
  hardcodest, würde das fehlschlagen.

Output: Beginne deine Antwort direkt mit "### " der ersten Sektion.
Kein einleitender Satz, kein Kommentar, keine Zusammenfassung deiner
Vorgehensweise — nur das audited_md selbst.

Input Chapters: ${chaptersJson}
Input Transcript:
${input.plain}`
}

export async function runPass1(input: Pass1Input): Promise<string> {
  const prompt = buildPass1Prompt(input)
  return await callClaudeCli({
    prompt,
    allowedTools: "",
    model: "opus",
    effort: "low",
  })
}

export interface Pass1ExtendedResult {
  auditedMd: string
  namedEntities: string[]
}

export function buildPass1ExtendedPrompt(input: Pass1Input): string {
  const chaptersJson = input.chapters
    ? JSON.stringify(input.chapters, null, 2)
    : "null"
  return `Du bekommst das plain-text Transcript eines YouTube-Videos.

Aufgaben:
1. Werbung erkennen und ausschneiden
2. Inhalt sektionieren mit H3-Headings
3. Eigennamen identifizieren und am Ende auflisten

Werbung erkennen:
- Klare Sponsoren-Phrasen: "today's sponsor", "this video is brought to you by",
  "jetzt eine kurze Werbung", "let me tell you about <product>" mit
  promotional Pitch, Promo-Code/Discount-Hinweise, Affiliate-Links-Verweise
- Self-Promo des Channels (Kursverkauf, Patreon-Pitch, "subscribe and like"
  Outro) zählt nicht als Werbung — bleibt drin
- Bei Unsicherheit: drin lassen (false negative besser als content cut)

Ersetzen ausgeschnittener Werbung durch Marker:
    > [!info] Werbung ausgeschnitten (3:24–5:12, ~Sponsor "<sponsor name if known>")

Sektionierung (auf den verbleibenden Inhalt):
1. YouTube-Chapters vorhanden? → 1 Sektion pro Chapter
   Format: "### <timestamp> — <chapter-title>"
2. Sonst Themen-Wechsel → "### <timestamp> — <kurzer Thema-Titel>"
3. Kurzes Video (<3min) ohne klaren Wechsel: eine Sektion "### Inhalt"

Eigennamen-Extraktion:
- Identifiziere alle Eigennamen, die als Tool-Name, Personenname, Markenname,
  Produktname oder konkret benanntes Feature/Befehl/Skill im Transkript
  vorkommen.
- Konkret-benannte Features/Befehle/Skills/Modi zählen ALS Eigenname — auch
  wenn das Wort isoliert generisch klingt. Erkennungs-Marker:
  Slash-Prefix ("/handoff", "/compact"), Anführungszeichen ("the 'handoff'
  skill"), Possessiv- oder Demonstrativ-Konstruktion ("my handoff skill",
  "this compact feature"), explizite Benennung im Video ("I called this the
  X skill", "we use the Y command"). Beispiele: handoff, compact, Skill (im
  Claude-Code-Kontext), Hook (im Git-Kontext), Slash-Commands.
- Korrekt geschrieben wie offiziell (z.B. "PydanticAI", nicht "pydantic ai";
  "handoff" lowercase wenn so im Video benutzt, "Claude Code" mit Leerzeichen).
- Keine Dubletten
- Keine Akronyme wie "KI", "AI" (außer Teil eines Produktnamens wie "OpenAI")
- Keine wirklich generischen Begriffe ohne Feature-Charakter ("Datenbank",
  "Server", "Funktion" als Allgemein-Wort). Im Zweifel aufnehmen, wenn das
  Video das Wort als zentrales Konzept behandelt.

Regeln:
- Inhalt NICHT umformulieren, nur sektionieren + Werbung ausschneiden
- Speaker-Lautmalereien ("uh", "ehm"): streichen wenn klar Füllwort
- Timestamps stammen aus dem Original-Transcript
- Timestamp-Format STRIKT übernehmen: M:SS, MM:SS, H:MM:SS oder HH:MM:SS.
  KEINE Klammern um den Timestamp im Sektion-Header, KEINE Markdown-Links
  selbst bauen — die Timestamps werden in einem deterministischen
  Post-Process zu YouTube-Marker-Links umgeschrieben. Wenn du einen Link
  hardcodest, würde das fehlschlagen.

Output: Beginne deine Antwort direkt mit "### " der ersten Sektion.
Kein einleitender Satz, kein Kommentar.
Am Ende — NACH der letzten Sektion — füge einen XML-Block hinzu:

<named_entities>
- Name 1
- Name 2
</named_entities>

Wenn keine Eigennamen vorkommen, gib trotzdem den Block aus mit leerem Inhalt.

Input Chapters: ${chaptersJson}
Input Transcript:
${input.plain}`
}

const NAMED_ENTITIES_BLOCK_REGEX =
  /<named_entities>([\s\S]*?)<\/named_entities>/

export function parsePass1ExtendedOutput(raw: string): Pass1ExtendedResult {
  const match = NAMED_ENTITIES_BLOCK_REGEX.exec(raw)
  if (!match) return { auditedMd: raw.trim(), namedEntities: [] }
  const auditedMd = raw.slice(0, match.index).trim()
  const blockContent = match[1] ?? ""
  const namedEntities: string[] = []
  const seen = new Set<string>()
  for (const line of blockContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed.startsWith("- ")) continue
    const entity = trimmed.slice(2).trim()
    if (!entity || seen.has(entity)) continue
    seen.add(entity)
    namedEntities.push(entity)
  }
  return { auditedMd, namedEntities }
}

export async function runPass1Extended(
  input: Pass1Input,
): Promise<Pass1ExtendedResult> {
  const prompt = buildPass1ExtendedPrompt(input)
  const raw = await callClaudeCli({
    prompt,
    allowedTools: "",
    model: "opus",
    effort: "low",
  })
  return parsePass1ExtendedOutput(raw)
}
