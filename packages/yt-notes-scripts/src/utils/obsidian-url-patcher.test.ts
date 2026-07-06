import { test, expect } from "bun:test"
import { findUrlsToStub, applyPatches } from "./obsidian-url-patcher"

test("findUrlsToStub: single shared→private match", () => {
  const content = `# Test\n\nSiehe [Video](obsidian://open?vault=test&file=shared%2Fyoutube%2FMyChannel%2FTitle) — Beweis.\n`
  const patches = findUrlsToStub(
    content,
    "youtube/MyChannel/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
  expect(patches[0].oldUrl).toBe(
    "obsidian://open?vault=test&file=shared%2Fyoutube%2FMyChannel%2FTitle",
  )
  expect(patches[0].newUrl).toBe(
    "obsidian://open?vault=test&file=private%2Fyoutube%2FMyChannel%2FTitle",
  )
})

test("findUrlsToStub: reverse private→shared match", () => {
  const content = `[Video](obsidian://open?vault=test&file=private%2Fyoutube%2FFoo%2FBar)`
  const patches = findUrlsToStub(
    content,
    "youtube/Foo/Bar.md",
    "test",
    "private",
    "shared",
  )
  expect(patches).toHaveLength(1)
  expect(patches[0].newUrl).toContain("file=shared%2F")
})

test("findUrlsToStub: multiple matches in one article", () => {
  const content = `
[Aussage 1](obsidian://open?vault=test&file=shared%2Fyoutube%2FX%2FY)
weiteres
[Aussage 2](obsidian://open?vault=test&file=shared%2Fyoutube%2FX%2FY)
`
  const patches = findUrlsToStub(
    content,
    "youtube/X/Y.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(2)
  // ascending order
  expect(patches[0].start).toBeLessThan(patches[1].start)
})

test("findUrlsToStub: match preserves &line=N suffix in surrounding content", () => {
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle&line=42)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
  // patch endet vor &line=42, surrounding stays intact after applyPatches
  expect(patches[0].oldUrl.endsWith("Title")).toBe(true)
  expect(patches[0].newUrl).not.toContain("line=")
})

test("findUrlsToStub: display-text bleibt unangetastet", () => {
  const content = `[Titel (4:32)](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
  // patch betrifft nur die URL, nicht den Display-Text
  expect(content.slice(0, patches[0].start)).toBe("[Titel (4:32)](")
})

test("findUrlsToStub: URL-encoded Umlaut im Channel-Namen", () => {
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%C3%B6kanal%2FTitle)`
  const patches = findUrlsToStub(
    content,
    "youtube/Chökanal/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
  expect(patches[0].newUrl).toContain("Ch%C3%B6kanal")
})

test("findUrlsToStub: falscher vault-Name → kein Match", () => {
  const content = `[V](obsidian://open?vault=other&file=shared%2Fyoutube%2FCh%2FTitle)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(0)
})

test("findUrlsToStub: Präfix-Match mit längerem Pfad wird nicht gepatcht", () => {
  // "Title 2" (Title%202) darf nicht als Treffer für "Title" durchgehen
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle%202)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(0)
})

test("findUrlsToStub: kein Match in URL-freiem Content", () => {
  const content = `# Nur Prosa\n\nKein YouTube-Link hier.`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(0)
})

test("findUrlsToStub: URL ohne .md-Endung wird gematcht", () => {
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
})

test("findUrlsToStub: URL mit .md-Endung wird gematcht", () => {
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle.md)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  expect(patches).toHaveLength(1)
  expect(patches[0].oldUrl.endsWith("Title.md")).toBe(true)
})

test("applyPatches: leeres Patch-Array → content unverändert", () => {
  const content = "unchanged"
  expect(applyPatches(content, [])).toBe(content)
})

test("applyPatches: single patch ersetzt URL", () => {
  const content = `[V](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle)`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  const out = applyPatches(content, patches)
  expect(out).toBe(
    `[V](obsidian://open?vault=test&file=private%2Fyoutube%2FCh%2FTitle)`,
  )
})

test("applyPatches: multiple non-overlapping patches", () => {
  const content = `
[A](obsidian://open?vault=test&file=shared%2Fyoutube%2FX%2FY) plus
[B](obsidian://open?vault=test&file=shared%2Fyoutube%2FX%2FY)
`
  const patches = findUrlsToStub(
    content,
    "youtube/X/Y.md",
    "test",
    "shared",
    "private",
  )
  const out = applyPatches(content, patches)
  expect(out.match(/file=private%2F/g)?.length).toBe(2)
  expect(out.includes("file=shared%2F")).toBe(false)
})

test("applyPatches: preserves surrounding content (display-text + &line)", () => {
  const content = `[Titel (4:32)](obsidian://open?vault=test&file=shared%2Fyoutube%2FCh%2FTitle&line=42) Anschluss-Text`
  const patches = findUrlsToStub(
    content,
    "youtube/Ch/Title.md",
    "test",
    "shared",
    "private",
  )
  const out = applyPatches(content, patches)
  expect(out).toBe(
    `[Titel (4:32)](obsidian://open?vault=test&file=private%2Fyoutube%2FCh%2FTitle&line=42) Anschluss-Text`,
  )
})
