import { expect, test } from "bun:test"
import { stripLinkBackticks } from "./pass5-sanitize"

test("unwraps a backtick-wrapped wikilink", () => {
  expect(stripLinkBackticks("- `[[n8n]]` — workflow tool")).toBe(
    "- [[n8n]] — workflow tool",
  )
})

test("unwraps a backtick-wrapped markdown link", () => {
  const input =
    "- `[Plan-Writing](obsidian://open?vault=knowledge-base&file=plan-writing)` — praxis"
  const expected =
    "- [Plan-Writing](obsidian://open?vault=knowledge-base&file=plan-writing) — praxis"
  expect(stripLinkBackticks(input)).toBe(expected)
})

test("unwraps a span where backticks enclose link AND description (prompt-induced pattern)", () => {
  expect(stripLinkBackticks("- `[[Spec Kit]] — same idea`")).toBe(
    "- [[Spec Kit]] — same idea",
  )
})

test("leaves a correctly formatted (unwrapped) link untouched", () => {
  expect(stripLinkBackticks("- [[n8n]] — workflow tool")).toBe(
    "- [[n8n]] — workflow tool",
  )
})

test("leaves ordinary inline code untouched", () => {
  expect(stripLinkBackticks("Use `const x = 1` here")).toBe(
    "Use `const x = 1` here",
  )
})

test("leaves inline code with array indexing untouched", () => {
  expect(stripLinkBackticks("Read `arr[0]` then `score_native >= 0.8`")).toBe(
    "Read `arr[0]` then `score_native >= 0.8`",
  )
})

test("unwraps multiple wrapped links across lines", () => {
  const input = ["- `[[a]]` — one", "- `[[b]]` — two"].join("\n")
  const expected = ["- [[a]] — one", "- [[b]] — two"].join("\n")
  expect(stripLinkBackticks(input)).toBe(expected)
})

test("does not touch a fenced code block containing bracket syntax", () => {
  const input = "```ts\nconst a = arr[0]\n```"
  expect(stripLinkBackticks(input)).toBe(input)
})
