/**
 * Schreibt je Mess-Video die Pass-5-Eingabe (identischer Prompt-Text wie in
 * Produktion) und die Opus-Referenz aus dem Vault-Stub in das Mess-Verzeichnis.
 *
 * Aufruf (aus packages/yt-notes-scripts):
 *   bun run docs/measurements/2026-08-23-pass5-grok46-vs-opus5/dump-prompts.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import { prisma } from "../../../src/db"
import { buildPass5Prompt } from "../../../src/enrich-passes/pass5-summary-long"
import { findStubPath } from "../../../src/stub-path-finder"

const RUN_DIR = dirname(new URL(import.meta.url).pathname)
const VIDEOS = JSON.parse(
  readFileSync(join(RUN_DIR, "videos.json"), "utf-8"),
) as Record<string, { beschreibung: string; videos: string[] }>

mkdirSync(join(RUN_DIR, "prompts"), { recursive: true })
mkdirSync(join(RUN_DIR, "opus"), { recursive: true })
mkdirSync(join(RUN_DIR, "meta"), { recursive: true })

const index: unknown[] = []

for (const [art, cfg] of Object.entries(VIDEOS)) {
  for (const youtubeId of cfg.videos) {
    const video = await prisma.video.findUniqueOrThrow({
      where: { youtubeId },
      include: { channel: true, transcript: true },
    })
    const auditedMd = video.transcript?.auditedMd
    if (!auditedMd) throw new Error(`${youtubeId}: kein audited_md`)

    const stub = await findStubPath(prisma, youtubeId)
    if (!stub) throw new Error(`${youtubeId}: kein Vault-Stub`)

    const prompt = buildPass5Prompt(auditedMd)
    writeFileSync(join(RUN_DIR, "prompts", `${youtubeId}.md`), prompt, "utf-8")
    writeFileSync(
      join(RUN_DIR, "opus", `${youtubeId}.md`),
      readFileSync(stub.absPath, "utf-8"),
      "utf-8",
    )

    const meta = {
      youtubeId,
      art,
      artBeschreibung: cfg.beschreibung,
      title: video.title,
      channel: video.channel?.name ?? null,
      durationSec: video.durationSec,
      auditedAt: video.transcript?.auditedAt,
      auditModelPass1u2: video.transcript?.auditModel,
      auditedMdChars: auditedMd.length,
      promptChars: prompt.length,
      stubVault: stub.name,
      stubRelPath: stub.relPath,
      stubAbsPath: stub.absPath,
    }
    writeFileSync(
      join(RUN_DIR, "meta", `${youtubeId}.json`),
      JSON.stringify(meta, null, 2),
      "utf-8",
    )
    index.push(meta)
    console.log(
      `${art}\t${youtubeId}\tprompt=${prompt.length}\t${video.title.slice(0, 50)}`,
    )
  }
}

writeFileSync(
  join(RUN_DIR, "meta", "_index.json"),
  JSON.stringify(index, null, 2),
  "utf-8",
)
console.log(`\n${index.length} Videos gedumpt.`)
process.exit(0)
