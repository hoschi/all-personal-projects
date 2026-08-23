#!/usr/bin/env bun
/**
 * Werkzeug-Schranke für den cursor-agent-Kanal (`llm-caller.ts`). Läuft als
 * Hook der Cursor CLI auf zwei Ereignissen:
 *
 * - `preToolUse` — lässt nur das Shell-Werkzeug durch. Alles andere (Read,
 *   Write, Grep, Fetch, …) wird abgelehnt.
 * - `beforeShellExecution` — lässt vom Shell-Werkzeug nur die Befehle durch,
 *   die auf der übergebenen Allowlist stehen.
 *
 * Warum ein Hook und nicht `permissions` in der `cli-config.json`: `deny`
 * schlägt dort `allow` (harter Deny wird vor jeder Allowlist geprüft), taugt
 * also nicht für „nur dieses eine". Und der Allowlist-Modus fragt bei einem
 * nicht gelisteten Befehl nach — unter `--print` läuft ein eingebaut-harmloser
 * Befehl wie `echo` dann trotzdem. Beides gemessen am 2026-08-23 mit
 * cursor-agent 2026.08.11-e8db854.
 *
 * Aufruf durch die Cursor CLI (in `hooks.json` registriert, `failClosed`):
 *   bun <dieser-pfad> <pfad-zur-allowlist.json>
 * stdin: JSON mit `hook_event_name` und `command` bzw. `tool_name`,
 * stdout: `{"permission":"deny", …}` oder `{}` für „nicht mein Fall".
 */
import { readFileSync } from "node:fs"

export interface GuardDecision {
  permission?: "allow" | "deny"
  user_message?: string
}

/** Das einzige Werkzeug, das der Sub-Agent überhaupt aufrufen darf. */
const ALLOWED_TOOL = "Shell"

/**
 * Zeichen, mit denen aus einem einzelnen Befehl eine Kette wird. Der
 * Pass-5-Prompt setzt genau einen Befehl ab; alles, was daran etwas anhängen
 * oder umleiten könnte, wird abgelehnt. `$HOME` bleibt erlaubt — verboten ist
 * nur die Kommando-Ersetzung `$(…)`.
 */
const CHAINING_PATTERN = /[;&|`\n\r<>]|\$\(/

/** Obergrenze, damit ein manipuliertes Transkript keinen Riesen-Befehl baut. */
const MAX_COMMAND_LENGTH = 4000

function deny(reason: string): GuardDecision {
  return {
    permission: "deny",
    user_message: `Pass-5-Guard: ${reason}. Erlaubt ist ausschliesslich der OHS-Lookup aus dem Wikilink-Verfahren.`,
  }
}

/**
 * Neutrale Antwort ohne Freigabe: dieser Hook hat nichts einzuwenden, die
 * Entscheidung faellt weiter unten.
 */
const NEUTRAL: GuardDecision = {}

/** Freigabe. */
const ALLOW: GuardDecision = { permission: "allow" }

/**
 * Werkzeug-Ebene. Für das Shell-Werkzeug bleibt die Antwort bewusst neutral
 * statt „allow" — ein explizites Allow würde die Freigabe vorwegnehmen und
 * `beforeShellExecution` überspringen.
 */
export function decideToolUse(toolName: unknown): GuardDecision {
  if (toolName === ALLOWED_TOOL) return NEUTRAL
  return deny(`Werkzeug ${String(toolName)} ist gesperrt`)
}

/**
 * Befehls-Ebene. `allowedPrefixes` sind exakte Befehls-Präfixe (ohne
 * Schluss-Leerzeichen); der Befehl muss einem davon entsprechen oder mit ihm
 * plus Leerzeichen beginnen.
 */
export function decideShellCommand(
  rawCommand: unknown,
  allowedPrefixes: string[],
): GuardDecision {
  if (typeof rawCommand !== "string")
    return deny("kein Befehlstext im Hook-Payload")
  const command = rawCommand.trim()
  if (command === "") return deny("leerer Befehl")
  if (command.length > MAX_COMMAND_LENGTH)
    return deny(`Befehl laenger als ${MAX_COMMAND_LENGTH} Zeichen`)
  if (CHAINING_PATTERN.test(command))
    return deny("Befehlsverkettung oder Umleitung im Befehl")

  const hit = allowedPrefixes.find((prefix) => {
    const p = prefix.trim()
    return p !== "" && (command === p || command.startsWith(`${p} `))
  })
  if (hit === undefined)
    return deny(`Befehl steht nicht auf der Allowlist (${command})`)
  return ALLOW
}

export interface GuardPayload {
  hook_event_name?: unknown
  tool_name?: unknown
  command?: unknown
}

export function decideHook(
  payload: GuardPayload,
  allowedPrefixes: string[],
): GuardDecision {
  switch (payload.hook_event_name) {
    case "preToolUse":
      return decideToolUse(payload.tool_name)
    case "beforeShellExecution":
      return decideShellCommand(payload.command, allowedPrefixes)
    default:
      return deny(
        `unbekanntes Hook-Ereignis ${String(payload.hook_event_name)}`,
      )
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks).toString("utf-8")
}

async function main(): Promise<void> {
  // Fail closed: jeder Fehler auf dem Weg zur Entscheidung ist ein Deny.
  let decision: GuardDecision
  try {
    const allowlistPath = process.argv[2]
    if (allowlistPath === undefined)
      throw new Error("Allowlist-Pfad fehlt (argv[2])")
    const allowedPrefixes = JSON.parse(
      readFileSync(allowlistPath, "utf-8"),
    ) as string[]
    const payload = JSON.parse(await readStdin()) as GuardPayload
    decision = decideHook(payload, allowedPrefixes)
  } catch (err) {
    decision = deny(`Guard-Fehler: ${String(err)}`)
  }
  process.stdout.write(JSON.stringify(decision))
}

if (import.meta.main) {
  await main()
}
