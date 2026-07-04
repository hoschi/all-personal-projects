#!/usr/bin/env bun
/**
 * Backfill-CLI für yt-Stub-Frontmatter youtube_id (Cluster 5 Task 2).
 *
 * Hintergrund: Cluster-5 Task 1 ergänzt die Pipeline so, dass jeder neu
 * geschriebene/aktualisierte Stub-Frontmatter ein youtube_id-Feld trägt.
 * Bestehende Stubs (vor Task 1 angelegt) haben das Feld nicht — dieser
 * Backfill scannt yt.transcript-Rows mit audit_status IN (ok, critical_ok),
 * liest jeden vorhandenen Vault-Stub und ergänzt das youtube_id-Feld
 * idempotent. Pro Edit wird ein Git-Commit erzeugt (best-effort über
 * commitFile).
 *
 * Aufrufe:
 *   bun run src/backfill-frontmatter-yt-id.ts --dry-run
 *   bun run src/backfill-frontmatter-yt-id.ts --limit 10
 *   bun run src/backfill-frontmatter-yt-id.ts --id <youtube-id>
 */
import { Command } from "commander"
import { readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import type { PrismaClient } from "./generated/prisma/client"
import { Prisma } from "./generated/prisma/client"
import { prisma as defaultPrisma } from "./db"
import {
  commitFile as defaultCommitFile,
  type CommitResult,
} from "./git-commit-helper"
import { setFrontmatterFields } from "./stub-md-updater"
import { parseStub } from "./markdown-parser"

export interface BackfillOpts {
  dryRun: boolean
  limit?: number
  id?: string
  // Dependency-Injection-Hooks für Tests (siehe Test-File). Defaults
  // greifen auf den echten Prisma-Client + commitFile-Helper zu, sodass
  // der CLI-Pfad unverändert funktioniert.
  prisma?: PrismaClient
  commitFile?: (
    vaultRoot: string,
    relPath: string,
    message: string,
  ) => Promise<CommitResult>
  readFile?: (path: string, encoding: "utf-8") => Promise<string>
  writeFile?: (path: string, data: string, encoding: "utf-8") => Promise<void>
  fileExists?: (path: string) => boolean
}

export interface BackfillResult {
  edited: number
  skipped: number
  errored: number
}

export async function backfillFrontmatterYtId(
  opts: BackfillOpts,
): Promise<BackfillResult> {
  const result: BackfillResult = { edited: 0, skipped: 0, errored: 0 }
  const prisma = opts.prisma ?? defaultPrisma
  const commit = opts.commitFile ?? defaultCommitFile
  const read = opts.readFile ?? readFile
  const write = opts.writeFile ?? writeFile
  const exists = opts.fileExists ?? existsSync

  const where: Prisma.TranscriptWhereInput = opts.id
    ? { youtubeId: opts.id }
    : { auditStatus: { in: ["ok", "critical_ok"] } }

  const rows = await prisma.transcript.findMany({
    where,
    include: {
      video: {
        include: {
          noteLinks: {
            where: { filePath: { startsWith: "youtube/" } },
            include: { vaultRef: true },
          },
        },
      },
    },
    take: opts.limit,
    orderBy: { youtubeId: "asc" },
  })

  for (const row of rows) {
    const ytId = row.youtubeId
    // Wähle den ersten note_link dessen Datei existiert (Drift-Cases:
    // verwaiste DB-Einträge → überspringen). Pattern angelehnt an
    // src/stub-path-finder.ts.
    const link = row.video.noteLinks.find((l) => {
      if (!l.vaultRef?.rootPath) return false
      return exists(join(l.vaultRef.rootPath, l.filePath))
    })
    if (!link) {
      // Verwaister Audit-Eintrag: audit_status='ok' aber kein note_link mit
      // existierendem Stub. Pre-existing Daten-Lücke (Pipeline-Bug oder
      // Legacy-Audit-Row vor Stub-Generation). Aus Backfill-Sicht: nichts
      // zu backfillen → skipped, nicht errored.
      result.skipped += 1
      console.warn(
        `[backfill ${ytId}] kein passender note_link/Stub — skipped (Pre-existing Daten-Lücke)`,
      )
      continue
    }

    const vaultRoot = link.vaultRef!.rootPath
    const relPath = link.filePath
    const absPath = join(vaultRoot, relPath)

    let md: string
    try {
      md = await read(absPath, "utf-8")
    } catch (e) {
      result.errored += 1
      console.error(`[backfill ${ytId}] readFile fehlgeschlagen: ${e}`)
      continue
    }

    const parsed = parseStub(md)
    // Guard gegen Frontmatter-Verlust: parseStub schluckt YAML-Parse-Errors
    // still und liefert {frontmatter: {}, body: md} sowohl für "kein
    // Frontmatter" als auch für "korruptes YAML". Wenn der Stub mit
    // "---\n" startet, das Frontmatter aber leer ist → korrupt → errored++,
    // damit setFrontmatterFields nicht die kaputten Felder durch nur
    // `youtube_id` ersetzt.
    const hasFmDelim = /^---\n/.test(md)
    if (hasFmDelim && Object.keys(parsed.frontmatter).length === 0) {
      result.errored += 1
      console.error(`[backfill ${ytId}] frontmatter unparseable, skipping`)
      continue
    }
    if (parsed.frontmatter.youtube_id === ytId) {
      result.skipped += 1
      continue
    }

    const updated = setFrontmatterFields(md, { youtube_id: ytId })
    if (!opts.dryRun) {
      try {
        await write(absPath, updated, "utf-8")
      } catch (e) {
        result.errored += 1
        console.error(`[backfill ${ytId}] writeFile fehlgeschlagen: ${e}`)
        continue
      }
      const commitRes = await commit(
        vaultRoot,
        relPath,
        `yt-backfill: youtube_id frontmatter — ${ytId}`,
      )
      if (!commitRes.committed) {
        console.warn(
          `[backfill ${ytId}] commit übersprungen: ${commitRes.reason ?? "unknown"}`,
        )
      }
    }
    result.edited += 1
  }
  return result
}

if (import.meta.main) {
  const program = new Command()
  program
    .option("--dry-run", "kein Write, nur Report")
    .option("--limit <n>", "nur n Rows", (v) => parseInt(v, 10))
    .option("--id <yt-id>", "nur diese yt-id")
    .parse()
  const opts = program.opts()
  const result = await backfillFrontmatterYtId({
    dryRun: opts.dryRun ?? false,
    limit: opts.limit,
    id: opts.id,
  })
  console.log(
    `\nBackfill done — edited: ${result.edited}, skipped: ${result.skipped}, errored: ${result.errored}`,
  )
  process.exit(result.errored > 0 ? 1 : 0)
}
