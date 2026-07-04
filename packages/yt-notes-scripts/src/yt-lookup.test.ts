import { describe, expect, test } from "bun:test"
import { formatOutput, parseLookupOpts, resolveYtIdFromFile } from "./yt-lookup"

describe("yt-lookup Args-Parsing", () => {
  test("--id Pflicht ODER --file Pflicht", () => {
    expect(() => parseLookupOpts({})).toThrow(/--id ODER --file/)
  })

  test("--id setzt id", () => {
    const opts = parseLookupOpts({ id: "abc123" })
    expect(opts.id).toBe("abc123")
    expect(opts.file).toBeUndefined()
  })

  test("--file setzt file", () => {
    const opts = parseLookupOpts({ file: "/path/to/stub.md" })
    expect(opts.file).toBe("/path/to/stub.md")
  })

  test("default field = audited_md", () => {
    const opts = parseLookupOpts({ id: "x" })
    expect(opts.field).toBe("audited_md")
  })

  test("default format = markdown", () => {
    const opts = parseLookupOpts({ id: "x" })
    expect(opts.format).toBe("markdown")
  })

  test("--field validiert gegen erlaubte Werte", () => {
    expect(() => parseLookupOpts({ id: "x", field: "garbage" })).toThrow(
      /unbekanntes Feld/,
    )
  })

  test("--format validiert", () => {
    expect(() => parseLookupOpts({ id: "x", format: "xml" })).toThrow(
      /unbekanntes Format/,
    )
  })

  test("--id UND --file gleichzeitig ist Error", () => {
    expect(() => parseLookupOpts({ id: "x", file: "y" })).toThrow(/exklusiv/)
  })

  test("noHeader default = false wenn nicht gesetzt", () => {
    const opts = parseLookupOpts({ id: "x" })
    expect(opts.noHeader).toBe(false)
  })

  test("noHeader = true wenn explizit übergeben", () => {
    const opts = parseLookupOpts({ id: "x", noHeader: true })
    expect(opts.noHeader).toBe(true)
  })
})

describe("formatOutput", () => {
  const fakeRow = {
    youtubeId: "abc123",
    auditStatus: "ok" as const,
    auditedMd: "## Sektion\nContent",
    plain: "raw transcript text",
    llmFormatted: null,
    srt: null,
    namedEntities: ["TanStack", "tRPC"],
    video: {
      displayTitle: "Display-Title",
      title: "Original Title",
      publishedAt: new Date("2026-01-15"),
      durationSec: 543,
      descriptionShort: "Kurzbeschreibung",
      channel: { name: "Some Channel", classification: "arbeit" as const },
    },
  }

  test("markdown-Format hat Header + Feld", () => {
    const out = formatOutput(fakeRow, "audited_md", "markdown", false)
    expect(out).toContain("# Display-Title")
    expect(out).toContain("**Channel:** Some Channel")
    expect(out).toContain("## audited_md")
    expect(out).toContain("Content")
  })

  test("markdown --no-header zeigt nur Feld", () => {
    const out = formatOutput(fakeRow, "plain", "markdown", true)
    expect(out).not.toContain("# Display-Title")
    expect(out).toBe("raw transcript text")
  })

  test("json-Format ist valides JSON mit Metadaten", () => {
    const out = formatOutput(fakeRow, "named_entities", "json", false)
    const parsed = JSON.parse(out)
    expect(parsed.youtube_id).toBe("abc123")
    expect(parsed.field).toBe("named_entities")
    expect(parsed.value).toEqual(["TanStack", "tRPC"])
  })

  test("raw-Format gibt nur Feldwert als String", () => {
    const out = formatOutput(fakeRow, "audited_md", "raw", false)
    expect(out).toBe("## Sektion\nContent")
  })

  test("--field all zeigt alle Felder mit Sub-Headern", () => {
    const out = formatOutput(fakeRow, "all", "markdown", false)
    expect(out).toContain("## audited_md")
    expect(out).toContain("## plain")
    expect(out).toContain("## named_entities")
    expect(out).toContain("## description_short")
  })

  test("description_short kommt vom video, nicht vom transcript", () => {
    // Regression-Test: Plan-Code hatte descriptionShort auf Transcript-Ebene,
    // tatsächliches Schema legt es auf Video. Falls dieser Test fail, prüfen
    // ob getFieldValue("description_short") versehentlich auf row.descriptionShort
    // (nicht-existent) statt row.video.descriptionShort greift.
    const out = formatOutput(fakeRow, "description_short", "raw", false)
    expect(out).toBe("Kurzbeschreibung")
  })
})

describe("resolveYtIdFromFile", () => {
  // Hinweis: yt-IDs sind exakt 11 Zeichen [A-Za-z0-9_-]. Tests verwenden
  // 11-Char-IDs, damit der URL-Regex (mit {11}) sauber matcht und gleichzeitig
  // gegen false-positives (z.B. Tracking-Param-IDs) schützt (Option A im Plan).
  test("liest youtube_id aus Frontmatter (Vorrang)", () => {
    const md = `---
title: Foo
youtube_id: abc123fromfm
---

Body mit https://youtu.be/xyz999fromurl Link
`
    expect(resolveYtIdFromFile(md)).toBe("abc123fromfm")
  })

  test("Fallback URL-Regex youtu.be", () => {
    const md = `---
title: Foo
---

Body mit https://youtu.be/abc12345678 in der Quelle
`
    expect(resolveYtIdFromFile(md)).toBe("abc12345678")
  })

  test("Fallback URL-Regex youtube.com/watch", () => {
    const md = `---
title: Foo
---

Quelle: https://www.youtube.com/watch?v=watch456789&t=42
`
    expect(resolveYtIdFromFile(md)).toBe("watch456789")
  })

  test("wirft Error wenn keine yt-id gefunden", () => {
    const md = `---
title: Foo
---

Body ohne Link.
`
    expect(() => resolveYtIdFromFile(md)).toThrow(/keine yt-id/)
  })
})
