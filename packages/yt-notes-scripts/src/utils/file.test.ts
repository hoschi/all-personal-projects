// Logic derived from sundevista/youtube-template@7470a90dfab61fde318b2b03d471c54932faacb2, MIT License
// https://github.com/sundevista/youtube-template/blob/master/LICENSE

import { describe, test, expect } from "bun:test"
import { sanitizeFilename, resolveFilenameConflict } from "./file"

describe("sanitizeFilename", () => {
  test("replaces forbidden filesystem chars", () => {
    expect(sanitizeFilename('a<b>c:d"e/f\\g|h?i*j')).toBe("a_b_c_d_e_f_g_h_i_j")
  })

  test("removes control characters", () => {
    expect(sanitizeFilename("a\x00b\x1fc")).toBe("a_b_c")
  })

  test("replaces Windows reserved names (case-insensitive)", () => {
    expect(sanitizeFilename("CON")).toBe("_CON")
    expect(sanitizeFilename("prn")).toBe("_prn")
    expect(sanitizeFilename("lpt1")).toBe("_lpt1")
  })

  test("strips trailing dots", () => {
    expect(sanitizeFilename("name.")).toBe("name")
    expect(sanitizeFilename("name...")).toBe("name")
  })

  test("strips trailing spaces", () => {
    expect(sanitizeFilename("name ")).toBe("name")
    expect(sanitizeFilename("name   ")).toBe("name")
  })

  test("returns empty string for empty input", () => {
    expect(sanitizeFilename("")).toBe("")
  })

  test("UTF-8 byte truncation at 255 bytes with multi-byte emoji", () => {
    const emoji = "🎵" // 4 bytes
    const input = emoji.repeat(70) // 280 bytes
    const result = sanitizeFilename(input)
    const byteLen = new TextEncoder().encode(result).length
    expect(byteLen).toBeLessThanOrEqual(255)
    expect(result.length).toBeGreaterThan(0)
  })

  test("custom replacement applied", () => {
    expect(sanitizeFilename("a/b", "-")).toBe("a-b")
  })

  test("preserves valid unicode (German umlauts)", () => {
    expect(sanitizeFilename("Müller über Größe")).toBe("Müller über Größe")
  })
})

describe("resolveFilenameConflict", () => {
  test("no conflict → original path returned", () => {
    expect(resolveFilenameConflict("notes/foo.md", () => false)).toBe(
      "notes/foo.md",
    )
  })

  test("1 conflict → 'foo 1.md'", () => {
    const seen = new Set(["notes/foo.md"])
    expect(resolveFilenameConflict("notes/foo.md", (p) => seen.has(p))).toBe(
      "notes/foo 1.md",
    )
  })

  test("2 conflicts → 'foo 2.md'", () => {
    const seen = new Set(["notes/foo.md", "notes/foo 1.md"])
    expect(resolveFilenameConflict("notes/foo.md", (p) => seen.has(p))).toBe(
      "notes/foo 2.md",
    )
  })

  test("file without extension", () => {
    const seen = new Set(["notes/README"])
    expect(resolveFilenameConflict("notes/README", (p) => seen.has(p))).toBe(
      "notes/README 1",
    )
  })
})
