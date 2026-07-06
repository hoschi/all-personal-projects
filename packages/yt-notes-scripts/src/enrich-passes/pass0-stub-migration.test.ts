import { describe, expect, test } from "bun:test"
import { migrateStubBody } from "./pass0-stub-migration"

describe("migrateStubBody", () => {
  test("hebt Inhalt unter H1 in ## Notizen-Sektion", () => {
    const before = `# Titel\n\nUser-Notiz-Text\nMehr Text`
    const after = migrateStubBody(before)
    expect(after).toContain("# Titel")
    expect(after).toContain("## Notizen")
    expect(after).toContain("User-Notiz-Text")
    expect(after.indexOf("## Notizen")).toBeLessThan(
      after.indexOf("User-Notiz-Text"),
    )
  })

  test("läßt Body unverändert wenn bereits H2-Sektionen vorhanden", () => {
    const before = `# Titel\n\nIntro\n\n## Sektion A\n\nA-Inhalt`
    expect(migrateStubBody(before)).toBe(before)
  })

  test("läßt leeren Body unverändert", () => {
    const before = `# Titel\n`
    expect(migrateStubBody(before)).toBe(before)
  })

  test("ignoriert reines whitespace zwischen H1 und EOF", () => {
    const before = `# Titel\n\n\n\n`
    expect(migrateStubBody(before)).toBe(before)
  })
})
