import { mock } from "bun:test"

// WICHTIG: mock.module() vor den Imports der zu testenden Datei setzen, damit
// der callLlmCli-Import nicht gegen die echte CLI auflöst.
const mockCallLlmCli = mock(async (_opts: unknown) => "result")

mock.module("@repo/yt-notes-scripts/llm-caller", () => ({
  callLlmCli: mockCallLlmCli,
}))

import { test, expect, beforeEach } from "bun:test"
import { correctWithClaude } from "./correct-with-claude"

type MockFn = typeof mockCallLlmCli

beforeEach(() => {
  ;(mockCallLlmCli as MockFn).mockReset().mockResolvedValue("result")
  process.env.SST_CLAUDE_MODEL = "sonnet"
  process.env.SST_CLAUDE_EFFORT = "medium"
})

test("correctWithClaude trimmt führende und nachfolgende Leerzeichen", async () => {
  ;(mockCallLlmCli as MockFn).mockResolvedValue("  korrigierter Text  \n")
  const result = await correctWithClaude({ prompt: "test" })
  expect(result.text).toBe("korrigierter Text")
})

test("correctWithClaude gibt modelId zurück", async () => {
  const result = await correctWithClaude({ prompt: "test" })
  expect(result.modelId).toBe("claude-cli-default")
})

test("correctWithClaude propagiert Fehler aus callLlmCli", async () => {
  ;(mockCallLlmCli as MockFn).mockRejectedValue(
    new Error("claude exit 1: Not logged in"),
  )
  let caughtError: unknown
  try {
    await correctWithClaude({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeInstanceOf(Error)
  expect((caughtError as Error).message).toContain("claude exit 1")
})

test("correctWithClaude wirft bei fehlendem SST_CLAUDE_MODEL", async () => {
  delete process.env.SST_CLAUDE_MODEL
  let caughtError: unknown
  try {
    await correctWithClaude({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeDefined()
})

test("correctWithClaude wirft bei ungültigem SST_CLAUDE_EFFORT", async () => {
  process.env.SST_CLAUDE_EFFORT = "ultra" // kein gültiger Enum-Wert
  let caughtError: unknown
  try {
    await correctWithClaude({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeDefined()
})

test("correctWithClaude ruft den claude-cli-Kanal auf", async () => {
  await correctWithClaude({ prompt: "test" })
  const opts = (mockCallLlmCli as MockFn).mock.calls[0]?.[0] as {
    channel: string
    model: string
    effort: string
    allowedTools: string
  }
  expect(opts.channel).toBe("claude-cli")
  expect(opts.model).toBe("sonnet")
  expect(opts.effort).toBe("medium")
  expect(opts.allowedTools).toBe("")
})
