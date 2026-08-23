import { spawn } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

// Maximale Wartezeit für einen claude-CLI-Aufruf — verhindert ewig hängende Promises.
const CLAUDE_CALL_TIMEOUT_MS = 10 * 60 * 1000

// Der cursor-agent-Kanal braucht mehr: die Messung vom 2026-08-23
// (docs/measurements/2026-08-23-pass5-grok46-vs-opus5/BERICHT.md) sah bei
// Grok 4.6 xhigh Laufzeiten von 209 bis 696 s, Median 412 s. Der
// 10-Minuten-Wert des claude-Kanals hätte den langsamsten dieser Läufe
// abgeschnitten. 20 Minuten sind knapp das Doppelte des gemessenen Maximums
// und lassen Raum für den Kaltstart des Wegwerf-Konfigverzeichnisses.
const CURSOR_CALL_TIMEOUT_MS = 20 * 60 * 1000

export type Classification = "arbeit" | "privat"

/** Effort-Stufen der Claude CLI (`--effort`). */
export type ClaudeEffort = "low" | "medium" | "high" | "xhigh" | "max"

/**
 * Reasoning-Stufen der Cursor-Modelle. Die Cursor CLI hat keinen eigenen
 * Schalter dafür — die Stufe steckt im Modell-Slug (`cursor-grok-4.6-xhigh`).
 * Deshalb wird der Slug hier aus Basis + Stufe zusammengesetzt: so bleibt die
 * Stufe ein Pflichtfeld, das jede Aufrufstelle setzen muss.
 */
export type CursorEffort = "low" | "medium" | "high" | "xhigh"

interface LlmCallOptionsBase {
  prompt: string
  // Optionaler Caller-Kontext (z.B. "pass5/yt=GEYixPDCl1k attempt=1"). Wird in
  // die session-Diagnose-Logzeile aufgenommen, damit man im Run-stdout pro
  // Sub-Agent-Call die Zuordnung zu Pipeline-Pass/Video/Versuch ablesen kann.
  tag?: string
}

/** Kanal 1: `claude --print`. Pass 1–4. */
export interface ClaudeCliCallOptions extends LlmCallOptionsBase {
  channel: "claude-cli"
  input?: string
  allowedTools: string // "" für reinen Text-Pass, "Bash(…)" für Tool-Use
  model: string // Pflicht. CLI-Alias ("sonnet", "opus", "haiku") oder voller Name ("claude-sonnet-4-6").
  effort: ClaudeEffort // Pflicht. CLI-Default ist xhigh — explizit setzen, sonst läuft alles unnötig teuer.
}

/** Kanal 2: `cursor-agent --print`. Pass 5. */
export interface CursorCliCallOptions extends LlmCallOptionsBase {
  channel: "cursor-cli"
  model: string // Pflicht. Basis-Slug OHNE Reasoning-Suffix, z.B. "cursor-grok-4.6".
  effort: CursorEffort // Pflicht. Wird an den Basis-Slug angehängt.
  /**
   * Pflicht. Die vollständige Liste der Shell-Befehls-Präfixe, die der
   * Sub-Agent absetzen darf — leere Liste heißt: keine Shell. Alles andere
   * lehnt `cursor-agent-guard.ts` ab, und andere Werkzeuge als die Shell
   * bekommt der Sub-Agent gar nicht erst.
   */
  allowedShellPrefixes: string[]
}

export type LlmCallOptions = ClaudeCliCallOptions | CursorCliCallOptions

export interface LlmCallResult {
  result: string
  sessionId: string | undefined
  durationMs: number
  numTurns: number | undefined
}

export function buildClaudeCliArgs(opts: ClaudeCliCallOptions): string[] {
  return [
    "--print",
    "--model",
    opts.model,
    "--effort",
    opts.effort,
    "--allowed-tools",
    opts.allowedTools,
    "--output-format",
    "json",
    "-p",
    opts.prompt,
  ]
}

/**
 * Setzt den Cursor-Modell-Slug aus Basis und Reasoning-Stufe zusammen.
 * `cursor-grok-4.6` + `xhigh` ergibt `cursor-grok-4.6-xhigh` — genau den Slug,
 * an dem die Vergleichsmessung gelaufen ist.
 */
export function buildCursorModelSlug(
  model: string,
  effort: CursorEffort,
): string {
  return `${model}-${effort}`
}

export function buildCursorCliArgs(opts: CursorCliCallOptions): string[] {
  return [
    "--print",
    // Das Wegwerf-Arbeitsverzeichnis ist bei jedem Aufruf neu; ohne --trust
    // bricht die CLI nicht-interaktiv mit "Workspace Trust Required" ab.
    "--trust",
    "--model",
    buildCursorModelSlug(opts.model, opts.effort),
    "--output-format",
    "json",
    "--",
    opts.prompt,
  ]
}

/** `Shell(…)`-Einträge für die Allowlist der Cursor-CLI-Konfiguration. */
export function buildCursorShellAllowEntries(
  allowedShellPrefixes: string[],
): string[] {
  return allowedShellPrefixes.map((prefix) => `Shell(${prefix})`)
}

/**
 * Konfiguration für das Wegwerf-`CURSOR_CONFIG_DIR` des Aufrufs. Sie ersetzt
 * die globale `~/.cursor/cli-config.json` des Nutzers vollständig — inklusive
 * dessen `approvalMode: "unrestricted"` — und bringt kein `mcp.json` mit, der
 * Sub-Agent bekommt also auch keine MCP-Werkzeuge.
 *
 * Die Listen hier sind die zweite Schicht, nicht die tragende: Cursor lehnt
 * damit unbekannte Befehle ab, lässt aber eingebaut-harmlose wie `echo`
 * trotzdem durch (gemessen 2026-08-23). Die Schranke, die wirklich nur den
 * OHS-Aufruf übrig lässt, sind die beiden Hooks in `buildCursorHooksConfig`.
 */
export function buildCursorCliConfig(allowedShellPrefixes: string[]): unknown {
  return {
    version: 1,
    approvalMode: "allowlist",
    permissions: {
      allow: buildCursorShellAllowEntries(allowedShellPrefixes),
      deny: ["Read(**)", "Write(**)", "Delete(**)", "WebFetch(*)"],
    },
    sandbox: { mode: "disabled" },
  }
}

/**
 * Hook-Registrierung — die tragende Schranke. `preToolUse` sperrt jedes
 * Werkzeug außer der Shell, `beforeShellExecution` jeden Befehl außer den
 * erlaubten.
 *
 * Die Datei muss im Arbeitsverzeichnis liegen
 * (`<workspace>/.cursor/hooks.json`) — eine `hooks.json` im
 * `CURSOR_CONFIG_DIR` wird nicht gelesen (gemessen 2026-08-23 mit
 * cursor-agent 2026.08.11-e8db854).
 */
export function buildCursorHooksConfig(guardCommand: string): unknown {
  const entry = { command: guardCommand, timeout: 20, failClosed: true }
  return {
    version: 1,
    hooks: {
      preToolUse: [entry],
      beforeShellExecution: [entry],
    },
  }
}

/**
 * Befehlszeile des Guards. `process.execPath` statt eines PATH-Lookups:
 * der Hook-Prozess startet im Wegwerf-Arbeitsverzeichnis, in dem kein
 * `.tool-versions` liegt — ein asdf-Shim `bun` scheitert dort mit
 * "No version is set for command bun" und der Hook liefert (fail-closed) ein
 * Deny für jeden Befehl.
 */
export function buildAgentGuardCommand(
  allowlistPath: string,
  guardPath: string = fileURLToPath(
    new URL("./cursor-agent-guard.ts", import.meta.url),
  ),
  runtimePath: string = process.execPath,
): string {
  return `"${runtimePath}" "${guardPath}" "${allowlistPath}"`
}

interface CursorRuntime {
  root: string
  workspaceDir: string
  configDir: string
}

function createCursorRuntime(allowedShellPrefixes: string[]): CursorRuntime {
  const root = mkdtempSync(join(tmpdir(), "yt-cursor-agent-"))
  const workspaceDir = join(root, "workspace")
  const configDir = join(root, "config")
  mkdirSync(join(workspaceDir, ".cursor"), { recursive: true })
  mkdirSync(configDir, { recursive: true })

  const allowlistPath = join(root, "allowed-shell-prefixes.json")
  writeFileSync(
    allowlistPath,
    JSON.stringify(allowedShellPrefixes, null, 2),
    "utf-8",
  )
  writeFileSync(
    join(configDir, "cli-config.json"),
    JSON.stringify(buildCursorCliConfig(allowedShellPrefixes), null, 2),
    "utf-8",
  )
  writeFileSync(
    join(workspaceDir, ".cursor", "hooks.json"),
    JSON.stringify(
      buildCursorHooksConfig(buildAgentGuardCommand(allowlistPath)),
      null,
      2,
    ),
    "utf-8",
  )
  return { root, workspaceDir, configDir }
}

export function parseAgentCliOutput(
  raw: string,
  cliLabel: string,
): LlmCallResult {
  const obj = JSON.parse(raw)
  if (obj.type !== "result")
    throw new Error(`Unexpected output type: ${obj.type}`)
  if (obj.subtype !== "success" || obj.is_error) {
    throw new Error(
      `${cliLabel} error subtype=${obj.subtype} is_error=${obj.is_error}: ${obj.error ?? obj.result ?? "(no message)"}`,
    )
  }
  return {
    result: obj.result as string,
    sessionId: typeof obj.session_id === "string" ? obj.session_id : undefined,
    durationMs: typeof obj.duration_ms === "number" ? obj.duration_ms : 0,
    numTurns: typeof obj.num_turns === "number" ? obj.num_turns : undefined,
  }
}

// OHS_NODE_BIN: die Sub-Agent-CLI erbt einen PATH, in dem
// /opt/homebrew/bin/node (v26) vor ~/.asdf/shims/node (v22) steht.
// obsidian-hybrid-search (Shebang `#!/usr/bin/env node`) lädt damit das
// falsche Node und scheitert mit NODE_MODULE_VERSION-Mismatch in
// better-sqlite3. Der Wrapper-Script `ohs-search-merged.sh` respektiert
// OHS_NODE_BIN als expliziten Interpreter.
function subAgentEnv(extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    ...process.env,
    OHS_NODE_BIN:
      process.env.OHS_NODE_BIN ?? `${process.env.HOME}/.asdf/shims/node`,
    ...extra,
  }
}

interface SpawnCliParams {
  command: string
  args: string[]
  cliLabel: string
  env: NodeJS.ProcessEnv
  cwd?: string
  input?: string
  timeoutMs: number
  tag: string | undefined
  /** Für die Diagnose-Logzeile: der Slug, der wirklich an die CLI ging. */
  model: string
  /** Für die Diagnose-Logzeile: was der Sub-Agent an Werkzeugen durfte. */
  toolScope: string
}

function spawnCli(params: SpawnCliParams): Promise<LlmCallResult> {
  return new Promise((resolve, reject) => {
    const proc = spawn(params.command, params.args, {
      cwd: params.cwd,
      env: params.env,
      stdio: [params.input ? "pipe" : "ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""

    const timer = setTimeout(() => {
      proc.kill()
      reject(
        new Error(
          `${params.command} timed out after ${params.timeoutMs / 1000}s (tag=${params.tag ?? "-"})`,
        ),
      )
    }, params.timeoutMs)

    proc.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf-8")
    })
    proc.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8")
    })
    proc.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })
    proc.on("close", (exitCode) => {
      clearTimeout(timer)
      if (exitCode !== 0) {
        // Beide CLIs geben Fehler-Details oft im stdout-JSON aus (z.B. "Not
        // logged in"), stderr bleibt leer. Versuche das zu extrahieren, sonst
        // fallback auf stderr.
        let detail = stderr.slice(0, 500)
        try {
          const obj = JSON.parse(stdout.trim())
          if (obj?.result) detail = `${obj.result} (is_error=${obj.is_error})`
        } catch {
          /* nicht-JSON, behalte stderr */
        }
        reject(new Error(`${params.command} exit ${exitCode}: ${detail}`))
        return
      }
      try {
        const parsed = parseAgentCliOutput(stdout.trim(), params.cliLabel)
        const tagPart = params.tag ? `tag=${params.tag} ` : ""
        const turnsPart =
          parsed.numTurns !== undefined ? `turns=${parsed.numTurns} ` : ""
        const sessionShort =
          parsed.sessionId != null
            ? parsed.sessionId.slice(0, 8) + "…"
            : "(none)"
        console.log(
          `[llm-caller] ${tagPart}cli=${params.command} model=${params.model} session=${sessionShort} duration_ms=${parsed.durationMs} ${turnsPart}tools="${params.toolScope}"`,
        )
        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    })
    if (params.input && proc.stdin) {
      proc.stdin.write(params.input)
      proc.stdin.end()
    }
  })
}

async function callClaudeCliWithMeta(
  opts: ClaudeCliCallOptions,
): Promise<LlmCallResult> {
  return await spawnCli({
    command: "claude",
    args: buildClaudeCliArgs(opts),
    cliLabel: "Claude CLI",
    env: subAgentEnv(),
    input: opts.input,
    timeoutMs: CLAUDE_CALL_TIMEOUT_MS,
    tag: opts.tag,
    model: opts.model,
    toolScope: opts.allowedTools,
  })
}

async function callCursorCliWithMeta(
  opts: CursorCliCallOptions,
): Promise<LlmCallResult> {
  const runtime = createCursorRuntime(opts.allowedShellPrefixes)
  try {
    return await spawnCli({
      command: "cursor-agent",
      args: buildCursorCliArgs(opts),
      cliLabel: "Cursor CLI",
      // CURSOR_CONFIG_DIR hängt die CLI an eine Wegwerf-Konfiguration statt an
      // die globale des Nutzers — der Lauf hängt damit nicht daran, welchen
      // approvalMode gerade jemand interaktiv gesetzt hat.
      env: subAgentEnv({ CURSOR_CONFIG_DIR: runtime.configDir }),
      cwd: runtime.workspaceDir,
      timeoutMs: CURSOR_CALL_TIMEOUT_MS,
      tag: opts.tag,
      model: buildCursorModelSlug(opts.model, opts.effort),
      toolScope: buildCursorShellAllowEntries(opts.allowedShellPrefixes).join(
        " ",
      ),
    })
  } finally {
    rmSync(runtime.root, { recursive: true, force: true })
  }
}

export async function callLlmCliWithMeta(
  opts: LlmCallOptions,
): Promise<LlmCallResult> {
  switch (opts.channel) {
    case "claude-cli":
      return await callClaudeCliWithMeta(opts)
    case "cursor-cli":
      return await callCursorCliWithMeta(opts)
  }
}

export async function callLlmCli(opts: LlmCallOptions): Promise<string> {
  const meta = await callLlmCliWithMeta(opts)
  return meta.result
}
