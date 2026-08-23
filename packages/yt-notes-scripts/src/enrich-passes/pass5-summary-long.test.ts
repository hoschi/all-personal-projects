import { expect, test } from "bun:test"
import { buildCursorModelSlug } from "../llm-caller"
import {
  buildPass5AllowedShellPrefixes,
  buildPass5CallOptions,
  buildPass5Prompt,
} from "./pass5-summary-long"

test("buildPass5Prompt listet 6 Sektionen auf", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("## Worum es geht")
  expect(p).toContain("## Besprochene Konzepte")
  expect(p).toContain("## Behauptungen")
  expect(p).toContain("## Demos / Schritte")
  expect(p).toContain("## Genannte Tools")
  expect(p).toContain("## Verwandt")
})

test("buildPass5Prompt verbietet DEINE Spekulation, erlaubt Sprecher-Spekulation", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("**DEINE** Spekulation ist verboten")
  expect(p).toContain("Sprecher-Spekulation")
  expect(p).toContain("Laut Sprecher")
})

test("buildPass5Prompt Wikilink-Verfahren mit OHS-Aufruf", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("ohs-search-merged.sh")
  expect(p).toContain("score_native >= 0.8")
  expect(p).not.toContain("score_rrf >= 0.8")
})

test("buildPass5Prompt OHS-Aufruf mit explizitem OHS_NODE_BIN-Prefix (Sub-Agent-PATH-Workaround)", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("OHS_NODE_BIN=$HOME/.asdf/shims/node")
})

test("buildPass5Prompt Vault-Kontext explizit: Shared-Vault `test`", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("Vault `test`")
  expect(p).toContain("shared/youtube/")
})

test("buildPass5Prompt Link-Format nach source_index unterschieden", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain('source_index: "shared"')
  expect(p).toContain('source_index: "kb"')
  expect(p).toContain("obsidian://open?vault=knowledge-base")
  expect(p).toContain("NIEMALS")
})

test("buildPass5Prompt URL-Encoding-Hinweis fürs kb-Format", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).toContain("%20")
  expect(p).toContain("URL-Encoding")
})

test("buildPass5Prompt retryHint wird eingefügt wenn übergeben", () => {
  const p = buildPass5Prompt(
    "<a>",
    "Cross-Vault-Treffer: [[claude-code-mcp-setup]]",
  )
  expect(p).toContain("Retry-Hinweis")
  expect(p).toContain("claude-code-mcp-setup")
})

test("buildPass5Prompt ohne retryHint kein Retry-Block", () => {
  const p = buildPass5Prompt("<a>")
  expect(p).not.toContain("Retry-Hinweis")
})

test("Pass 5 läuft über den cursor-Kanal auf dem gemessenen Grok-Slug", () => {
  const opts = buildPass5CallOptions("PROMPT", "pass5/yt=abc attempt=1")
  expect(opts.channel).toBe("cursor-cli")
  expect(buildCursorModelSlug(opts.model, opts.effort)).toBe(
    "cursor-grok-4.6-xhigh",
  )
  expect(opts.prompt).toBe("PROMPT")
  expect(opts.tag).toBe("pass5/yt=abc attempt=1")
})

test("Pass 5 gibt dem Sub-Agenten nur den OHS-Aufruf frei", () => {
  const prefixes = buildPass5CallOptions("PROMPT").allowedShellPrefixes
  expect(prefixes).toEqual(buildPass5AllowedShellPrefixes())
  expect(prefixes.length).toBe(3)
  for (const prefix of prefixes) {
    expect(prefix).toContain("ohs-search-merged.sh")
    // Kein Platzhalter im Präfix — sonst wäre der Interpreter frei wählbar.
    expect(prefix).not.toContain("*")
  }
})

test("das erste Shell-Präfix steht zeichengleich im Prompt (Anti-Drift)", () => {
  const prompt = buildPass5Prompt("<a>")
  const instructed = buildPass5AllowedShellPrefixes()[0]
  expect(instructed).toBeDefined()
  expect(prompt).toContain(`${instructed} --vault-type arbeit`)
})
