import { describe, expect, test } from "bun:test"
import { buildClaudeCliArgs, parseClaudeCliOutput } from "./llm-caller"

describe("buildClaudeCliArgs", () => {
  test("baut CLI-Args mit allowed-tools leer", () => {
    const args = buildClaudeCliArgs({
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

  test("setzt allowed-tools auf Bash für Pass 5", () => {
    const args = buildClaudeCliArgs({
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
      prompt: "Hello",
      allowedTools: "",
      model: "sonnet",
      effort: "low",
    })
    const idx = args.indexOf("--effort")
    expect(args[idx + 1]).toBe("low")
  })
})

describe("parseClaudeCliOutput", () => {
  test("extrahiert text result aus JSON-Output", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "Hello world",
    })
    expect(parseClaudeCliOutput(raw).result).toBe("Hello world")
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
    const parsed = parseClaudeCliOutput(raw)
    expect(parsed.sessionId).toBe("abc-123")
    expect(parsed.durationMs).toBe(12345)
    expect(parsed.numTurns).toBe(4)
  })

  test("setzt sessionId=undefined wenn session_id fehlt", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      result: "ok",
    })
    const parsed = parseClaudeCliOutput(raw)
    expect(parsed.sessionId).toBeUndefined()
    expect(parsed.durationMs).toBe(0)
  })

  test("wirft Error bei error-subtype", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "error_max_turns",
      error: "boom",
    })
    expect(() => parseClaudeCliOutput(raw)).toThrow()
  })

  test("wirft Error bei is_error=true trotz subtype=success (z.B. Not logged in)", () => {
    const raw = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: true,
      result: "Not logged in · Please run /login",
    })
    expect(() => parseClaudeCliOutput(raw)).toThrow(/Not logged in/)
  })
})
