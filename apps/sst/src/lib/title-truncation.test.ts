import { test, expect } from "bun:test"
import { truncateTitle } from "./title-truncation"

test("truncateTitle lässt Strings ≤12 Zeichen unverändert", () => {
  expect(truncateTitle("kurz")).toBe("kurz")
  expect(truncateTitle("genau zwoelf")).toBe("genau zwoelf")
})

test("truncateTitle schneidet Strings >12 Zeichen mit U+2026 ab", () => {
  const result = truncateTitle("dieser titel ist viel zu lang")
  expect(result).toBe("dieser titel…")
  expect(result.endsWith("…")).toBe(true)
})

test("truncateTitle handhabt deutsche Umlaute", () => {
  expect(truncateTitle("löschen")).toBe("löschen")
  expect(truncateTitle("für eine wunderbare welt")).toBe("für eine wun…")
})

test("truncateTitle benutzerdefinierte maxLength", () => {
  expect(truncateTitle("hallo welt", 5)).toBe("hallo…")
})

test("truncateTitle schneidet Emoji ohne kaputte Surrogate-Paare ab", () => {
  // "🎵" ist U+1F3B5 — ein einziger Code-Point, aber zwei UTF-16 Code-Units.
  // maxLength zählt Code-Points; 12 Code-Points mit führendem Emoji sollen
  // vollständig erhalten bleiben, ohne einen halben Surrogate zu produzieren.
  const titleWithEmoji = "🎵 Song Title That Is Too Long"
  const result = truncateTitle(titleWithEmoji)
  expect(result.endsWith("…")).toBe(true)
  // Das erste Zeichen muss der vollständige Emoji bleiben.
  expect([...result][0]).toBe("🎵")
  // Array.from zählt Code-Points: maxLength (12) Code-Points + ELLIPSIS.
  expect([...result].length).toBe(13)

  // Kurzer Titel mit Emoji darf nicht abgeschnitten werden.
  expect(truncateTitle("🎵🎶🎤")).toBe("🎵🎶🎤")
})
