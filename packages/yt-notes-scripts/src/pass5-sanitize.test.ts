import { expect, test } from "bun:test"
import { findH2Sections } from "./markdown-parser"
import { dropPreambleBeforeFirstH2, stripLinkBackticks } from "./pass5-sanitize"

test("unwraps a backtick-wrapped wikilink", () => {
  expect(stripLinkBackticks("- `[[n8n]]` — workflow tool")).toBe(
    "- [[n8n]] — workflow tool",
  )
})

test("unwraps a backtick-wrapped markdown link", () => {
  const input =
    "- `[Plan-Writing](obsidian://open?vault=knowledge-base&file=plan-writing)` — praxis"
  const expected =
    "- [Plan-Writing](obsidian://open?vault=knowledge-base&file=plan-writing) — praxis"
  expect(stripLinkBackticks(input)).toBe(expected)
})

test("unwraps a span where backticks enclose link AND description (prompt-induced pattern)", () => {
  expect(stripLinkBackticks("- `[[Spec Kit]] — same idea`")).toBe(
    "- [[Spec Kit]] — same idea",
  )
})

test("leaves a correctly formatted (unwrapped) link untouched", () => {
  expect(stripLinkBackticks("- [[n8n]] — workflow tool")).toBe(
    "- [[n8n]] — workflow tool",
  )
})

test("leaves ordinary inline code untouched", () => {
  expect(stripLinkBackticks("Use `const x = 1` here")).toBe(
    "Use `const x = 1` here",
  )
})

test("leaves inline code with array indexing untouched", () => {
  expect(stripLinkBackticks("Read `arr[0]` then `score_native >= 0.8`")).toBe(
    "Read `arr[0]` then `score_native >= 0.8`",
  )
})

test("unwraps multiple wrapped links across lines", () => {
  const input = ["- `[[a]]` — one", "- `[[b]]` — two"].join("\n")
  const expected = ["- [[a]] — one", "- [[b]] — two"].join("\n")
  expect(stripLinkBackticks(input)).toBe(expected)
})

test("does not touch a fenced code block containing bracket syntax", () => {
  const input = "```ts\nconst a = arr[0]\n```"
  expect(stripLinkBackticks(input)).toBe(input)
})

// Genau der Ausgabe-Anfang aus dem Lauf fuer Video `qnIu-Xu64H0`
// (Run 39df401a-603a-45cc-9f4f-d4f9ae597653): drei Zwischen-Kommentare, fugenlos
// aneinandergehaengt, danach ohne Zeilenumbruch die erste Ueberschrift.
const GLUED_PREAMBLE =
  "Ich hole zuerst die OHS-Treffer zu den Video-Begriffen, damit die Wikilinks nur auf geprüfte Vault-Artikel zeigen." +
  "Nur der OHS-Lookup ist gerade erlaubt — ich suche damit nach herdr, den genannten Agents und den verwandten Konzepten." +
  "Die ersten Treffer sind teils zu speziell oder YouTube-Notizen — ich suche gezielter nach herdr-Artikeln, Codex, Pi und Agent-Skills." +
  "## Worum es geht\n\nDer Sprecher zeigt herdr.\n\n## Behauptungen\n\n- Etwas."

test("dropPreambleBeforeFirstH2 heilt die angeklebte erste Ueberschrift (Regression qnIu-Xu64H0)", () => {
  const out = dropPreambleBeforeFirstH2(GLUED_PREAMBLE)
  expect(out.split("\n")[0]).toBe("## Worum es geht")
  expect(out).toContain("## Behauptungen")
  expect(out).not.toContain("Ich hole zuerst die OHS-Treffer")
})

test("dropPreambleBeforeFirstH2 rettet die Sektion bis in assembleEnrichedBody", () => {
  const roh = dropPreambleBeforeFirstH2(GLUED_PREAMBLE)
  expect(findH2Sections(roh).map((s) => s.heading)).toEqual([
    "Worum es geht",
    "Behauptungen",
  ])
  // Gegenprobe ohne die Stufe: die erste Sektion faellt weg.
  expect(findH2Sections(GLUED_PREAMBLE).map((s) => s.heading)).toEqual([
    "Behauptungen",
  ])
})

test("dropPreambleBeforeFirstH2 verwirft eine Vorrede mit eigener Zeile", () => {
  const input = "Ich schreibe jetzt.\n\n## Worum es geht\n\nText."
  expect(dropPreambleBeforeFirstH2(input)).toBe("## Worum es geht\n\nText.")
})

test("dropPreambleBeforeFirstH2 laesst saubere Ausgabe unveraendert", () => {
  const input = "## Worum es geht\n\nText.\n\n## Behauptungen\n\n- x"
  expect(dropPreambleBeforeFirstH2(input)).toBe(input)
})

test("dropPreambleBeforeFirstH2 laesst Text ohne H2 unveraendert", () => {
  const input = "Nur Prosa, keine Ueberschrift."
  expect(dropPreambleBeforeFirstH2(input)).toBe(input)
})

test("dropPreambleBeforeFirstH2 faellt nicht auf ### herein", () => {
  const input = "Vorrede.\n\n### Unterpunkt\n\n## Worum es geht\n\nText."
  expect(dropPreambleBeforeFirstH2(input)).toBe("## Worum es geht\n\nText.")
})

test("dropPreambleBeforeFirstH2 ignoriert ## in einem Code-Fence", () => {
  const input =
    "Vorrede.\n\n```sh\n## kein Heading\n```\n\n## Worum es geht\n\nText."
  expect(dropPreambleBeforeFirstH2(input)).toBe("## Worum es geht\n\nText.")
})
