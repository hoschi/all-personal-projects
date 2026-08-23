import { describe, expect, test } from "bun:test"
import {
  buildClaudeCliArgs,
  buildCursorCliArgs,
  buildCursorCliConfig,
  buildCursorHooksConfig,
  buildCursorModelSlug,
  buildCursorShellAllowEntries,
  buildAgentGuardCommand,
  parseCursorCliStream,
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
    // stream-json, nicht json: das result-Feld der json-Fassung verklebt die
    // Assistenz-Bloecke ohne Trennzeichen.
    expect(args[fmt + 1]).toBe("stream-json")
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

describe("parseCursorCliStream", () => {
  // Nachgebaut aus einem echten stream-json-Mitschnitt (cursor-agent
  // 2026.08.11-e8db854): Zwischen-Kommentar, Tool-Aufruf, Schlussnachricht.
  // Das result-Event traegt exakt die fugenlose Verkettung beider Bloecke —
  // genau der Defekt, der `## Worum es geht` vom Zeilenanfang holt.
  const GLUED =
    "Ich hole zuerst die OHS-Treffer zu den Video-Begriffen, damit die Wikilinks nur auf geprüfte Vault-Artikel zeigen."
  const FINAL = "## Worum es geht\n\nDer Sprecher zeigt herdr."
  const stream = [
    JSON.stringify({ type: "system", subtype: "init", session_id: "s1" }),
    JSON.stringify({
      type: "assistant",
      message: { role: "assistant", content: [{ type: "text", text: GLUED }] },
    }),
    JSON.stringify({ type: "tool_call", subtype: "started", call_id: "t1" }),
    JSON.stringify({ type: "tool_call", subtype: "completed", call_id: "t1" }),
    JSON.stringify({
      type: "assistant",
      message: { role: "assistant", content: [{ type: "text", text: FINAL }] },
    }),
    JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      result: GLUED + FINAL,
      session_id: "s1",
      duration_ms: 250635,
    }),
  ].join("\n")

  test("nimmt die Schlussnachricht statt des verklebten result-Felds (Regression qnIu-Xu64H0)", () => {
    const parsed = parseCursorCliStream(stream)
    expect(parsed.result.split("\n")[0]).toBe("## Worum es geht")
    expect(parsed.result).not.toContain("Ich hole zuerst die OHS-Treffer")
  })

  test("liest Sitzung und Dauer aus dem result-Event", () => {
    const parsed = parseCursorCliStream(stream)
    expect(parsed.sessionId).toBe("s1")
    expect(parsed.durationMs).toBe(250635)
    expect(parsed.numTurns).toBeUndefined()
  })

  test("trennt mehrere Bloecke nach dem letzten Tool-Aufruf mit Zeilenumbruch", () => {
    const two = [
      JSON.stringify({ type: "tool_call", subtype: "completed" }),
      JSON.stringify({
        type: "assistant",
        message: { content: [{ type: "text", text: "## A" }] },
      }),
      JSON.stringify({
        type: "assistant",
        message: { content: [{ type: "text", text: "## B" }] },
      }),
      JSON.stringify({
        type: "result",
        subtype: "success",
        result: "## A## B",
      }),
    ].join("\n")
    expect(parseCursorCliStream(two).result).toBe("## A\n## B")
  })

  test("kommt ohne Tool-Aufruf aus", () => {
    const plain = [
      JSON.stringify({
        type: "assistant",
        message: { content: [{ type: "text", text: "## Worum es geht" }] },
      }),
      JSON.stringify({
        type: "result",
        subtype: "success",
        result: "## Worum es geht",
      }),
    ].join("\n")
    expect(parseCursorCliStream(plain).result).toBe("## Worum es geht")
  })

  test("faellt auf das result-Feld zurueck, wenn kein Assistenz-Block da ist", () => {
    const only = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "## Worum es geht",
    })
    expect(parseCursorCliStream(only).result).toBe("## Worum es geht")
  })

  test("ueberspringt Nicht-JSON-Zeilen", () => {
    expect(parseCursorCliStream(`kein json\n${stream}`).result).toContain(
      "## Worum es geht",
    )
  })

  test("wirft ohne result-Event", () => {
    expect(() => parseCursorCliStream("")).toThrow(/kein result-Event/)
  })

  test("wirft bei is_error und nennt die CLI", () => {
    const failed = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: true,
      result: "Not logged in",
    })
    expect(() => parseCursorCliStream(failed)).toThrow(/Cursor CLI/)
  })
})
