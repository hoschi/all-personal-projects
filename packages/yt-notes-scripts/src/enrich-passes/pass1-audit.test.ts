import { describe, expect, it, test } from "bun:test"
import {
  buildPass1Prompt,
  parsePass1ExtendedOutput,
  buildPass1ExtendedPrompt,
} from "./pass1-audit"

describe("buildPass1Prompt", () => {
  test("enthält Werbe-Erkennungs-Regeln", () => {
    const prompt = buildPass1Prompt({ chapters: null, plain: "<transcript>" })
    expect(prompt).toContain("today's sponsor")
    expect(prompt).toContain("Werbung ausgeschnitten")
    expect(prompt).toContain("### <timestamp>")
  })

  test("enthält Chapters wenn vorhanden", () => {
    const chapters = [{ timestamp: "0:00", title: "Intro" }]
    const prompt = buildPass1Prompt({ chapters, plain: "<t>" })
    expect(prompt).toContain("0:00")
    expect(prompt).toContain("Intro")
  })

  test("Input Transcript wird eingebettet", () => {
    const prompt = buildPass1Prompt({
      chapters: null,
      plain: "MY_TRANSCRIPT_TOKEN",
    })
    expect(prompt).toContain("MY_TRANSCRIPT_TOKEN")
  })
})

describe("parsePass1ExtendedOutput", () => {
  it("splittet auditedMd und namedEntities korrekt", () => {
    const raw = `### 0:00 — Intro

Hallo und willkommen.

### 1:30 — Hauptthema

Wir reden über TanStack Start und PydanticAI.

<named_entities>
- TanStack Start
- PydanticAI
- Anthropic
</named_entities>`
    const result = parsePass1ExtendedOutput(raw)
    expect(result.auditedMd).toContain("### 0:00 — Intro")
    expect(result.auditedMd).toContain("### 1:30 — Hauptthema")
    expect(result.auditedMd).not.toContain("<named_entities>")
    expect(result.namedEntities).toEqual([
      "TanStack Start",
      "PydanticAI",
      "Anthropic",
    ])
  })

  it("liefert leeres namedEntities-Array bei fehlendem Block", () => {
    const raw = `### Inhalt\n\nKurzes Video ohne Eigennamen.`
    const result = parsePass1ExtendedOutput(raw)
    expect(result.auditedMd).toBe(raw)
    expect(result.namedEntities).toEqual([])
  })

  it("dedupliziert namedEntities", () => {
    const raw = `### Inhalt\n\nTest.\n\n<named_entities>\n- Claude\n- Claude\n- Anthropic\n</named_entities>`
    const result = parsePass1ExtendedOutput(raw)
    expect(result.namedEntities).toEqual(["Claude", "Anthropic"])
  })

  it("ignoriert leere und nicht-Listen-Zeilen im Block", () => {
    const raw = `### Inhalt\n\nText.\n\n<named_entities>\n\n- Claude\n\nbeliebiger Kommentar\n- Anthropic\n</named_entities>`
    const result = parsePass1ExtendedOutput(raw)
    expect(result.namedEntities).toEqual(["Claude", "Anthropic"])
  })
})

describe("buildPass1ExtendedPrompt", () => {
  it("enthält Eigennamen-Aufgabe + XML-Block-Format-Anweisung", () => {
    const prompt = buildPass1ExtendedPrompt({
      chapters: null,
      plain: "test transcript",
    })
    expect(prompt).toContain("<named_entities>")
    expect(prompt).toContain("Eigennamen")
  })
})
