import { mock } from "bun:test"

// WICHTIG: mock.module() retroaktiv vor den Imports der zu testenden Datei,
// damit die DB-/Server-Imports beim Laden nicht crashen.
mock.module("@repo/yt-notes-scripts/db", () => ({ prisma: {} }))
mock.module("./prisma", () => ({ prisma: {} }))
mock.module("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: () => ({ handler: () => ({}) }),
  }),
}))

import { describe, it, expect } from "bun:test"
import { appendToNotizenSection } from "./yt-binding-actions"

describe("appendToNotizenSection", () => {
  it("hängt an existierende Sektion an (Pass-5-Layout mit ---)", () => {
    const md = `---
title: Test
---

# Test

## Notizen

Erste Notiz.

---

## Andere Sektion

Inhalt.
`
    const result = appendToNotizenSection(md, "Zweite Notiz.")
    expect(result).toContain("Erste Notiz.")
    expect(result).toContain("Zweite Notiz.")
    expect(result).toContain("## Andere Sektion")
    const idxFirst = result.indexOf("Erste Notiz.")
    const idxSecond = result.indexOf("Zweite Notiz.")
    const idxTrenner = result.indexOf("\n---\n", idxFirst)
    const idxAndere = result.indexOf("## Andere Sektion")
    expect(idxFirst).toBeLessThan(idxSecond)
    expect(idxSecond).toBeLessThan(idxTrenner)
    expect(idxTrenner).toBeLessThan(idxAndere)
  })

  it("hängt vor `---`-Trenner ein (echtes Pass-5-Layout)", () => {
    const md = `# Test

## Worum es geht

Pass-5-Synthese-Block.

---

## Notizen

[URL](https://youtu.be/abc)
…bestehender User-Text…

---

## Besprochene Konzepte

Inhalt.
`
    const result = appendToNotizenSection(md, "diktierter Text")
    const idxUserText = result.indexOf("…bestehender User-Text…")
    const idxDiktiert = result.indexOf("diktierter Text")
    // Letzter `---`-Trenner (nach dem Diktat), nicht der zwischen
    // ## Worum es geht und ## Notizen.
    const idxTrenner = result.indexOf("\n---\n", idxDiktiert)
    const idxBesprochene = result.indexOf("## Besprochene Konzepte")
    expect(idxUserText).toBeLessThan(idxDiktiert)
    expect(idxDiktiert).toBeLessThan(idxTrenner)
    expect(idxTrenner).toBeLessThan(idxBesprochene)
    // Trenner darf nicht doppelt vorkommen (kein zusätzlicher `---` durch Insert)
    const trennerCount = (result.match(/\n---\n/g) ?? []).length
    expect(trennerCount).toBe(2) // einer vor `## Notizen`, einer dahinter
  })

  it("erstellt Notizen-Sektion wenn fehlt", () => {
    const md = `---
title: Test
---

# Test

Body.
`
    const result = appendToNotizenSection(md, "Neue Notiz.")
    expect(result).toContain("## Notizen")
    expect(result).toContain("Neue Notiz.")
  })

  it("hängt an leere Notizen-Sektion an (Pass-5-Layout mit ---)", () => {
    const md = `# Test

## Notizen

---

## Andere

Inhalt.
`
    const result = appendToNotizenSection(md, "Erste Notiz.")
    const notizenIdx = result.indexOf("## Notizen")
    const notizIdx = result.indexOf("Erste Notiz.")
    const trennerIdx = result.indexOf("\n---\n", notizIdx)
    const andereIdx = result.indexOf("## Andere")
    expect(notizenIdx).toBeLessThan(notizIdx)
    expect(notizIdx).toBeLessThan(trennerIdx)
    expect(trennerIdx).toBeLessThan(andereIdx)
  })

  it("hängt an Legacy-Sektion ohne `---`-Trenner an", () => {
    // Verteidigt den Fallback-Pfad für alt-formatierte oder
    // handbearbeitete Stubs ohne Pass-5-Trenner.
    const md = `# Test

## Notizen

Erste Notiz.

## Andere

Inhalt.
`
    const result = appendToNotizenSection(md, "Zweite Notiz.")
    const idxFirst = result.indexOf("Erste Notiz.")
    const idxSecond = result.indexOf("Zweite Notiz.")
    const idxAndere = result.indexOf("## Andere")
    expect(idxFirst).toBeLessThan(idxSecond)
    expect(idxSecond).toBeLessThan(idxAndere)
  })
})
