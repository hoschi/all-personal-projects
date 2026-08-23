/**
 * Fuehrt die Grok-Rohausgabe durch dieselbe Nachbearbeitung wie die Pipeline
 * (stripLinkBackticks -> Cross-Vault-Auto-Fix -> linkifyTimestamps ->
 * assembleEnrichedBody) und legt das Ergebnis als <id>.assembled.md ab. Das ist
 * die Fassung, die bei einem echten Lauf im Vault landen wuerde.
 *
 * Aufruf (aus packages/yt-notes-scripts):
 *   bun run docs/measurements/2026-08-23-pass5-grok46-vs-opus5/assemble-grok.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import {
  makeFsResolver,
  rewriteBrokenLinks,
  validateCrossVaultLinks,
} from "../../../src/cross-vault-link-validator"
import { parseStub } from "../../../src/markdown-parser"
import { stripLinkBackticks } from "../../../src/pass5-sanitize"
import { assembleEnrichedBody } from "../../../src/stub-md-updater"
import { linkifyTimestamps } from "../../../src/utils/yt-marker"

const RUN_DIR = dirname(new URL(import.meta.url).pathname)
const SHARED_VAULT =
  "/Users/hoschi/Library/CloudStorage/Dropbox/obsidian-test/test/shared"
const KB_VAULT = "/Users/hoschi/repos/kims/knowledge-base"
const resolver = makeFsResolver(dirname(SHARED_VAULT), KB_VAULT)

const metas = JSON.parse(
  readFileSync(join(RUN_DIR, "meta", "_index.json"), "utf-8"),
) as { youtubeId: string }[]

for (const { youtubeId } of metas) {
  const rohPfad = join(RUN_DIR, "grok", `${youtubeId}.raw.md`)
  if (!existsSync(rohPfad)) continue
  const roh = readFileSync(rohPfad, "utf-8")

  let out = stripLinkBackticks(roh)
  const { broken } = validateCrossVaultLinks(out, resolver)
  const autoFixAnzahl = broken.length
  if (autoFixAnzahl > 0) out = rewriteBrokenLinks(out, resolver)
  out = linkifyTimestamps(out, youtubeId)

  const stubBody = parseStub(
    readFileSync(join(RUN_DIR, "opus", `${youtubeId}.md`), "utf-8"),
  ).body
  const assembled = assembleEnrichedBody(out, stubBody)
  writeFileSync(
    join(RUN_DIR, "grok", `${youtubeId}.assembled.md`),
    assembled,
    "utf-8",
  )
  console.log(`${youtubeId}\tauto-fix=${autoFixAnzahl}\t${assembled.length} B`)
}
