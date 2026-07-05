#!/usr/bin/env bun
// Backfill-CLI: läuft über bestehende, schon enrichte Videos und schreibt
// Timestamp → YouTube-Marker-Link in audited_md (DB) und in den Vault-Stub
// (Pass-5-Sektionen). Einmaliger Bestand-Sweep; im laufenden Pipeline-Pfad
// passiert das automatisch in enrich-pipeline.ts.

import { Command } from "commander"
import { readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { prisma } from "./db"
import { linkifyTimestamps } from "./utils/yt-marker"
import { commitFile } from "./git-commit-helper"

interface StubLocation {
  vaultRoot: string
  relPath: string
  absPath: string
}

async function stubPathFor(youtubeId: string): Promise<StubLocation | null> {
  // Spiegel von enrich-video.ts:stubPathFor — auch hier OR-Pfad-Match, um
  // pre/post 4f-Schemata abzudecken.
  const links = await prisma.noteLink.findMany({
    where: {
      youtubeId,
      OR: [
        { filePath: { startsWith: "youtube/" } },
        { filePath: { contains: "/youtube/" } },
      ],
    },
    include: { vaultRef: true },
  })
  for (const link of links) {
    if (!link?.vaultRef?.rootPath) continue
    const vaultRoot = link.vaultRef.rootPath
    const isAbsolute = link.filePath.startsWith("/")
    const relPath =
      isAbsolute && link.filePath.startsWith(vaultRoot + "/")
        ? link.filePath.slice(vaultRoot.length + 1)
        : link.filePath
    const absPath = isAbsolute ? link.filePath : join(vaultRoot, link.filePath)
    if (existsSync(absPath)) return { vaultRoot, relPath, absPath }
  }
  return null
}

interface RelinkOptions {
  dryRun: boolean
  doDb: boolean
  doStub: boolean
  doCommit: boolean
}

interface RelinkStats {
  youtubeId: string
  dbChanged: boolean
  stubChanged: boolean
  committed: boolean
  skipReason?: string
}

async function relinkOne(
  youtubeId: string,
  opts: RelinkOptions,
): Promise<RelinkStats> {
  const transcript = await prisma.transcript.findUnique({
    where: { youtubeId },
  })
  if (!transcript?.auditedMd) {
    return {
      youtubeId,
      dbChanged: false,
      stubChanged: false,
      committed: false,
      skipReason: "no audited_md",
    }
  }

  let dbChanged = false
  if (opts.doDb) {
    const newMd = linkifyTimestamps(transcript.auditedMd, youtubeId)
    if (newMd !== transcript.auditedMd) {
      dbChanged = true
      if (!opts.dryRun) {
        await prisma.transcript.update({
          where: { youtubeId },
          data: { auditedMd: newMd },
        })
      }
    }
  }

  let stubChanged = false
  let committed = false
  if (opts.doStub) {
    const stub = await stubPathFor(youtubeId)
    if (stub) {
      const md = await readFile(stub.absPath, "utf-8")
      const newMd = linkifyTimestamps(md, youtubeId)
      if (newMd !== md) {
        stubChanged = true
        if (!opts.dryRun) {
          await writeFile(stub.absPath, newMd, "utf-8")
          if (opts.doCommit) {
            const titleForMsg = transcript.youtubeId
            const commitMsg = `yt-relink: ${titleForMsg} — Timestamps zu Marker-Links`
            const res = await commitFile(
              stub.vaultRoot,
              stub.relPath,
              commitMsg,
            )
            committed = res.committed
          }
        }
      }
    } else {
      // Kein Stub → still ok, nur DB-Backfill.
    }
  }

  return { youtubeId, dbChanged, stubChanged, committed }
}

async function runForIds(ids: string[], opts: RelinkOptions) {
  console.log(
    `relink-timestamps: ${ids.length} Videos${opts.dryRun ? " (DRY-RUN)" : ""}`,
  )
  console.log(`  DB-Update:    ${opts.doDb}`)
  console.log(`  Stub-Update:  ${opts.doStub}`)
  console.log(`  Vault-Commit: ${opts.doCommit}`)
  console.log("")

  let dbChangedCount = 0
  let stubChangedCount = 0
  let committedCount = 0
  let skippedCount = 0
  const errors: string[] = []

  for (const id of ids) {
    try {
      const stats = await relinkOne(id, opts)
      if (stats.skipReason) {
        skippedCount++
        console.log(`[skip] ${id}: ${stats.skipReason}`)
        continue
      }
      if (stats.dbChanged) dbChangedCount++
      if (stats.stubChanged) stubChangedCount++
      if (stats.committed) committedCount++
      const marks = [
        stats.dbChanged ? "db" : "  ",
        stats.stubChanged ? "stub" : "    ",
        stats.committed ? "git" : "   ",
      ]
      const status = stats.dbChanged || stats.stubChanged ? "CHG" : "noop"
      console.log(`[${status}] ${id} [${marks.join(" ")}]`)
    } catch (e) {
      errors.push(`${id}: ${e instanceof Error ? e.message : String(e)}`)
      console.error(
        `[err] ${id}: ${e instanceof Error ? e.message : String(e)}`,
      )
    }
  }

  console.log("")
  console.log("Summary:")
  console.log(`  total:        ${ids.length}`)
  console.log(`  db-changed:   ${dbChangedCount}`)
  console.log(`  stub-changed: ${stubChangedCount}`)
  console.log(`  committed:    ${committedCount}`)
  console.log(`  skipped:      ${skippedCount}`)
  console.log(`  errors:       ${errors.length}`)
  if (errors.length > 0) {
    console.log("\nFehler-Details:")
    for (const e of errors) console.log(`  - ${e}`)
  }
}

const program = new Command()
program
  .name("relink-timestamps")
  .description(
    "Backfill: Timestamps in audited_md + Vault-Stubs zu YouTube-Marker-Links umschreiben (idempotent)",
  )
  .option("--id <id>", "Nur dieses YouTube-Video (ID)")
  .option("--all", "Alle ok / critical_ok Transcripts mit audited_md")
  .option("--dry-run", "Nichts schreiben, nur zählen + diffen")
  .option("--no-db", "DB-Update überspringen")
  .option("--no-stub", "Stub-Update überspringen")
  .option("--no-commit", "Vault-Commit nach Stub-Update überspringen")

program.action(async (opts) => {
  const relinkOpts: RelinkOptions = {
    dryRun: Boolean(opts.dryRun),
    doDb: opts.db !== false,
    doStub: opts.stub !== false,
    doCommit: opts.commit !== false,
  }

  let ids: string[] = []
  if (opts.id) {
    ids = [opts.id as string]
  } else if (opts.all) {
    const rows = await prisma.transcript.findMany({
      where: {
        OR: [{ auditStatus: "ok" }, { auditStatus: "critical_ok" }],
        auditedMd: { not: null },
      },
      select: { youtubeId: true },
    })
    ids = rows.map((r) => r.youtubeId)
  } else {
    console.error("Specify --id <id> oder --all")
    process.exit(1)
  }

  await runForIds(ids, relinkOpts)
  await prisma.$disconnect()
})

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
