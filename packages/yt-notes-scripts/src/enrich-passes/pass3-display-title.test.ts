import { describe, expect, test } from "bun:test"
import { buildPass3Prompt, extractFirstH3Section } from "./pass3-display-title"

describe("extractFirstH3Section", () => {
  test("liefert ersten H3-Block bis nächstem H3 oder EOF", () => {
    const md = `### 0:00 — Intro\n\nIntro-Text\n\n### 2:00 — B\n\nB-Text`
    expect(extractFirstH3Section(md)).toContain("Intro-Text")
    expect(extractFirstH3Section(md)).not.toContain("B-Text")
  })

  test("liefert ganzen md wenn kein H3", () => {
    const md = `Kein Heading hier`
    expect(extractFirstH3Section(md)).toBe(md)
  })
})

describe("buildPass3Prompt", () => {
  test("enthält max-80-Zeichen-Regel", () => {
    const p = buildPass3Prompt({
      originalTitle: "Foo",
      description: "Bar",
      firstSection: "Baz",
    })
    expect(p).toContain("max 80 Zeichen")
    expect(p).toContain("kein Clickbait")
  })
})
