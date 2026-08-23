/**
 * Misst die Pass-5-Ausgaben beider Arme (Opus 5 high aus Produktion, Grok 4.6
 * xhigh aus dem Vergleichslauf) gegen die Regeln des Pass-5-Prompts und
 * schreibt metrics.json plus eine Tabelle auf stdout.
 *
 * Aufruf (aus packages/yt-notes-scripts):
 *   bun run docs/measurements/2026-08-23-pass5-grok46-vs-opus5/analyze.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import {
  extractMarkdownLinks,
  extractWikilinks,
  makeFsResolver,
  validateCrossVaultLinks,
} from "../../../src/cross-vault-link-validator"
import { findH2Sections, parseStub } from "../../../src/markdown-parser"

const RUN_DIR = dirname(new URL(import.meta.url).pathname)
const SHARED_VAULT =
  "/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/shared"
const KB_VAULT = "/Users/hoschi/repos/kims/knowledge-base"

// makeFsResolver bekommt das ELTERN-Verzeichnis des Shared-Vaults (so ruft die
// Pipeline es auch auf: dirname(stub.vaultRoot)).
const resolver = makeFsResolver(dirname(SHARED_VAULT), KB_VAULT)

const SOLL_SEKTIONEN = [
  "Worum es geht",
  "Besprochene Konzepte",
  "Behauptungen",
  "Demos / Schritte",
  "Genannte Tools",
  "Verwandt",
]

/** Timestamp-Format laut Prompt: M:SS, MM:SS, H:MM:SS, HH:MM:SS in runden Klammern. */
const TS_OK_RE = /\((\d{1,2}:\d{2}(:\d{2})?)\)/g
/** Von der Pipeline erzeugte Marker-Form: ([M:SS](https://…&t=…s)) */
const TS_LINKED_RE = /\(\[(\d{1,2}:\d{2}(:\d{2})?)\]\(https:\/\/[^)]+\)\)/g

interface SectionStats {
  vorhanden: boolean
  zeichen: number
  bullets: number
}

interface Messung {
  quelle: "opus" | "grok"
  youtubeId: string
  zeichen: number
  sektionen: Record<string, SectionStats>
  sektionenVorhanden: number
  fremdeUeberschriften: string[]
  vorredeZeichen: number
  wikilinks: number
  obsidianLinks: number
  linksGesamt: number
  brokenWikilinks: number
  brokenObsidianUris: number
  brokenRelativeMdLinks: number
  linksInBacktick: number
  linksInBehauptungen: number
  selbstReferenzen: number
  behauptungenBullets: number
  behauptungenMitTimestamp: number
  timestampsFormatVerletzt: number
}

function bulletCount(text: string): number {
  return text
    .split("\n")
    .filter((l) => /^\s*([-*]\s+|\d+\.\s+)/.test(l)).length
}

/** Zieht die Pass-5-Sektionen aus einem Body (Stub-Body oder Roh-Ausgabe). */
function sektionen(body: string): {
  map: Record<string, string>
  fremde: string[]
  vorrede: string
} {
  const secs = findH2Sections(body)
  const map: Record<string, string> = {}
  const fremde: string[] = []
  for (const s of secs) {
    const kopfEnde = body.indexOf("\n", s.start)
    const inhalt = body.slice(kopfEnde === -1 ? s.end : kopfEnde + 1, s.end)
    if (s.heading === "Notizen") continue // menschlicher Teil des Stubs
    if (SOLL_SEKTIONEN.includes(s.heading)) map[s.heading] = inhalt
    else fremde.push(s.heading)
  }
  const ersteSoll = secs.find((s) => s.heading === "Worum es geht")
  // Vorrede = alles vor der ersten Soll-Sektion, ohne H1-Zeile.
  const vorrede = ersteSoll
    ? body
        .slice(0, ersteSoll.start)
        .replace(/^#\s.*$/m, "")
        .replace(/^---[\s\S]*?^---$/m, "")
        .trim()
    : body.trim()
  return { map, fremde, vorrede }
}

function messe(
  quelle: "opus" | "grok",
  youtubeId: string,
  body: string,
  videoTitel: string,
): Messung {
  const { map, fremde, vorrede } = sektionen(body)
  const sektionStats: Record<string, SectionStats> = {}
  for (const name of SOLL_SEKTIONEN) {
    const inhalt = map[name]
    sektionStats[name] = {
      vorhanden: inhalt !== undefined,
      zeichen: inhalt?.trim().length ?? 0,
      bullets: inhalt ? bulletCount(inhalt) : 0,
    }
  }

  const wikilinks = extractWikilinks(body)
  const obsidianLinks = [...body.matchAll(/\[[^\]\n]*\]\(obsidian:\/\/[^)]+\)/g)]
  const relMd = extractMarkdownLinks(body)
  const { broken } = validateCrossVaultLinks(body, resolver)

  // obsidian://-URIs pruefen: die Ziel-Datei muss im KB-Vault existieren.
  // validateCrossVaultLinks laesst Scheme-URLs unangetastet durch, ein
  // erfundenes Ziel faellt dort also nicht auf.
  let brokenUris = 0
  for (const m of body.matchAll(
    /\[[^\]\n]*\]\(obsidian:\/\/open\?([^)]+)\)/g,
  )) {
    const params = new URLSearchParams((m[1] ?? "").replace(/&amp;/g, "&"))
    const vault = params.get("vault")
    const datei = params.get("file")
    if (!datei) {
      brokenUris++
      continue
    }
    const wurzel = vault === "knowledge-base" ? KB_VAULT : SHARED_VAULT
    if (!existsSync(join(wurzel, `${datei}.md`))) brokenUris++
  }

  // Links in Backticks: `[[…]]` oder `[…](obsidian://…)` innerhalb von Inline-Code.
  const inBacktick = [
    ...body.matchAll(/`[^`\n]*(\[\[[^\]\n]+\]\]|\]\(obsidian:\/\/)[^`\n]*`/g),
  ].length

  const behauptungen = map["Behauptungen"] ?? ""
  const behauptungenZeilen = behauptungen
    .split("\n")
    .filter((l) => /^\s*[-*]\s+/.test(l))
  const linksInBehauptungen =
    extractWikilinks(behauptungen).length +
    [...behauptungen.matchAll(/\[[^\]\n]*\]\(obsidian:\/\/[^)]+\)/g)].length

  const mitTs = behauptungenZeilen.filter(
    (l) => TS_OK_RE.test(l) || TS_LINKED_RE.test(l),
  ).length
  TS_OK_RE.lastIndex = 0
  TS_LINKED_RE.lastIndex = 0

  // Timestamp-Formatverletzungen: Klammer-Ausdruck, der wie eine Zeitangabe
  // aussieht, aber weder M:SS-Form noch die Pipeline-Marker-Form trifft.
  const tsKandidaten = [...body.matchAll(/\((\d[\d:.,]*\s*(s|sek|min)?)\)/gi)]
  const tsVerletzt = tsKandidaten.filter(
    (m) => !/^\d{1,2}:\d{2}(:\d{2})?$/.test((m[1] ?? "").trim()),
  ).length

  const titelKern = videoTitel.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  const selbstRef = [
    ...wikilinks.map((w) => w.target),
    ...obsidianLinks.map((m) =>
      decodeURIComponent(/file=([^)&]+)/.exec(m[0])?.[1] ?? ""),
    ),
  ].filter((t) => {
    const norm = t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
    // Kurze Ziele ("n8n") treffen sonst zufaellig eine Teilzeichenkette des
    // Titels und erzeugen Falsch-Positive.
    return (
      titelKern.length > 12 &&
      norm.length >= 20 &&
      (norm.includes(titelKern.slice(0, 40)) ||
        titelKern.includes(norm.slice(0, 40)))
    )
  }).length

  return {
    quelle,
    youtubeId,
    zeichen: body.trim().length,
    sektionen: sektionStats,
    sektionenVorhanden: Object.values(sektionStats).filter((s) => s.vorhanden)
      .length,
    fremdeUeberschriften: fremde,
    vorredeZeichen: vorrede.length,
    wikilinks: wikilinks.length,
    obsidianLinks: obsidianLinks.length,
    linksGesamt: wikilinks.length + obsidianLinks.length,
    brokenWikilinks: broken.filter((b) => b.kind === "wikilink").length,
    brokenObsidianUris: brokenUris,
    brokenRelativeMdLinks: relMd.length,
    linksInBacktick: inBacktick,
    linksInBehauptungen,
    selbstReferenzen: selbstRef,
    behauptungenBullets: behauptungenZeilen.length,
    behauptungenMitTimestamp: mitTs,
    timestampsFormatVerletzt: tsVerletzt,
  }
}

const metas = JSON.parse(
  readFileSync(join(RUN_DIR, "meta", "_index.json"), "utf-8"),
) as {
  youtubeId: string
  art: string
  title: string
  durationSec: number
  auditedMdChars: number
}[]

const ergebnisse: Record<string, unknown>[] = []

for (const meta of metas) {
  const opusPfad = join(RUN_DIR, "opus", `${meta.youtubeId}.md`)
  const grokPfad = join(RUN_DIR, "grok", `${meta.youtubeId}.raw.md`)
  if (!existsSync(grokPfad)) {
    console.log(`SKIP ${meta.youtubeId} — keine Grok-Ausgabe`)
    continue
  }
  const opusBody = parseStub(readFileSync(opusPfad, "utf-8")).body
  const grokRaw = readFileSync(grokPfad, "utf-8")

  const o = messe("opus", meta.youtubeId, opusBody, meta.title)
  const g = messe("grok", meta.youtubeId, grokRaw, meta.title)
  ergebnisse.push({ meta, opus: o, grok: g })
}

writeFileSync(
  join(RUN_DIR, "metrics.json"),
  JSON.stringify(ergebnisse, null, 2),
  "utf-8",
)

// Tabelle
const kopf = [
  "id",
  "art",
  "arm",
  "zeichen",
  "sekt",
  "fremd",
  "vorrede",
  "links",
  "brokWiki",
  "brokUri",
  "relMd",
  "btick",
  "linkInBeh",
  "selbstRef",
  "behBullets",
  "behTS",
  "tsBad",
]
console.log(kopf.join("\t"))
for (const e of ergebnisse) {
  const m = e.meta as { youtubeId: string; art: string }
  for (const arm of ["opus", "grok"] as const) {
    const x = e[arm] as Messung
    console.log(
      [
        m.youtubeId,
        m.art.slice(0, 12),
        arm,
        x.zeichen,
        `${x.sektionenVorhanden}/6`,
        x.fremdeUeberschriften.length,
        x.vorredeZeichen,
        x.linksGesamt,
        x.brokenWikilinks,
        x.brokenObsidianUris,
        x.brokenRelativeMdLinks,
        x.linksInBacktick,
        x.linksInBehauptungen,
        x.selbstReferenzen,
        x.behauptungenBullets,
        x.behauptungenMitTimestamp,
        x.timestampsFormatVerletzt,
      ].join("\t"),
    )
  }
}
console.log(`\n${ergebnisse.length} Videos gemessen -> metrics.json`)
