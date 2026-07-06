import { describe, expect, test } from "bun:test"

// CRITICAL_FILES, parseChangedFiles, classifyDrift sind I/O-frei
// und benötigen keine Mocks. mock.module("node:fs/promises", ...) bzw.
// mock.module("node:util", ...) wären in Bun **global** über alle
// Test-Files im selben `bun test`-Run und würden bestehende Tests
// (z.B. enrich-pipeline.test.ts) brechen.

import {
  CRITICAL_FILES,
  parseChangedFiles,
  classifyDrift,
} from "./check-plugin-drift"

describe("check-plugin-drift", () => {
  test("CRITICAL_FILES enthält LICENSE", () => {
    expect(CRITICAL_FILES).toContain("LICENSE")
  })

  test("CRITICAL_FILES enthält parser.ts, file.ts, templater.ts", () => {
    expect(CRITICAL_FILES).toContain("src/utils/parser.ts")
    expect(CRITICAL_FILES).toContain("src/utils/file.ts")
    expect(CRITICAL_FILES).toContain("src/utils/templater.ts")
  })

  test("parseChangedFiles wandelt gh-Output in Liste", () => {
    const ghOut = "src/main.ts\nsrc/utils/parser.ts\nREADME.md\n"
    expect(parseChangedFiles(ghOut)).toEqual([
      "src/main.ts",
      "src/utils/parser.ts",
      "README.md",
    ])
  })

  test("classifyDrift markiert kritische Files", () => {
    const result = classifyDrift([
      "src/main.ts",
      "src/utils/parser.ts",
      "README.md",
      "LICENSE",
    ])
    expect(result.critical).toEqual(["src/utils/parser.ts", "LICENSE"])
    expect(result.cosmetic).toEqual(["src/main.ts", "README.md"])
  })

  test("classifyDrift bei keinen kritischen Files", () => {
    const result = classifyDrift(["README.md", "src/Settings.svelte"])
    expect(result.critical).toEqual([])
    expect(result.cosmetic).toEqual(["README.md", "src/Settings.svelte"])
  })

  test("classifyDrift matcht Directory-Prefix für src/types/", () => {
    const result = classifyDrift([
      "src/types/Settings.ts",
      "src/types/foo/bar.ts",
    ])
    expect(result.critical).toEqual([
      "src/types/Settings.ts",
      "src/types/foo/bar.ts",
    ])
    expect(result.cosmetic).toEqual([])
  })

  test("parseChangedFiles ignoriert Leerzeilen + Whitespace", () => {
    expect(parseChangedFiles("  src/main.ts  \n\n\nREADME.md\n  \n")).toEqual([
      "src/main.ts",
      "README.md",
    ])
  })
})
