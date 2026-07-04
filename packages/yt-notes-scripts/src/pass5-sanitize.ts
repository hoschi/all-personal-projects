// Single-backtick inline-code span (no newline, no nested backtick).
const INLINE_CODE_RE = /`([^`\n]+)`/g

// A span content is a "wrapped link" when it STARTS with a wikilink (`[[`)
// or a markdown link (`[text](`). Trailing description after the link is fine
// — the LLM is prompted with examples like `[[name]] — desc` and copies the
// backticks around the whole bullet, which we want to unwrap entirely.
const STARTS_WITH_LINK_RE = /^!?\[(\[|[^\]]*\]\()/

/**
 * Removes backticks that the summary LLM wrongly wraps around Obsidian links,
 * which would otherwise render the link as inline code instead of a clickable
 * link. Only spans whose content starts with link syntax are unwrapped, so
 * genuine inline code (`const x = 1`, `arr[0]`, `score_native >= 0.8`) and
 * fenced code blocks stay untouched.
 */
export function stripLinkBackticks(text: string): string {
  return text.replace(INLINE_CODE_RE, (match, content: string) =>
    STARTS_WITH_LINK_RE.test(content.trim()) ? content : match,
  )
}
