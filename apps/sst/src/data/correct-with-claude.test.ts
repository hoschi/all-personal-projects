import { mock } from "bun:test"

// WICHTIG: mock.module() vor den Imports der zu testenden Datei setzen, damit
// der callClaudeCli-Import nicht gegen die echte CLI auflöst.
const mockCallClaudeCli = mock(async () => "result")

mock.module("@repo/yt-notes-scripts/llm-caller", () => ({
  callClaudeCli: mockCallClaudeCli,
}))

import { test, expect, beforeEach } from "bun:test"
import { correctWithClaude } from "./correct-with-claude"

type MockFn = typeof mockCallClaudeCli

beforeEach(() => {
  ;(mockCallClaudeCli as MockFn).mockReset().mockResolvedValue("result")
  process.env.SST_CLAUDE_MODEL = "sonnet"
  process.env.SST_CLAUDE_EFFORT = "medium"
})

test("correctWithClaude trimmt führende und nachfolgende Leerzeichen", async () => {
  ;(mockCallClaudeCli as MockFn).mockResolvedValue("  korrigierter Text  \n")
  const result = await correctWithClaude({ prompt: "test" })
  expect(result.text).toBe("korrigierter Text")
})

test("correctWithClaude gibt modelId zurück", async () => {
  const result = await correctWithClaude({ prompt: "test" })
  expect(result.modelId).toBe("claude-cli-default")
})

test("correctWithClaude propagiert Fehler aus callClaudeCli", async () => {
  ;(mockCallClaudeCli as MockFn).mockRejectedValue(
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
