import { describe, expect, test } from "bun:test"
import {
  extractMarkdownLinks,
  extractWikilinks,
  validateCrossVaultLinks,
  rewriteBrokenLinks,
  type VaultResolver,
} from "./cross-vault-link-validator"

const mkResolver = (
  shared: Set<string>,
  kb: Map<string, string>,
): VaultResolver => ({
  existsInShared: (target) => shared.has(target.toLowerCase()),
  findInKb: (target) => {
    const filePath = kb.get(target.toLowerCase())
    return filePath ? { filePath } : null
  },
})

describe("extractWikilinks", () => {
  test("findet einfache [[X]] Wikilinks", () => {
    const r = extractWikilinks("Siehe [[foo]] und [[bar]] hier.")
    expect(r.map((w) => w.target)).toEqual(["foo", "bar"])
  })

  test("ignoriert Markdown-Image-Embeds ![[X]]", () => {
    const r = extractWikilinks("Bild ![[img.png]] vs Link [[note]]")
    expect(r.map((w) => w.target)).toEqual(["note"])
  })

  test("Alias-Syntax [[X|Alias]]: target=X, alias=Alias", () => {
    const r = extractWikilinks("Siehe [[foo|Foo-Alias]]")
    expect(r).toEqual([
      {
        full: "[[foo|Foo-Alias]]",
        target: "foo",
        alias: "Foo-Alias",
        start: 6,
        end: 23,
      },
    ])
  })

  test("Anchor-Syntax [[X#Section]]: target=X, anchor erkannt", () => {
    const r = extractWikilinks("Siehe [[foo#Section]]")
    expect(r[0]?.target).toBe("foo")
    expect(r[0]?.anchor).toBe("Section")
  })

  test("kein Crash bei leerem String", () => {
    expect(extractWikilinks("")).toEqual([])
  })
})

describe("validateCrossVaultLinks", () => {
  test("alle Wikilinks im Shared-Vault → keine broken", () => {
    const resolver = mkResolver(new Set(["foo", "bar"]), new Map())
    const r = validateCrossVaultLinks("[[foo]] und [[bar]]", resolver)
    expect(r.broken).toEqual([])
  })

  test("Wikilink im KB-Vault → broken mit kbFilePath", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-mcp-setup", "claude-code-mcp-setup.md"]]),
    )
    const r = validateCrossVaultLinks(
      "Siehe [[claude-code-mcp-setup]]",
      resolver,
    )
    expect(r.broken.length).toBe(1)
    expect(r.broken[0]?.target).toBe("claude-code-mcp-setup")
    expect(r.broken[0]?.kbFilePath).toBe("claude-code-mcp-setup.md")
  })

  test("Wikilink nirgends → broken ohne kbFilePath", () => {
    const resolver = mkResolver(new Set(), new Map())
    const r = validateCrossVaultLinks("[[ghost-article]]", resolver)
    expect(r.broken.length).toBe(1)
    expect(r.broken[0]?.kbFilePath).toBeUndefined()
  })

  test("mixed: shared ok + kb broken", () => {
    const resolver = mkResolver(
      new Set(["video-context"]),
      new Map([["claude-code-mcp-setup", "claude-code-mcp-setup.md"]]),
    )
    const r = validateCrossVaultLinks(
      "[[video-context]] und [[claude-code-mcp-setup]]",
      resolver,
    )
    expect(r.broken.length).toBe(1)
    expect(r.broken[0]?.target).toBe("claude-code-mcp-setup")
  })

  test("Image-Embed ![[…]] wird ignoriert", () => {
    const resolver = mkResolver(new Set(), new Map())
    const r = validateCrossVaultLinks("![[some-image.png]]", resolver)
    expect(r.broken).toEqual([])
  })
})

describe("rewriteBrokenLinks", () => {
  test("KB-Treffer → obsidian://-URI mit URL-encoded file_path", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-mcp-setup", "claude-code-mcp-setup.md"]]),
    )
    const fixed = rewriteBrokenLinks(
      "Siehe [[claude-code-mcp-setup]] hier.",
      resolver,
    )
    expect(fixed).toContain(
      "[claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup)",
    )
    expect(fixed).not.toContain("[[claude-code-mcp-setup]]")
  })

  test("KB-Treffer mit Alias übernimmt Alias als Linktext", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-mcp-setup", "claude-code-mcp-setup.md"]]),
    )
    const fixed = rewriteBrokenLinks(
      "Siehe [[claude-code-mcp-setup|MCP-Setup]] hier.",
      resolver,
    )
    expect(fixed).toContain(
      "[MCP-Setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup)",
    )
  })

  test("KB-Treffer mit Sonderzeichen im file_path wird URL-encoded", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["foo bar", "subdir/foo bar.md"]]),
    )
    const fixed = rewriteBrokenLinks("[[foo bar]]", resolver)
    expect(fixed).toContain(
      "[foo bar](obsidian://open?vault=knowledge-base&file=subdir%2Ffoo%20bar)",
    )
  })

  test("unauflösbarer Wikilink → Klartext (Alias bevorzugt)", () => {
    const resolver = mkResolver(new Set(), new Map())
    const fixed = rewriteBrokenLinks(
      "Siehe [[ghost-article]] und [[other|Anderer]] hier.",
      resolver,
    )
    expect(fixed).toBe("Siehe ghost-article und Anderer hier.")
  })

  test("Shared-Vault-Wikilinks bleiben unverändert", () => {
    const resolver = mkResolver(new Set(["video-context"]), new Map())
    const fixed = rewriteBrokenLinks("[[video-context]]", resolver)
    expect(fixed).toBe("[[video-context]]")
  })

  test("Anchor wird in obsidian://-URI als #-Fragment beibehalten", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-mcp-setup", "claude-code-mcp-setup.md"]]),
    )
    const fixed = rewriteBrokenLinks(
      "[[claude-code-mcp-setup#Setup]]",
      resolver,
    )
    expect(fixed).toContain(
      "[claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup#Setup)",
    )
  })
})

describe("extractMarkdownLinks", () => {
  test("findet relativen .md-Link, basename URL-decoded", () => {
    const r = extractMarkdownLinks(
      "- [Titel](shared/youtube/Matt%20Pocock/_handoff%20skill.md) — x",
    )
    expect(r.length).toBe(1)
    expect(r[0]?.text).toBe("Titel")
    expect(r[0]?.basename).toBe("_handoff skill")
  })

  test("ignoriert http(s)-Links (YouTube-Timestamps, URL-Zeile)", () => {
    const r = extractMarkdownLinks(
      "[URL](https://www.youtube.com/watch?v=abc) und ([0:00](https://y/?t=0s))",
    )
    expect(r).toEqual([])
  })

  test("ignoriert obsidian://-URIs (KB-Cross-Vault-Links)", () => {
    const r = extractMarkdownLinks(
      "[claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills)",
    )
    expect(r).toEqual([])
  })

  test("ignoriert Markdown-Image-Embeds ![alt](x.md)", () => {
    const r = extractMarkdownLinks("![alt](shared/foo.md)")
    expect(r).toEqual([])
  })

  test("Anchor wird vom basename getrennt", () => {
    const r = extractMarkdownLinks("[T](shared/foo.md#Abschnitt)")
    expect(r[0]?.basename).toBe("foo")
    expect(r[0]?.anchor).toBe("Abschnitt")
  })
})

describe("validateCrossVaultLinks — Markdown-Intra-Vault-Links", () => {
  test("Markdown-Link auf Same-Vault-Datei → broken (falsches Format)", () => {
    const resolver = mkResolver(new Set(["_handoff skill"]), new Map())
    const r = validateCrossVaultLinks(
      "- [Titel](shared/youtube/Matt%20Pocock/_handoff%20skill.md) — x",
      resolver,
    )
    expect(r.broken.length).toBe(1)
    expect(r.broken[0]?.kind).toBe("markdown-intra-vault")
    expect(r.broken[0]?.target).toBe("_handoff skill")
  })

  test("korrekter Same-Vault-Wikilink bleibt nicht-broken", () => {
    const resolver = mkResolver(new Set(["_handoff skill"]), new Map())
    const r = validateCrossVaultLinks("[[_handoff skill]]", resolver)
    expect(r.broken).toEqual([])
  })

  test("Markdown-Link auf KB-Datei → broken mit kbFilePath", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-skills", "claude-code-skills.md"]]),
    )
    const r = validateCrossVaultLinks(
      "[X](knowledge-base/claude-code-skills.md)",
      resolver,
    )
    expect(r.broken.length).toBe(1)
    expect(r.broken[0]?.kind).toBe("markdown-intra-vault")
    expect(r.broken[0]?.kbFilePath).toBe("claude-code-skills.md")
  })
})

describe("rewriteBrokenLinks — Markdown-Intra-Vault-Links", () => {
  test("Same-Vault-Markdown-Link → Wikilink", () => {
    const resolver = mkResolver(new Set(["_handoff skill"]), new Map())
    const fixed = rewriteBrokenLinks(
      "- [Titel](shared/youtube/Matt%20Pocock/_handoff%20skill.md) — x",
      resolver,
    )
    expect(fixed).toBe("- [[_handoff skill]] — x")
  })

  test("Same-Vault-Markdown-Link mit Anchor → Wikilink mit Anchor", () => {
    const resolver = mkResolver(new Set(["foo"]), new Map())
    const fixed = rewriteBrokenLinks("[T](shared/foo.md#Abschnitt)", resolver)
    expect(fixed).toBe("[[foo#Abschnitt]]")
  })

  test("KB-Markdown-Link → obsidian://-URI (Linktext bleibt)", () => {
    const resolver = mkResolver(
      new Set(),
      new Map([["claude-code-skills", "claude-code-skills.md"]]),
    )
    const fixed = rewriteBrokenLinks(
      "[claude-code-skills](knowledge-base/claude-code-skills.md)",
      resolver,
    )
    expect(fixed).toBe(
      "[claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills)",
    )
  })

  test("unauflösbarer Markdown-Link → Klartext (Linktext)", () => {
    const resolver = mkResolver(new Set(), new Map())
    const fixed = rewriteBrokenLinks("[Geist](shared/ghost.md)", resolver)
    expect(fixed).toBe("Geist")
  })

  test("http- und obsidian-Markdown-Links bleiben unverändert", () => {
    const resolver = mkResolver(new Set(), new Map())
    const input =
      "[URL](https://www.youtube.com/watch?v=abc) und [x](obsidian://open?vault=knowledge-base&file=y)"
    expect(rewriteBrokenLinks(input, resolver)).toBe(input)
  })
})

describe("E2E — echter Bug aus Video UzMNBN6xLLA (Matt Pocock /grill-*)", () => {
  // Exakte 'Genannte Tools'-Sektion wie vom Pass-5-LLM erzeugt (Bug-Zeile 74).
  const realPass5Excerpt = `## Genannte Tools

- \`/grill-me\` und \`/grill-with-docs\` — Matt Pococks eigene Skills, Ersatz für Plan-Mode in Coding-Agents.
- [/handoff is my new favourite skill](shared/youtube/Matt%20Pocock/_handoff%20is%20my%20new%20favourite%20skill.md) — Pococks Handoff-Skill, der eine Session in ein Markdown-Dokument komprimiert.
- \`/two PRD\` — Pococks Skill zum Erzeugen eines Handoff-Dokuments.

## Verwandt

- [[claude-code-skills]] — Allgemeines zu Claude Code Skills.`

  const resolver = mkResolver(
    new Set(["_handoff is my new favourite skill"]),
    new Map([["claude-code-skills", "claude-code-skills.md"]]),
  )

  test("Validator erkennt den Markdown-Intra-Vault-Link als broken", () => {
    const { broken } = validateCrossVaultLinks(realPass5Excerpt, resolver)
    const md = broken.filter((b) => b.kind === "markdown-intra-vault")
    expect(md.length).toBe(1)
    expect(md[0]?.target).toBe("_handoff is my new favourite skill")
  })

  test("Auto-Fix wandelt ihn in einen Wikilink, KB-Wikilink → obsidian-URI", () => {
    const fixed = rewriteBrokenLinks(realPass5Excerpt, resolver)
    expect(fixed).toContain(
      "- [[_handoff is my new favourite skill]] — Pococks",
    )
    expect(fixed).not.toContain("](shared/youtube/")
    expect(fixed).toContain(
      "[claude-code-skills](obsidian://open?vault=knowledge-base&file=claude-code-skills)",
    )
  })
})
