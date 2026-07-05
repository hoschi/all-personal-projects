import { spawn } from "node:child_process"

// Maximale Wartezeit für einen claude-CLI-Aufruf — verhindert ewig hängende Promises.
const LLM_CALL_TIMEOUT_MS = 10 * 60 * 1000

export type Classification = "arbeit" | "privat"

export interface LlmCallOptions {
  prompt: string
  input?: string
  allowedTools: string // "" für reinen Text-Pass, "Bash" für Pass 5
  model: string // Pflicht. CLI-Alias ("sonnet", "opus", "haiku") oder voller Name ("claude-sonnet-4-6").
  effort: "low" | "medium" | "high" | "xhigh" | "max" // Pflicht. CLI-Default ist xhigh — explizit setzen, sonst läuft alles unnötig teuer.
  // Optionaler Caller-Kontext (z.B. "pass5/yt=GEYixPDCl1k attempt=1"). Wird in
  // die session-Diagnose-Logzeile aufgenommen, damit man im Run-stdout pro
  // Sub-Agent-Call die Zuordnung zu Pipeline-Pass/Video/Versuch ablesen kann.
  tag?: string
}

export interface ClaudeCliResult {
  result: string
  sessionId: string | undefined
  durationMs: number
  numTurns: number | undefined
}

export function buildClaudeCliArgs(opts: LlmCallOptions): string[] {
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

export function parseClaudeCliOutput(raw: string): ClaudeCliResult {
  const obj = JSON.parse(raw)
  if (obj.type !== "result")
    throw new Error(`Unexpected output type: ${obj.type}`)
  if (obj.subtype !== "success" || obj.is_error) {
    throw new Error(
      `Claude CLI error subtype=${obj.subtype} is_error=${obj.is_error}: ${obj.error ?? obj.result ?? "(no message)"}`,
    )
  }
  return {
    result: obj.result as string,
    sessionId: typeof obj.session_id === "string" ? obj.session_id : undefined,
    durationMs: typeof obj.duration_ms === "number" ? obj.duration_ms : 0,
    numTurns: typeof obj.num_turns === "number" ? obj.num_turns : undefined,
  }
}

export async function callClaudeCli(opts: LlmCallOptions): Promise<string> {
  const meta = await callClaudeCliWithMeta(opts)
  return meta.result
}

export async function callClaudeCliWithMeta(
  opts: LlmCallOptions,
): Promise<ClaudeCliResult> {
  const args = buildClaudeCliArgs(opts)
  // OHS_NODE_BIN: claude -p erbt einen PATH, in dem /opt/homebrew/bin/node
  // (v26) vor ~/.asdf/shims/node (v22) steht. obsidian-hybrid-search
  // (Shebang `#!/usr/bin/env node`) lädt damit das falsche Node und scheitert
  // mit NODE_MODULE_VERSION-Mismatch in better-sqlite3. Der Wrapper-Script
  // `ohs-search-merged.sh` respektiert OHS_NODE_BIN als expliziten Interpreter.
  const subAgentEnv: NodeJS.ProcessEnv = {
    ...process.env,
    OHS_NODE_BIN:
      process.env.OHS_NODE_BIN ?? `${process.env.HOME}/.asdf/shims/node`,
  }
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", args, {
      env: subAgentEnv,
      stdio: [opts.input ? "pipe" : "ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""

    const timer = setTimeout(() => {
      proc.kill()
      reject(
        new Error(
          `claude timed out after ${LLM_CALL_TIMEOUT_MS / 1000}s (tag=${opts.tag ?? "-"})`,
        ),
      )
    }, LLM_CALL_TIMEOUT_MS)

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
        // Claude CLI gibt Fehler-Details oft im stdout-JSON aus (z.B. "Not logged in"),
        // stderr bleibt leer. Versuche das zu extrahieren, sonst fallback auf stderr.
        let detail = stderr.slice(0, 500)
        try {
          const obj = JSON.parse(stdout.trim())
          if (obj?.result) detail = `${obj.result} (is_error=${obj.is_error})`
        } catch {
          /* nicht-JSON, behalte stderr */
        }
        reject(new Error(`claude exit ${exitCode}: ${detail}`))
        return
      }
      try {
        const parsed = parseClaudeCliOutput(stdout.trim())
        const tagPart = opts.tag ? `tag=${opts.tag} ` : ""
        const turnsPart =
          parsed.numTurns !== undefined ? `turns=${parsed.numTurns} ` : ""
        const sessionShort =
          parsed.sessionId != null
            ? parsed.sessionId.slice(0, 8) + "…"
            : "(none)"
        console.log(
          `[llm-caller] ${tagPart}model=${opts.model} session=${sessionShort} duration_ms=${parsed.durationMs} ${turnsPart}allowed_tools="${opts.allowedTools}"`,
        )
        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    })
    if (opts.input && proc.stdin) {
      proc.stdin.write(opts.input)
      proc.stdin.end()
    }
  })
}
