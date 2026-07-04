import { describe, expect, test } from "bun:test"
import { buildPass4Prompt } from "./pass4-description"

describe("buildPass4Prompt", () => {
  test("verlangt exakt 3 Sätze", () => {
    const p = buildPass4Prompt({ description: "<d>", auditedMd: "<a>" })
    expect(p).toContain("exakt 3 Sätze")
    expect(p).toContain("Satz 1")
    expect(p).toContain("Satz 2")
    expect(p).toContain("Satz 3")
  })

  test("Sprache deutsch", () => {
    const p = buildPass4Prompt({ description: "<d>", auditedMd: "<a>" })
    expect(p).toContain("Sprache: deutsch")
  })
})
