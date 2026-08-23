import { describe, expect, test } from "bun:test"
import {
  buildClaudeCliArgs,
  buildCursorCliArgs,
  buildCursorCliConfig,
  buildCursorHooksConfig,
  buildCursorModelSlug,
  buildCursorShellAllowEntries,
  buildAgentGuardCommand,
  parseAgentCliOutput,
  type CursorCliCallOptions,
  type LlmCallOptions,
} from "./llm-caller"

describe("buildClaudeCliArgs", () => {
  test("baut CLI-Args mit allowed-tools leer", () => {
    const args = buildClaudeCliArgs({
      channel: "claude-cli",
      prompt: "Hello",
      allowedTools: "",
      model: "sonnet",
      effort: "medium",
    })
    expect(args).toContain("--print")
    expect(args).not.toContain("--no-input")
    expect(args).toContain("--allowed-tools")
    expect(args).toContain("--output-format")
    expect(args).toContain("json")
    expect(args).toContain("-p")
    expect(args).toContain("Hello")
  })

  test("setzt allowed-tools auf Bash für Tool-Use-Pässe", () => {
    const args = buildClaudeCliArgs({
      channel: "claude-cli",
      prompt: "Hello",
      allowedTools: "Bash",
      model: "opus",
      effort: "high",
    })
    const idx = args.indexOf("--allowed-tools")
    expect(args[idx + 1]).toBe("Bash")
  })

  test("setzt --model auf gewählten Wert", () => {
    const args = buildClaudeCliArgs({
      channel: "claude-cli",
      prompt: "Hello",
      allowedTools: "",
      model: "haiku",
      effort: "medium",
    })
    const idx = args.indexOf("--model")
    expect(args[idx + 1]).toBe("haiku")
  })

  test("setzt --effort auf gewählten Wert", () => {
    const args = buildClaudeCliArgs({
      channel: "claude-cli",
      prompt: "Hello",
      allowedTools: "",
      model: "sonnet",
      effort: "low",
    })
    const idx = args.indexOf("--effort")
    expect(args[idx + 1]).toBe("low")
  })
})

describe("Kanal-Wahl ist Pflicht", () => {
  // Die drei folgenden Blöcke sind Compiler-Tests: `bun test` führt sie nur
  // aus, `bun run check-types` prüft sie. Fällt eines der @ts-expect-error weg,
  // weil der Typ aufgeweicht wurde, schlägt check-types fehl.
  test("ohne channel kompiliert kein Aufruf", () => {
    // @ts-expect-error channel fehlt
    const opts: LlmCallOptions = {
      prompt: "Hello",
      allowedTools: "",
      model: "sonnet",
      effort: "low",
    }
    expect(opts.prompt).toBe("Hello")
  })

  test("cursor-Kanal ohne Reasoning-Stufe kompiliert nicht", () => {
    // @ts-expect-error effort fehlt
    const opts: LlmCallOptions = {
      channel: "cursor-cli",
      prompt: "Hello",
      model: "cursor-grok-4.6",
      allowedShellPrefixes: [],
    }
    expect(opts.channel).toBe("cursor-cli")
  })

  test("cursor-Kanal ohne Shell-Allowlist kompiliert nicht", () => {
    // @ts-expect-error allowedShellPrefixes fehlt
    const opts: LlmCallOptions = {
      channel: "cursor-cli",
      prompt: "Hello",
      model: "cursor-grok-4.6",
      effort: "xhigh",
    }
    expect(opts.channel).toBe("cursor-cli")
  })

  test("claude-Kanal kennt kein allowedShellPrefixes", () => {
    const opts: LlmCallOptions = {
      channel: "claude-cli",
      prompt: "Hello",
      allowedTools: "",
      model: "opus",
      effort: "low",
      // @ts-expect-error Feld gehört dem cursor-Kanal
      allowedShellPrefixes: [],
    }
    expect(opts.channel).toBe("claude-cli")
  })
})

describe("buildCursorModelSlug", () => {
  test("hängt die Reasoning-Stufe an den Basis-Slug", () => {
    expect(buildCursorModelSlug("cursor-grok-4.6", "xhigh")).toBe(
      "cursor-grok-4.6-xhigh",
    )
    expect(buildCursorModelSlug("cursor-grok-4.6", "low")).toBe(
      "cursor-grok-4.6-low",
    )
  })
})

describe("buildCursorCliArgs", () => {
  const opts: CursorCliCallOptions = {
    channel: "cursor-cli",
    prompt: "Hello",
    model: "cursor-grok-4.6",
    effort: "xhigh",
    allowedShellPrefixes: ["/bin/ohs"],
  }

  test("baut den Print-Aufruf mit zusammengesetztem Modell-Slug", () => {
    const args = buildCursorCliArgs(opts)
    expect(args).toContain("--print")
    expect(args).toContain("--trust")
    const idx = args.indexOf("--model")
    expect(args[idx + 1]).toBe("cursor-grok-4.6-xhigh")
    const fmt = args.indexOf("--output-format")
    expect(args[fmt + 1]).toBe("json")
  })

  test("übergibt den Prompt hinter -- als letztes Argument", () => {
    const args = buildCursorCliArgs(opts)
    expect(args[args.length - 2]).toBe("--")
    expect(args[args.length - 1]).toBe("Hello")
  })

  test("setzt keinen --effort-Schalter (den kennt die Cursor CLI nicht)", () => {
    expect(buildCursorCliArgs(opts)).not.toContain("--effort")
  })
})

describe("Werkzeug-Beschränkung des cursor-Kanals", () => {
  const prefixes = [
    "OHS_NODE_BIN=$HOME/.asdf/shims/node /pfad/ohs-search-merged.sh",
    "/pfad/ohs-search-merged.sh",
  ]

  test("macht aus jedem Präfix einen Shell()-Eintrag", () => {
    expect(buildCursorShellAllowEntries(prefixes)).toEqual([
      "Shell(OHS_NODE_BIN=$HOME/.asdf/shims/node /pfad/ohs-search-merged.sh)",
      "Shell(/pfad/ohs-search-merged.sh)",
    ])
  })

  test("cli-config schaltet den Allowlist-Modus und listet nur die Präfixe", () => {
    const cfg = buildCursorCliConfig(prefixes) as {
      approvalMode: string
      permissions: { allow: string[]; deny: string[] }
    }
    expect(cfg.approvalMode).toBe("allowlist")
    expect(cfg.permissions.allow).toEqual(
      buildCursorShellAllowEntries(prefixes),
    )
    expect(cfg.permissions.deny).toContain("Write(**)")
  })

  test("hooks.json registriert den Shell-Guard fail-closed", () => {
    const hooks = buildCursorHooksConfig("guard --x") as {
      hooks: {
        beforeShellExecution: { command: string; failClosed: boolean }[]
      }
    }
    const entry = hooks.hooks.beforeShellExecution[0]
    expect(entry?.command).toBe("guard --x")
    expect(entry?.failClosed).toBe(true)
  })

  test("Guard-Befehl nutzt den laufenden Interpreter und quotet die Pfade", () => {
    const cmd = buildAgentGuardCommand(
      "/tmp/allow.json",
      "/repo/src/cursor-agent-guard.ts",
      "/opt/bun",
    )
    expect(cmd).toBe(
      '"/opt/bun" "/repo/src/cursor-agent-guard.ts" "/tmp/allow.json"',
    )
  })
})

describe("parseAgentCliOutput", () => {
  test("extrahiert text result aus JSON-Output", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "Hello world",
    })
    expect(parseAgentCliOutput(raw, "Claude CLI").result).toBe("Hello world")
  })

  test("extrahiert session_id + duration_ms + num_turns für Diagnose", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "ok",
      session_id: "abc-123",
      duration_ms: 12345,
      num_turns: 4,
    })
    const parsed = parseAgentCliOutput(raw, "Claude CLI")
    expect(parsed.sessionId).toBe("abc-123")
    expect(parsed.durationMs).toBe(12345)
    expect(parsed.numTurns).toBe(4)
  })

  test("liest auch die Cursor-Antwort, die kein num_turns führt", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      result: "## Worum es geht\n\nText.",
      session_id: "4a76020f-2c07-47f0-ba25-1addd78e573a",
      duration_ms: 412000,
      usage: { inputTokens: 1, outputTokens: 2 },
    })
    const parsed = parseAgentCliOutput(raw, "Cursor CLI")
    expect(parsed.result).toContain("## Worum es geht")
    expect(parsed.numTurns).toBeUndefined()
    expect(parsed.durationMs).toBe(412000)
  })

  test("setzt sessionId=undefined wenn session_id fehlt", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "ok",
    })
    const parsed = parseAgentCliOutput(raw, "Claude CLI")
    expect(parsed.sessionId).toBeUndefined()
    expect(parsed.durationMs).toBe(0)
  })

  test("wirft Error bei error-subtype und nennt die CLI", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "error_max_turns",
      error: "boom",
    })
    expect(() => parseAgentCliOutput(raw, "Cursor CLI")).toThrow(/Cursor CLI/)
  })

  test("wirft Error bei is_error=true trotz subtype=success (z.B. Not logged in)", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: true,
      result: "Not logged in · Please run /login",
    })
    expect(() => parseAgentCliOutput(raw, "Claude CLI")).toThrow(
      /Not logged in/,
    )
  })
})
