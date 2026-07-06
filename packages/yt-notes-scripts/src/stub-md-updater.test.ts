import { describe, expect, test } from "bun:test"
import {
  setFrontmatterFields,
  insertOrReplaceH2Section,
  mergeAliasField,
  assembleEnrichedBody,
} from "./stub-md-updater"

describe("setFrontmatterFields", () => {
  test("ergänzt neue Frontmatter-Felder", () => {
    const before = `---\ntitle: Foo\n---\n\n# H1`
    const after = setFrontmatterFields(before, {
      display_title: "Bar",
      description: "Baz",
    })
    expect(after).toContain("display_title: Bar")
    expect(after).toContain("description: Baz")
    expect(after).toContain("title: Foo")
  })

  test("überschreibt existierende Felder", () => {
    const before = `---\ntitle: Foo\ndisplay_title: Alt\n---\n\n# H1`
    const after = setFrontmatterFields(before, { display_title: "Neu" })
    expect(after).toContain("display_title: Neu")
    expect(after).not.toContain("display_title: Alt")
  })
})

describe("insertOrReplaceH2Section", () => {
  test("fügt neue ## Agent Zusammenfassung VOR ## Notizen ein", () => {
    const before = `# H1\n\n## Notizen\n\nUser-Inhalt`
    const after = insertOrReplaceH2Section(
      before,
      "Agent Zusammenfassung",
      "Summary-Inhalt",
      { before: "Notizen" },
    )
    expect(after.indexOf("## Agent Zusammenfassung")).toBeLessThan(
      after.indexOf("## Notizen"),
    )
    expect(after).toContain("Summary-Inhalt")
  })

  test("ersetzt existierende ## Agent Zusammenfassung", () => {
    const before = `# H1\n\n## Agent Zusammenfassung\n\nAlt\n\n## Notizen\n\nU`
    const after = insertOrReplaceH2Section(
      before,
      "Agent Zusammenfassung",
      "Neu",
      { before: "Notizen" },
    )
    expect(after).toContain("Neu")
    expect(after).not.toContain("Alt")
    // Notizen sind unangetastet
    expect(after).toContain("## Notizen")
  })

  test("hängt Sektion ans Ende wenn before-Anchor fehlt", () => {
    const before = `# H1\n\nIntro`
    const after = insertOrReplaceH2Section(
      before,
      "Agent Zusammenfassung",
      "Summary",
      { before: "Notizen" },
    )
    expect(after).toContain("## Agent Zusammenfassung")
    expect(after).toContain("Summary")
  })
})

describe("mergeAliasField (Cluster 4e Format-Update)", () => {
  test("appends display_title to existing array", () => {
    expect(mergeAliasField(["foo", "bar"], "Display")).toEqual([
      "foo",
      "bar",
      "Display",
    ])
  })

  test("dedupes when display_title already present", () => {
    expect(mergeAliasField(["Display", "Other"], "Display")).toEqual([
      "Display",
      "Other",
    ])
  })

  test("returns [display_title] when existing is null", () => {
    expect(mergeAliasField(null, "Display")).toEqual(["Display"])
  })

  test("returns [display_title] when existing is undefined", () => {
    expect(mergeAliasField(undefined, "Display")).toEqual(["Display"])
  })

  test("treats scalar string as single-item list", () => {
    expect(mergeAliasField("OnlyOne", "Display")).toEqual([
      "OnlyOne",
      "Display",
    ])
  })

  test("ignores non-string array entries (defensive)", () => {
    expect(mergeAliasField(["valid", 42, null], "Display")).toEqual([
      "valid",
      "Display",
    ])
  })
})

describe("assembleEnrichedBody (Cluster 4e Format-Update)", () => {
  const passSummary = [
    "## Worum es geht",
    "",
    "Intro-Text mit ein bis zwei Sätzen.",
    "",
    "## Besprochene Konzepte",
    "",
    "- A — eins",
    "- B — zwei",
    "",
    "## Behauptungen",
    "",
    "- Behauptet X.",
  ].join("\n")

  test("Reihenfolge: H1 → Worum es geht → Notizen → restliche Pass-5-Sektionen", () => {
    const existingBody = "# Test-Titel\n\n## Notizen\n\nUser-Notizen-Inhalt\n"
    const result = assembleEnrichedBody(passSummary, existingBody)

    const idxH1 = result.indexOf("# Test-Titel")
    const idxWorum = result.indexOf("## Worum es geht")
    const idxNotizen = result.indexOf("## Notizen")
    const idxKonzepte = result.indexOf("## Besprochene Konzepte")
    const idxBehauptungen = result.indexOf("## Behauptungen")

    expect(idxH1).toBeGreaterThanOrEqual(0)
    expect(idxWorum).toBeGreaterThan(idxH1)
    expect(idxNotizen).toBeGreaterThan(idxWorum)
    expect(idxKonzepte).toBeGreaterThan(idxNotizen)
    expect(idxBehauptungen).toBeGreaterThan(idxKonzepte)
  })

  test("bewahrt User-Inhalt in ## Notizen (Idempotenz)", () => {
    const existingBody =
      "# Test\n\n## Notizen\n\nMeine wichtigen Notizen\nmit zwei Zeilen.\n"
    const result = assembleEnrichedBody(passSummary, existingBody)

    expect(result).toContain("Meine wichtigen Notizen")
    expect(result).toContain("mit zwei Zeilen.")
  })

  test("legt leere ## Notizen-Sektion an wenn nicht vorhanden", () => {
    const existingBody = "# Test\n"
    const result = assembleEnrichedBody(passSummary, existingBody)

    expect(result).toContain("## Notizen")
    // Worum es geht muss vor Notizen, dann Konzepte danach
    expect(result.indexOf("## Worum es geht")).toBeLessThan(
      result.indexOf("## Notizen"),
    )
    expect(result.indexOf("## Notizen")).toBeLessThan(
      result.indexOf("## Besprochene Konzepte"),
    )
  })

  test("setzt --- Trenner um ## Notizen", () => {
    const existingBody = "# Test\n"
    const result = assembleEnrichedBody(passSummary, existingBody)

    // Mindestens zwei --- (vor und nach Notizen)
    const trennerCount = (result.match(/^---$/gm) ?? []).length
    expect(trennerCount).toBeGreaterThanOrEqual(2)
  })

  test("kein ## Agent Zusammenfassung mehr im Output", () => {
    const existingBody = "# Test\n\n## Agent Zusammenfassung\n\nAlter Content\n"
    const result = assembleEnrichedBody(passSummary, existingBody)

    expect(result).not.toContain("## Agent Zusammenfassung")
    expect(result).not.toContain("Alter Content")
  })

  test("Re-Enrich: schon vorhandene Pass-5-Sektionen werden ersetzt, ## Notizen bleibt", () => {
    const existingBody = [
      "# Test",
      "",
      "## Worum es geht",
      "Alter Intro",
      "",
      "## Notizen",
      "User-Notizen die nicht verloren gehen dürfen",
      "",
      "## Besprochene Konzepte",
      "- Alte Konzepte",
    ].join("\n")

    const result = assembleEnrichedBody(passSummary, existingBody)

    expect(result).toContain("Intro-Text mit ein bis zwei Sätzen.")
    expect(result).toContain("User-Notizen die nicht verloren gehen dürfen")
    expect(result).toContain("- A — eins")
    expect(result).not.toContain("Alter Intro")
    expect(result).not.toContain("Alte Konzepte")
  })

  test("verwirft vom LLM erzeugte ## Agent Zusammenfassung (Reasoning-Leakage)", () => {
    const leakySummary = [
      "## Agent Zusammenfassung",
      "",
      "Ich habe genug Lookup-Material. Ich schreibe jetzt die Zusammenfassung.",
      "",
      "## Worum es geht",
      "",
      "Echter Intro-Text.",
      "",
      "## Besprochene Konzepte",
      "",
      "- A — eins",
    ].join("\n")
    const result = assembleEnrichedBody(leakySummary, "# Test\n")

    expect(result).not.toContain("## Agent Zusammenfassung")
    expect(result).not.toContain("Ich habe genug Lookup-Material")
    expect(result).toContain("## Worum es geht")
    expect(result).toContain("Echter Intro-Text.")
    expect(result).toContain("## Besprochene Konzepte")
    expect(result).toContain("- A — eins")
  })

  test("verwirft beliebige nicht-Allowlist-Sektionen aus dem Pass-5-Output", () => {
    const summary = [
      "## Worum es geht",
      "",
      "Intro.",
      "",
      "## Zufällige Erfindung",
      "",
      "Sollte nicht erscheinen.",
      "",
      "## Verwandt",
      "",
      "- [[x]] — y",
    ].join("\n")
    const result = assembleEnrichedBody(summary, "# T\n")

    expect(result).not.toContain("## Zufällige Erfindung")
    expect(result).not.toContain("Sollte nicht erscheinen.")
    expect(result).toContain("## Verwandt")
    expect(result).toContain("- [[x]] — y")
  })

  test("übernimmt alle erlaubten Pass-5-Sektionen", () => {
    const summary = [
      "## Worum es geht",
      "",
      "Intro.",
      "",
      "## Besprochene Konzepte",
      "",
      "- K",
      "",
      "## Behauptungen",
      "",
      "- B",
      "",
      "## Demos / Schritte",
      "",
      "1. Schritt",
      "",
      "## Genannte Tools",
      "",
      "- T",
      "",
      "## Verwandt",
      "",
      "- [[v]] — z",
    ].join("\n")
    const result = assembleEnrichedBody(summary, "# T\n")

    expect(result).toContain("## Besprochene Konzepte")
    expect(result).toContain("## Behauptungen")
    expect(result).toContain("## Demos / Schritte")
    expect(result).toContain("## Genannte Tools")
    expect(result).toContain("## Verwandt")
  })
})
