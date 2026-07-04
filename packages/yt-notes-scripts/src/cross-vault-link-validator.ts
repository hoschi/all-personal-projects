import { existsSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

export interface Wikilink {
  full: string
  target: string
  alias?: string
  anchor?: string
  start: number
  end: number
}

export interface BrokenLink {
  target: string
  kbFilePath?: string
  /**
   * Welche Link-Form das Finding ausgelöst hat:
   * - "wikilink": ein `[[…]]`, das nicht im Shared-Vault auflöst (Cross-Vault).
   * - "markdown-intra-vault": ein `[text](…/datei.md)` mit relativem Vault-Pfad —
   *   in einem Obsidian-Vault IMMER falsch (Same-Vault → Wikilink, KB → obsidian://-URI).
   */
  kind?: "wikilink" | "markdown-intra-vault"
  /** Nur für markdown-intra-vault: basename löst im Shared-Vault auf → Wikilink ist die Korrektur. */
  existsInShared?: boolean
}

export interface MarkdownLink {
  full: string
  text: string
  url: string
  /** Datei-Basename ohne Pfad und ohne `.md`, URL-decoded. */
  basename: string
  anchor?: string
  start: number
  end: number
}

export interface VaultResolver {
  existsInShared: (target: string) => boolean
  findInKb: (target: string) => { filePath: string } | null
}

const WIKILINK_RE = /(!?)\[\[([^\]\n]+?)\]\]/g

export function extractWikilinks(text: string): Wikilink[] {
  const out: Wikilink[] = []
  for (const m of text.matchAll(WIKILINK_RE)) {
    if (m[1] === "!") continue
    const body = m[2] ?? ""
    const pipeIdx = body.indexOf("|")
    const targetWithAnchor = pipeIdx === -1 ? body : body.slice(0, pipeIdx)
    const alias = pipeIdx === -1 ? undefined : body.slice(pipeIdx + 1)
    const hashIdx = targetWithAnchor.indexOf("#")
    const target =
      hashIdx === -1 ? targetWithAnchor : targetWithAnchor.slice(0, hashIdx)
    const anchor =
      hashIdx === -1 ? undefined : targetWithAnchor.slice(hashIdx + 1)
    const start = m.index ?? 0
    const link: Wikilink = {
      full: m[0],
      target: target.trim(),
      start,
      end: start + m[0].length,
    }
    if (alias !== undefined) link.alias = alias.trim()
    if (anchor !== undefined) link.anchor = anchor.trim()
    out.push(link)
  }
  return out
}

const MD_LINK_RE = /\[([^\]\n]*)\]\(([^)\n]+)\)/g

/** true für scheme-URLs wie http:, https:, obsidian:, mailto: — also keine relativen Pfade. */
function isSchemeUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(url)
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * Findet Markdown-Links `[text](url)`, deren `url` ein **relativer Pfad auf eine
 * `.md`-Datei** ist (also Vault-interne Notiz-Referenzen). Scheme-URLs
 * (http/https/obsidian/mailto), Nicht-`.md`-Ziele und Image-Embeds `![…](…)`
 * werden übersprungen.
 */
export function extractMarkdownLinks(text: string): MarkdownLink[] {
  const out: MarkdownLink[] = []
  for (const m of text.matchAll(MD_LINK_RE)) {
    const start = m.index ?? 0
    if (start > 0 && text[start - 1] === "!") continue // Image-Embed ![alt](x)
    const rawUrl = m[2] ?? ""
    if (isSchemeUrl(rawUrl)) continue
    const hashIdx = rawUrl.indexOf("#")
    const pathPart = hashIdx === -1 ? rawUrl : rawUrl.slice(0, hashIdx)
    const decoded = safeDecode(pathPart)
    if (!/\.md$/i.test(decoded)) continue // nur Vault-Notiz-Links
    const basename = decoded.replace(/\.md$/i, "").split("/").pop() ?? ""
    const link: MarkdownLink = {
      full: m[0],
      text: m[1] ?? "",
      url: rawUrl,
      basename,
      start,
      end: start + m[0].length,
    }
    if (hashIdx !== -1) link.anchor = safeDecode(rawUrl.slice(hashIdx + 1))
    out.push(link)
  }
  return out
}

export function validateCrossVaultLinks(
  text: string,
  resolver: VaultResolver,
): { broken: BrokenLink[] } {
  const broken: BrokenLink[] = []
  for (const w of extractWikilinks(text)) {
    if (resolver.existsInShared(w.target)) continue
    const kb = resolver.findInKb(w.target)
    const entry: BrokenLink = { target: w.target, kind: "wikilink" }
    if (kb) entry.kbFilePath = kb.filePath
    broken.push(entry)
  }
  // Markdown-Links mit relativem Vault-Pfad sind IMMER falsches Format —
  // unabhängig davon, ob das Ziel existiert. Das deterministische Netz war
  // bisher blind dafür (nur `[[…]]` wurde geprüft).
  for (const md of extractMarkdownLinks(text)) {
    const entry: BrokenLink = {
      target: md.basename,
      kind: "markdown-intra-vault",
    }
    if (resolver.existsInShared(md.basename)) {
      entry.existsInShared = true
    } else {
      const kb = resolver.findInKb(md.basename)
      if (kb) entry.kbFilePath = kb.filePath
    }
    broken.push(entry)
  }
  return { broken }
}

function encodeObsidianFile(filePath: string): string {
  const stripped = filePath.replace(/\.md$/i, "")
  return stripped
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("%2F")
}

export function rewriteBrokenLinks(
  text: string,
  resolver: VaultResolver,
): string {
  type Span = { start: number; end: number; replacement: string }
  const spans: Span[] = []

  for (const w of extractWikilinks(text)) {
    if (resolver.existsInShared(w.target)) continue // korrekter Same-Vault-Wikilink
    const kb = resolver.findInKb(w.target)
    const anchorSuffix = w.anchor ? `#${w.anchor}` : ""
    const replacement = kb
      ? `[${w.alias ?? w.target}](obsidian://open?vault=knowledge-base&file=${encodeObsidianFile(kb.filePath)}${anchorSuffix})`
      : (w.alias ?? w.target)
    spans.push({ start: w.start, end: w.end, replacement })
  }

  for (const md of extractMarkdownLinks(text)) {
    const anchorSuffix = md.anchor ? `#${md.anchor}` : ""
    let replacement: string
    if (resolver.existsInShared(md.basename)) {
      replacement = `[[${md.basename}${anchorSuffix}]]` // Same-Vault → Wikilink
    } else {
      const kb = resolver.findInKb(md.basename)
      replacement = kb
        ? `[${md.text}](obsidian://open?vault=knowledge-base&file=${encodeObsidianFile(kb.filePath)}${anchorSuffix})`
        : md.text // existiert nirgends → Klartext
    }
    spans.push({ start: md.start, end: md.end, replacement })
  }

  if (spans.length === 0) return text
  spans.sort((a, b) => a.start - b.start)

  let out = ""
  let cursor = 0
  for (const s of spans) {
    out += text.slice(cursor, s.start)
    out += s.replacement
    cursor = s.end
  }
  out += text.slice(cursor)
  return out
}

function* walkMarkdownFiles(root: string): Generator<string> {
  if (!existsSync(root)) return
  const stack: string[] = [root]
  while (stack.length > 0) {
    const dir = stack.pop()!
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      continue
    }
    for (const name of entries) {
      if (name.startsWith(".") || name === "node_modules") continue
      const full = join(dir, name)
      let st
      try {
        st = statSync(full)
      } catch {
        continue
      }
      if (st.isDirectory()) {
        stack.push(full)
      } else if (st.isFile() && name.endsWith(".md")) {
        yield full
      }
    }
  }
}

interface VaultIndex {
  byBasename: Map<string, string>
}

function buildVaultIndex(root: string): VaultIndex {
  const byBasename = new Map<string, string>()
  for (const abs of walkMarkdownFiles(root)) {
    const rel = relative(root, abs).split(sep).join("/")
    const base = rel.replace(/\.md$/i, "").split("/").pop() ?? ""
    const key = base.toLowerCase()
    if (!byBasename.has(key)) byBasename.set(key, rel)
  }
  return { byBasename }
}

export function makeFsResolver(
  sharedVaultRoot: string,
  kbVaultRoot: string,
): VaultResolver {
  const sharedIdx = buildVaultIndex(sharedVaultRoot)
  const kbIdx = buildVaultIndex(kbVaultRoot)
  return {
    existsInShared: (target) => sharedIdx.byBasename.has(target.toLowerCase()),
    findInKb: (target) => {
      const filePath = kbIdx.byBasename.get(target.toLowerCase())
      return filePath ? { filePath } : null
    },
  }
}

export function formatRetryHint(broken: BrokenLink[]): string {
  if (broken.length === 0) return ""
  const lines = broken.map((b) => {
    if (b.kind === "markdown-intra-vault") {
      if (b.existsInShared) {
        return `- Markdown-Link auf \`${b.target}\` mit relativem Vault-Pfad ist verboten. Die Datei liegt im selben Vault \`test\` (shared) → schreibe sie als Wikilink [[${b.target}]] (KEIN [text](…/datei.md)).`
      }
      if (b.kbFilePath) {
        return `- Markdown-Link auf \`${b.target}\` mit relativem Vault-Pfad ist verboten. Die Datei liegt im KB-Vault als \`${b.kbFilePath}\` → schreibe [${b.target}](obsidian://open?vault=knowledge-base&file=${encodeObsidianFile(b.kbFilePath)}).`
      }
      return `- Markdown-Link auf \`${b.target}\` mit relativem Vault-Pfad ist verboten und die Datei existiert in keinem Vault → entferne den Link (Klartext lassen).`
    }
    if (b.kbFilePath) {
      return `- [[${b.target}]] → existiert im KB-Vault (knowledge-base) als \`${b.kbFilePath}\`. Schreibe stattdessen [${b.target}](obsidian://open?vault=knowledge-base&file=${encodeObsidianFile(b.kbFilePath)})`
    }
    return `- [[${b.target}]] → existiert weder in test (shared) noch in knowledge-base. Entferne den Wikilink (Klartext lassen).`
  })
  return `Folgende Links lösen NICHT korrekt im Ziel-Vault \`test\` (shared) auf:\n${lines.join("\n")}`
}
