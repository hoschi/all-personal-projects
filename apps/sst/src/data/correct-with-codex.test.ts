import { mock } from "bun:test"

// WICHTIG: mock.module() vor den Imports der zu testenden Datei setzen, damit
// der callLlmCli-Import nicht gegen die echte CLI auflöst.
const mockCallLlmCli = mock(async (_opts: unknown) => "result")

mock.module("@repo/yt-notes-scripts/llm-caller", () => ({
  callLlmCli: mockCallLlmCli,
}))

import { test, expect, beforeEach } from "bun:test"
import { correctWithCodex } from "./correct-with-codex"

type MockFn = typeof mockCallLlmCli

beforeEach(() => {
  ;(mockCallLlmCli as MockFn).mockReset().mockResolvedValue("result")
  process.env.SST_CODEX_MODEL = "gpt-6-luna"
  process.env.SST_CODEX_EFFORT = "medium"
})

test("correctWithCodex trimmt führende und nachfolgende Leerzeichen", async () => {
  ;(mockCallLlmCli as MockFn).mockResolvedValue("  korrigierter Text  \n")
  const result = await correctWithCodex({ prompt: "test" })
  expect(result.text).toBe("korrigierter Text")
})

test("correctWithCodex gibt modelId zurück", async () => {
  const result = await correctWithCodex({ prompt: "test" })
  expect(result.modelId).toBe("gpt-6-luna")
})

test("correctWithCodex propagiert Fehler aus callLlmCli", async () => {
  ;(mockCallLlmCli as MockFn).mockRejectedValue(
    new Error("codex exit 1: Not logged in"),
  )
  let caughtError: unknown
  try {
    await correctWithCodex({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeInstanceOf(Error)
  expect((caughtError as Error).message).toContain("codex exit 1")
})

test("correctWithCodex wirft bei fehlendem SST_CODEX_MODEL", async () => {
  delete process.env.SST_CODEX_MODEL
  let caughtError: unknown
  try {
    await correctWithCodex({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeDefined()
})

test("correctWithCodex wirft bei ungültigem SST_CODEX_EFFORT", async () => {
  process.env.SST_CODEX_EFFORT = "ultra" // kein gültiger Enum-Wert
  let caughtError: unknown
  try {
    await correctWithCodex({ prompt: "test" })
  } catch (e) {
    caughtError = e
  }
  expect(caughtError).toBeDefined()
})

test("correctWithCodex ruft den codex-cli-Kanal auf", async () => {
  await correctWithCodex({ prompt: "test" })
  const opts = (mockCallLlmCli as MockFn).mock.calls[0]?.[0] as {
    channel: string
    model: string
    effort: string
  }
  expect(opts.channel).toBe("codex-cli")
  expect(opts.model).toBe("gpt-6-luna")
  expect(opts.effort).toBe("medium")
})
