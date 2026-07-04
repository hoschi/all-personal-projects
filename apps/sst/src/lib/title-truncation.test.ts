import { describe, it, expect } from "bun:test"
import { truncateTitle } from "./title-truncation"

describe("truncateTitle", () => {
  it("lässt Strings ≤12 Zeichen unverändert", () => {
    expect(truncateTitle("kurz")).toBe("kurz")
    expect(truncateTitle("genau zwoelf")).toBe("genau zwoelf")
  })

  it("schneidet Strings >12 Zeichen mit U+2026 ab", () => {
    const result = truncateTitle("dieser titel ist viel zu lang")
    expect(result).toBe("dieser titel…")
    expect(result.endsWith("…")).toBe(true)
  })

  it("handhabt deutsche Umlaute", () => {
    expect(truncateTitle("löschen")).toBe("löschen")
    expect(truncateTitle("für eine wunderbare welt")).toBe("für eine wun…")
  })

  it("benutzerdefinierte maxLength", () => {
    expect(truncateTitle("hallo welt", 5)).toBe("hallo…")
  })
})
