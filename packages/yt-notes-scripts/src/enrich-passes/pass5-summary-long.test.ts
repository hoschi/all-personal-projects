import { describe, expect, test } from "bun:test"
import { buildPass5Prompt } from "./pass5-summary-long"

describe("buildPass5Prompt", () => {
  test("listet 6 Sektionen auf", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("## Worum es geht")
    expect(p).toContain("## Besprochene Konzepte")
    expect(p).toContain("## Behauptungen")
    expect(p).toContain("## Demos / Schritte")
    expect(p).toContain("## Genannte Tools")
    expect(p).toContain("## Verwandt")
  })

  test("verbietet DEINE Spekulation, erlaubt Sprecher-Spekulation", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("**DEINE** Spekulation ist verboten")
    expect(p).toContain("Sprecher-Spekulation")
    expect(p).toContain("Laut Sprecher")
  })

  test("Wikilink-Verfahren mit OHS-Aufruf", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("ohs-search-merged.sh")
    expect(p).toContain("score_native >= 0.8")
    expect(p).not.toContain("score_rrf >= 0.8")
  })

  test("OHS-Aufruf mit explizitem OHS_NODE_BIN-Prefix (Sub-Agent-PATH-Workaround)", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("OHS_NODE_BIN=$HOME/.asdf/shims/node")
  })

  test("Vault-Kontext explizit: Shared-Vault `test`", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("Vault `test`")
    expect(p).toContain("shared/youtube/")
  })

  test("Link-Format nach source_index unterschieden", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain('source_index: "shared"')
    expect(p).toContain('source_index: "kb"')
    expect(p).toContain("obsidian://open?vault=knowledge-base")
    expect(p).toContain("NIEMALS")
  })

  test("URL-Encoding-Hinweis fürs kb-Format", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).toContain("%20")
    expect(p).toContain("URL-Encoding")
  })

  test("retryHint wird eingefügt wenn übergeben", () => {
    const p = buildPass5Prompt(
      "<a>",
      "Cross-Vault-Treffer: [[claude-code-mcp-setup]]",
    )
    expect(p).toContain("Retry-Hinweis")
    expect(p).toContain("claude-code-mcp-setup")
  })

  test("ohne retryHint kein Retry-Block", () => {
    const p = buildPass5Prompt("<a>")
    expect(p).not.toContain("Retry-Hinweis")
  })
})
