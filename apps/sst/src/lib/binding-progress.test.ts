import { test, expect } from "bun:test"
import {
  BINDING_STALE_CUTOFF_MS,
  deriveBindingInProgress,
} from "./binding-progress"

// Fixer Referenz-Zeitpunkt statt `new Date()`, damit der Test datumsstabil ist
// (kein now()-Util in dieser App — daher wird now injiziert).
const NOW = new Date("2026-07-05T12:00:00.000Z")

test("deriveBindingInProgress ist false, wenn kein Bind läuft (null)", () => {
  expect(deriveBindingInProgress(null, NOW)).toBe(false)
})

test("deriveBindingInProgress ist true für einen frisch gesetzten Marker", () => {
  expect(deriveBindingInProgress(NOW, NOW)).toBe(true)
})

test("deriveBindingInProgress ist true innerhalb des Cutoffs (aktive Bind-Phase)", () => {
  // 2 Minuten alt — deutlich innerhalb des 10-Minuten-Cutoffs, ein laufender
  // Bind darf nie versteckt werden.
  const twoMinutesAgo = new Date(NOW.getTime() - 2 * 60 * 1000)
  expect(deriveBindingInProgress(twoMinutesAgo, NOW)).toBe(true)
})

test("deriveBindingInProgress ist an der Cutoff-Grenze false (strikt größer)", () => {
  const atCutoff = new Date(NOW.getTime() - BINDING_STALE_CUTOFF_MS)
  expect(deriveBindingInProgress(atCutoff, NOW)).toBe(false)

  const justInside = new Date(NOW.getTime() - BINDING_STALE_CUTOFF_MS + 1)
  expect(deriveBindingInProgress(justInside, NOW)).toBe(true)
})

test("deriveBindingInProgress behandelt einen abgelaufenen Marker als stale (false)", () => {
  // 11 Minuten alt — jenseits des Cutoffs, z.B. Server-Crash mitten im Bind.
  const elevenMinutesAgo = new Date(NOW.getTime() - 11 * 60 * 1000)
  expect(deriveBindingInProgress(elevenMinutesAgo, NOW)).toBe(false)
})

test("BINDING_STALE_CUTOFF_MS liegt komfortabel über der ~1-2 Min Critical-Phase", () => {
  expect(BINDING_STALE_CUTOFF_MS).toBe(10 * 60 * 1000)
})
