import { homedir } from "node:os"
import { callLlmCli, type CursorCliCallOptions } from "../llm-caller"

// OHS-Wrapper-Pfad wird vom Sub-Agent zur Discovery aufgerufen. Per
// Env-Var konfigurierbar, damit kein User-spezifischer Pfad im Code steht.
const OHS_WRAPPER_PATH = process.env.OHS_WRAPPER_PATH ?? "ohs-search-merged.sh"

// Node-Interpreter, den der Prompt dem Sub-Agenten vorschreibt. Steht als
// Konstante hier, weil dieselbe Zeichenfolge auch in die Shell-Allowlist geht
// (siehe buildPass5AllowedShellPrefixes) — instruierter Befehl und Regel
// dürfen nie auseinanderlaufen. `$HOME` bleibt hier bewusst uninterpoliert:
// die Shell des Sub-Agenten löst es auf.
const OHS_NODE_BIN_LITERAL = "$HOME/.asdf/shims/node"

export function buildPass5Prompt(
  auditedMd: string,
  retryHint?: string,
): string {
  const hint = retryHint
    ? `\n\n!! WICHTIG — Retry-Hinweis aus vorigem Versuch !!\n${retryHint}\n\n`
    : ""
  return `Du bekommst ein audited_md eines YouTube-Videos (Werbung schon ausgeschnitten).

Vault-Kontext: Die Zusammenfassung wird in eine Markdown-Datei geschrieben, die
im Obsidian-Vault \`test\` (Shared-Vault) liegt — Pfad
\`shared/youtube/<channel>/<title>.md\`. Wikilinks \`[[…]]\` lösen NUR innerhalb
dieses Vaults auf. Treffer aus dem KB-Vault (\`knowledge-base\`) brauchen
deshalb \`obsidian://\`-URIs — siehe Wikilink-Verfahren unten.${hint}

Aufgabe: Schreibe eine deutsche Zusammenfassung als Markdown, strukturiert in
folgende Sektionen. Setze Wikilinks zu KB-Artikeln im Vault aktiv, wo
entsprechende Sektionen das vorsehen.

## Worum es geht

Ein bis zwei Sätze: Was ist Thema und Kontext.

## Besprochene Konzepte

Bullet-Liste der inhaltlichen Konzepte / Theorien / Ansätze.
Pro Bullet: "<Konzept> — <ein Halbsatz Beschreibung>".
Wenn der Konzept-Begriff einen passenden Vault-Artikel hat (OHS-Lookup
geprüft, siehe Wikilink-Verfahren unten): "[[<artikel-name>]] — …".

## Behauptungen

Bullet-Liste konkreter Aussagen des Sprechers — Fakten, Empfehlungen,
Wertungen über Tools/Produkte/Vorgehen.
Pro Bullet: "<knappe Behauptung>" (optional: \`(<timestamp>)\` am Ende).
KEINE Wikilinks in dieser Sektion — die landen in \`## Verwandt\` unten.

Timestamp-Format STRIKT (nur wenn du einen aus dem audited_md übernimmst):
M:SS, MM:SS, H:MM:SS oder HH:MM:SS — IN runden Klammern, KEINE
selbstgebauten Markdown-Links. Die Timestamps werden in einem
deterministischen Post-Process zu YouTube-Marker-Links umgeschrieben.

Behauptung vs Spekulation:
- **DEINE** Spekulation ist verboten:
    - "Vermutlich meint der Sprecher …" — keine eigene Interpretation
    - "Daraus folgt …" — keine eigenen Schlüsse
    - "Das könnte zu Z führen" — keine Vorausschau
- **Sprecher-Spekulation** ist OK: wenn der Sprecher selbst vermutet
  ("ich glaube X wird Y überholen"), übernimm es mit Marker
  "Laut Sprecher …" oder "Der Sprecher vermutet …".
- Faustregel: bei Unsicherheit ob du eine Behauptung wörtlich ins Original
  zurückführen kannst, weglassen.

## Demos / Schritte

Falls etwas vorgeführt wird: nummerierte Liste, jeder Schritt knapp.
Wenn nichts vorgeführt wird, Sektion weglassen.

## Genannte Tools

Bullet-Liste der explizit genannten externen Tools / Frameworks / Produkte.
Pro Bullet: "[[<vault-artikel-name>]] — <Halbsatz Funktion>" wenn Match,
sonst Klartext-Name.
Wenn keine Tools im Video: Sektion weglassen.

## Verwandt

Bullet-Liste von Vault-Artikeln, die zum Video-Thema verwandt sind —
auch wenn nicht explizit im Video genannt. Quelle: OHS-Lookup mit
Video-Thema/Konzept-Phrasen.
Pro Bullet: "[[<artikel-name>]] — <Halbsatz, was die Verbindung ist>".
Keine Duplikate zu den schon in Konzepte/Tools verlinkten Artikeln.
Wenn nichts verwandt: Sektion weglassen.

---

Wikilink-Verfahren (für Konzepte, Tools, Verwandt — Pflicht):
1. Bash-Aufruf (mit explizitem Node-Interpreter — claude-CLI Sub-Agent erbt
   einen PATH, in dem ein Node v26 vor Node v22 steht, was den OHS-internen
   \`better-sqlite3\` mit NODE_MODULE_VERSION-Mismatch kaputtmacht):
   OHS_NODE_BIN=${OHS_NODE_BIN_LITERAL} ${OHS_WRAPPER_PATH} --vault-type arbeit --no-yt --limit 3 --json '<query>'
2. Score-Lese: nur Hits mit \`score_native >= 0.8\` betrachten (NICHT score_rrf —
   der ist Rank-basiert und liegt im Bereich ~0.01-0.02, also nie >= 0.8).
3. Title-Match-Prüfung gegen Video-Kontext:
   - Bei Mehrdeutigkeit (z.B. "Claude" → "Claude Code" vs "Claude API"):
     Kontext-Snippet aus diesem Video entscheidet
4. **Link-Format strikt nach \`source_index\` des Hits** (siehe JSON-Antwort):
   - \`source_index: "shared"\` → \`[[<exakter-hit-title>]]\` (Wikilink, gleicher Vault)
   - \`source_index: "kb"\` → \`[<exakter-hit-title>](obsidian://open?vault=knowledge-base&file=<URL-encoded-file_path-OHNE-.md>)\`
     **\`.md\`-Suffix wird abgeschnitten** (Obsidian-URI erwartet den File-Namen
     ohne Extension — sonst öffnet der Klick eine neue Stub-Datei statt der
     Ziel-Datei). URL-Encoding: Leerzeichen → \`%20\`, Slashes \`/\` → \`%2F\`,
     Sonderzeichen (Umlaute, Bindestrich-em-dash, Apostrophe) entsprechend RFC 3986.
     Beispiel: file_path \`claude-code-mcp-setup.md\` → \`file=claude-code-mcp-setup\`.
     Beispiel mit Sonderzeichen: \`yt-pipeline — decisions.md\` → \`file=yt-pipeline%20%E2%80%94%20decisions\`.
5. Kein Match / Score zu niedrig: Klartext lassen,
   KEINEN spekulativen Wikilink.
6. NIEMALS \`[[…]]\` für einen Hit mit \`source_index: "kb"\` — das wäre ein
   toter Cross-Vault-Link.
7. NIEMALS ein Markdown-Link mit relativem Vault-Pfad für eine Vault-Notiz —
   weder \`[text](shared/…/datei.md)\` noch \`[text](knowledge-base/…/datei.md)\`.
   Solche Pfade lösen in Obsidian NICHT auf. Es gibt nur zwei erlaubte Formen:
   Same-Vault → \`[[…]]\` (Punkt 4, source_index shared),
   KB-Vault → \`[…](obsidian://…)\` (Punkt 4, source_index kb).

Globale Regeln:
- NUR was der Sprecher tatsächlich sagt
- Sprache: deutsch
- Keine harten Längen-Limits
- Links (Wikilinks [[…]] und [text](obsidian://…)) NIEMALS in Backticks
  einschließen — Backticks rendern den Link als Inline-Code statt als
  klickbaren Link. Die Backtick-Beispiele oben dienen nur der Darstellung.
- Gib AUSSCHLIESSLICH den Markdown-Body aus (beginnend mit "## Worum es
  geht"). Keine Vorrede, kein Denken, keine Meta-Kommentare wie "Ich schreibe
  jetzt die Zusammenfassung", keine zusätzlichen Überschriften außer den oben
  definierten Sektionen.

Input audited_md:
${auditedMd}`
}

/**
 * Die vollständige Liste der Shell-Befehle, die der Pass-5-Sub-Agent absetzen
 * darf.
 *
 * `auditedMd` ist ungeprüfter Transkript-Text (Prompt-Injection-Risiko). Der
 * Sub-Agent braucht die Shell NUR für den einen OHS-Wrapper-Aufruf des
 * Wikilink-Verfahrens (siehe buildPass5Prompt) — deshalb wird die
 * Shell-Berechtigung exakt auf diesen Befehl gescoped statt pauschal
 * freigegeben, sonst könnte ein manipuliertes Transkript den Sub-Agenten zu
 * beliebigen Shell-Kommandos verleiten.
 *
 * Drei Formen, alle mit demselben Ziel-Script:
 * 1. der Befehl exakt so, wie der Prompt ihn vorschreibt (`$HOME` uninterpoliert),
 * 2. derselbe Befehl mit aufgelöstem Home — manche Modelle setzen den Pfad ein,
 * 3. der Wrapper ohne Env-Prefix; `OHS_NODE_BIN` setzt der llm-caller ohnehin
 *    in die Umgebung des Sub-Agenten.
 *
 * Der Interpreter-Pfad ist in Form 1 und 2 festgenagelt und nicht als Muster
 * offen: `OHS_NODE_BIN` ist der Interpreter, mit dem der Wrapper das
 * OHS-Script startet — ein freies Muster dort wäre ein Weg zu einer beliebigen
 * ausführbaren Datei.
 */
export function buildPass5AllowedShellPrefixes(): string[] {
  return [
    `OHS_NODE_BIN=${OHS_NODE_BIN_LITERAL} ${OHS_WRAPPER_PATH}`,
    `OHS_NODE_BIN=${homedir()}/.asdf/shims/node ${OHS_WRAPPER_PATH}`,
    OHS_WRAPPER_PATH,
  ]
}

/**
 * Kanal, Modell und Reasoning-Stufe von Pass 5 an einer Stelle — als eigene
 * Funktion, damit ein Test sie prüfen kann, ohne die CLI zu starten.
 *
 * Kanal ist cursor-agent statt claude. Grund ist die Vergleichsmessung vom
 * 2026-08-23 (docs/measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md):
 * Grok 4.6 xhigh schlägt Opus 5 high bei Vollständigkeit (einstimmig über zwei
 * Richter) und Präzision und hält das Wikilink-Verfahren in 16 von 16 Läufen
 * fehlerfrei ein, bei doppelter Link-Ausbeute. `cursor-grok-4.6` + `xhigh`
 * ergibt `cursor-grok-4.6-xhigh` — den Slug, an dem gemessen wurde.
 */
export function buildPass5CallOptions(
  prompt: string,
  tag?: string,
): CursorCliCallOptions {
  return {
    channel: "cursor-cli",
    prompt,
    model: "cursor-grok-4.6",
    effort: "xhigh",
    allowedShellPrefixes: buildPass5AllowedShellPrefixes(),
    tag,
  }
}

export async function runPass5(
  auditedMd: string,
  retryHint?: string,
  tag?: string,
): Promise<string> {
  const prompt = buildPass5Prompt(auditedMd, retryHint)
  return await callLlmCli(buildPass5CallOptions(prompt, tag))
}
