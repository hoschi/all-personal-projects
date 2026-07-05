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
