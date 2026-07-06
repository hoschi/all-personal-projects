import { describe, expect, test } from "bun:test"
import { buildPass2Prompt } from "./pass2-asr-fix"

describe("buildPass2Prompt", () => {
  test("enthält Anweisung gesamtes Transcript einmal zu lesen", () => {
    const p = buildPass2Prompt("<m>")
    expect(p).toContain("Lies das gesamte Transcript einmal komplett")
  })

  test("enthält Verbot Stil zu ändern", () => {
    const p = buildPass2Prompt("<m>")
    expect(p).toContain("Tonalität, Stil")
    expect(p).toContain("bleiben unangetastet")
  })

  test("audited_md wird eingebettet", () => {
    const p = buildPass2Prompt("MY_AUDITED")
    expect(p).toContain("MY_AUDITED")
  })
})
