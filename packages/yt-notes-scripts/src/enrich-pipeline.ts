import { readFile, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { Prisma, PrismaClient } from "./generated/prisma/client"
import { AuditStatus } from "./generated/prisma/enums"
import { USER_KB_VAULT_NAME } from "./db"
import type { Classification } from "./llm-caller"
import { migrateStubBody } from "./enrich-passes/pass0-stub-migration"
import { runPass1Extended } from "./enrich-passes/pass1-audit"
import { runPass2 } from "./enrich-passes/pass2-asr-fix"
import { runPass3 } from "./enrich-passes/pass3-display-title"
import { runPass4 } from "./enrich-passes/pass4-description"
import { runPass5 } from "./enrich-passes/pass5-summary-long"
import { stripLinkBackticks } from "./pass5-sanitize"
import { parseStub, getRawFrontmatterBlock } from "./markdown-parser"
import {
  setFrontmatterFields,
  mergeAliasField,
  assembleEnrichedBody,
} from "./stub-md-updater"
import { commitFile } from "./git-commit-helper"
import { linkifyTimestamps } from "./utils/yt-marker"
import {
  formatRetryHint,
  makeFsResolver,
  rewriteBrokenLinks,
  validateCrossVaultLinks,
  type VaultResolver,
} from "./cross-vault-link-validator"

export interface StubLocation {
  /** Obsidian-Vault-Name (yt.vault.name) des Vaults, in dem der Stub liegt. */
  name: string
  vaultRoot: string
  relPath: string
  absPath: string
}

const MAX_DURATION_SEC = 2700 // 45 min

export type SkipReason =
  | "skip_too_long"
  | "skip_classification_mismatch"
  | "transcript_missing"
  | "transcript_error_upstream"
  | "idempotent"

export interface ShouldSkipVideoShape {
  durationSec: number | null
  channel: { classification: "arbeit" | "privat" | "mixed" | "unknown" } | null
  transcript: {
    plain: string | null
    error: string | null
    auditStatus: AuditStatus
    auditedMd: string | null
  } | null
}

export function shouldSkip(
  video: ShouldSkipVideoShape,
  classification: Classification,
  bypassClassificationCheck = false,
): SkipReason | null {
  if (video.durationSec && video.durationSec > MAX_DURATION_SEC)
    return "skip_too_long"
  if (
    !bypassClassificationCheck &&
    video.channel?.classification !== classification
  )
    return "skip_classification_mismatch"
  if (!video.transcript?.plain) return "transcript_missing"
  if (video.transcript.error) return "transcript_error_upstream"
  // Idempotent: status ok oder critical_ok (Background schon laufend oder done) mit audited_md.
  // error_passN-Stati sind explizit "muss neu" — kein Idempotenz-Skip.
  if (
    (video.transcript.auditStatus === "ok" ||
      video.transcript.auditStatus === "critical_ok") &&
    video.transcript.auditedMd
  ) {
    return "idempotent"
  }
  return null
}

export interface EnrichVideoOptions {
  prisma: PrismaClient
  youtubeId: string
  classification: Classification
  runId: string
  stubPath: (youtubeId: string) => Promise<StubLocation | null> // injizierbar für Tests
  bypassClassificationCheck?: boolean
}

export interface CriticalResult {
  skipped: SkipReason | null
  status: AuditStatus
  displayTitle?: string
  namedEntities?: string[]
  descriptionShort?: string
}

export interface BackgroundResult {
  status: AuditStatus
}

export async function enrichVideoCritical(
  opts: EnrichVideoOptions,
): Promise<CriticalResult> {
  const {
    prisma,
    youtubeId,
    classification,
    runId,
    stubPath,
    bypassClassificationCheck = false,
  } = opts
  const video = await prisma.video.findUniqueOrThrow({
    where: { youtubeId },
    include: { transcript: true, channel: true },
  })

  const skip = shouldSkip(video, classification, bypassClassificationCheck)
  if (skip === "idempotent") {
    return { skipped: skip, status: video.transcript!.auditStatus }
  }
  if (skip) {
    const status = skip as AuditStatus
    await prisma.transcript.update({
      where: { youtubeId },
      data: { auditStatus: status, auditRunId: runId },
    })
    return { skipped: skip, status }
  }

  // Pass 0 + Pass 1 (Extended) + Pass 3 + Pass 4 — alle in einem try.
  // Critical-Phase-Fehler (inkl. Stub-Migration) landen unter error_pass1.
  try {
    // Pass 0 — deterministische Stub-Migration
    const stub = await stubPath(youtubeId)
    if (stub) {
      const md = await readFile(stub.absPath, "utf-8")
      const parsed = parseStub(md)
      const newBody = migrateStubBody(parsed.body)
      if (newBody !== parsed.body) {
        const newMd = `${getRawFrontmatterBlock(md)}\n\n${newBody}`
        await writeFile(stub.absPath, newMd, "utf-8")
      }
    }

    const pass1 = await runPass1Extended({
      chapters: video.chapters as unknown as Array<{
        timestamp: string
        title: string
      }> | null,
      plain: video.transcript!.plain!,
    })
    if (!pass1.auditedMd || pass1.auditedMd.trim() === "") {
      await markError(
        prisma,
        youtubeId,
        runId,
        "error_empty_output",
        "Pass 1 empty",
      )
      return { skipped: null, status: "error_empty_output" }
    }

    // Deterministisches Post-Process: Timestamps in Sektion-Headern und
    // Werbung-Markern zu YouTube-Marker-Links umschreiben. Idempotent — kein
    // Schaden, falls Pass 1 (zukünftig) schon Links liefert.
    pass1.auditedMd = linkifyTimestamps(pass1.auditedMd, youtubeId)

    // Pass 3 + Pass 4 parallel
    const [displayTitle, descriptionShort] = await Promise.all([
      runPass3(video.title, video.description ?? "", pass1.auditedMd),
      runPass4(video.description ?? "", pass1.auditedMd),
    ])

    // DB-Update — Status critical_ok
    await prisma.transcript.update({
      where: { youtubeId },
      data: {
        auditedMd: pass1.auditedMd,
        namedEntities: pass1.namedEntities,
        auditedAt: new Date(),
        auditModel: "claude-opus-4-8",
        auditRunId: runId,
        auditStatus: "critical_ok",
      },
    })
    await prisma.video.update({
      where: { youtubeId },
      data: { displayTitle, descriptionShort },
    })

    return {
      skipped: null,
      status: "critical_ok",
      displayTitle,
      namedEntities: pass1.namedEntities,
      descriptionShort,
    }
  } catch (e) {
    const msg = e instanceof Error ? (e.stack ?? e.message) : String(e)
    // Pass 1 + Pass 3 + Pass 4 zusammen im Critical-try — alle Fehler hier
    // fallen unter error_pass1 als Sammelbecken.
    const failureStatus: AuditStatus = "error_pass1"
    await markError(prisma, youtubeId, runId, failureStatus, msg)
    return { skipped: null, status: failureStatus }
  }
}

export async function enrichVideoBackground(
  opts: EnrichVideoOptions,
): Promise<BackgroundResult> {
  const { prisma, youtubeId, runId, stubPath } = opts
  const transcript = await prisma.transcript.findUniqueOrThrow({
    where: { youtubeId },
  })

  if (transcript.auditStatus !== "critical_ok") {
    // Pre-Condition verletzt — nichts zu tun
    return { status: transcript.auditStatus }
  }

  // Pass 2 — ASR-Fix (granularer Fehler-Status)
  let auditedMd = transcript.auditedMd!
  try {
    const auditedFromPass2 = await runPass2(transcript.auditedMd!)
    auditedMd = auditedFromPass2 || transcript.auditedMd!
    // Idempotenter Linkify-Repair: falls Pass 2 ASR-„Fixes" auf den
    // Marker-Links angewandt hat, schreiben wir sie hier zurück.
    auditedMd = linkifyTimestamps(auditedMd, youtubeId)
    if (auditedMd !== transcript.auditedMd) {
      await prisma.transcript.update({
        where: { youtubeId },
        data: { auditedMd },
      })
    }
  } catch (e) {
    const msg = e instanceof Error ? (e.stack ?? e.message) : String(e)
    await markError(prisma, youtubeId, runId, "error_pass2", msg)
    return { status: "error_pass2" }
  }

  // Pass 5 — Summary Long mit Cross-Vault-Wikilink-Retry-Loop
  let summaryLong: string
  try {
    // Resolver-Aufbau ist best-effort: wenn der stubPath-Lookup oder die KB-
    // Vault-Resolution fehlschlägt, läuft Pass 5 ohne Validator. Der eigentliche
    // Stub-Write-Block weiter unten behandelt stubPath-Fehler dann als
    // error_stub_write.
    let resolver: VaultResolver | null = null
    // Nur relevant, wenn resolver gesetzt ist (dann existiert stubForResolver
    // und damit der echte Shared-Vault-Name). formatRetryHint wird ausschließlich
    // hinter dem `if (!resolver) break` erreicht.
    let sharedVaultName = ""
    try {
      const stubForResolver = await stubPath(youtubeId)
      if (stubForResolver) {
        sharedVaultName = stubForResolver.name
        resolver = makeFsResolver(
          dirname(stubForResolver.vaultRoot),
          await resolveKbVaultRoot(prisma),
        )
      }
    } catch (e) {
      console.log(
        `[enrich ${youtubeId}] Resolver-Setup failed, Pass 5 läuft ohne Validator: ${e instanceof Error ? e.message : String(e)}`,
      )
    }

    let retryHint: string | undefined
    let pass5Output = ""
    const MAX_ATTEMPTS = 3
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const tag = `pass5/yt=${youtubeId} attempt=${attempt}`
      pass5Output = stripLinkBackticks(
        await runPass5(auditedMd, retryHint, tag),
      )
      if (!resolver) break
      const { broken } = validateCrossVaultLinks(pass5Output, resolver)
      if (broken.length === 0) break
      if (attempt === MAX_ATTEMPTS) {
        console.log(
          `[enrich ${youtubeId}] Pass 5 nach ${MAX_ATTEMPTS} Versuchen noch ${broken.length} broken Cross-Vault-Link(s) — Auto-Fix`,
        )
        pass5Output = rewriteBrokenLinks(pass5Output, resolver)
        break
      }
      console.log(
        `[enrich ${youtubeId}] Pass 5 Versuch ${attempt}/${MAX_ATTEMPTS}: ${broken.length} broken Cross-Vault-Link(s), retry`,
      )
      retryHint = formatRetryHint(broken, sharedVaultName)
    }
    summaryLong = linkifyTimestamps(pass5Output, youtubeId)
  } catch (e) {
    const msg = e instanceof Error ? (e.stack ?? e.message) : String(e)
    await markError(prisma, youtubeId, runId, "error_pass5_summary_long", msg)
    return { status: "error_pass5_summary_long" }
  }

  // Stub-Update + Vault-Commit
  try {
    const stub = await stubPath(youtubeId)
    if (stub) {
      const video = await prisma.video.findUniqueOrThrow({
        where: { youtubeId },
      })
      const md = await readFile(stub.absPath, "utf-8")
      const parsedBefore = parseStub(md)
      const aliases = mergeAliasField(
        parsedBefore.frontmatter.aliases,
        video.displayTitle ?? video.title,
      )
      const withFm = setFrontmatterFields(md, {
        display_title: video.displayTitle ?? video.title,
        description: video.descriptionShort ?? "",
        aliases,
        youtube_id: youtubeId,
      })
      const parsedAfterFm = parseStub(withFm)
      const newBody = assembleEnrichedBody(summaryLong, parsedAfterFm.body)
      const fmRaw = getRawFrontmatterBlock(withFm)
      await writeFile(stub.absPath, `${fmRaw}\n\n${newBody}`, "utf-8")
      const titleForMsg = (video.displayTitle ?? video.title)
        .slice(0, 60)
        .replace(/\n/g, " ")
      const commitMsg = `yt-enrich: ${youtubeId} — ${titleForMsg}`
      const commitResult = await commitFile(
        stub.vaultRoot,
        stub.relPath,
        commitMsg,
      )
      if (!commitResult.committed) {
        console.log(
          `[enrich ${youtubeId}] kein Vault-Commit: ${commitResult.reason}`,
        )
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? (e.stack ?? e.message) : String(e)
    await markError(prisma, youtubeId, runId, "error_stub_write", msg)
    return { status: "error_stub_write" }
  }

  // Final DB update — über Helper damit consecutive_failure_count auf 0 resettet
  await updateAuditStatus(prisma, youtubeId, "ok", {
    auditError: null,
    auditRunId: runId,
  })
  return { status: "ok" }
}

export async function enrichVideo(
  opts: EnrichVideoOptions,
): Promise<{ skipped: SkipReason | null; status: AuditStatus }> {
  const critical = await enrichVideoCritical(opts)
  if (critical.status !== "critical_ok") {
    return { skipped: critical.skipped, status: critical.status }
  }
  const background = await enrichVideoBackground(opts)
  return { skipped: null, status: background.status }
}

async function markError(
  prisma: PrismaClient,
  youtubeId: string,
  runId: string,
  status: AuditStatus,
  error: string,
) {
  await updateAuditStatus(prisma, youtubeId, status, {
    auditError: error.slice(0, 5000),
    auditRunId: runId,
  })
}

let kbVaultRootCache: string | null = null
async function resolveKbVaultRoot(prisma: PrismaClient): Promise<string> {
  if (kbVaultRootCache) return kbVaultRootCache
  const vault = await prisma.vault.findUnique({
    where: { name: USER_KB_VAULT_NAME },
  })
  if (!vault) throw new Error(`yt.vault has no '${USER_KB_VAULT_NAME}' entry`)
  kbVaultRootCache = vault.rootPath
  return vault.rootPath
}

/**
 * Zentralisierter Setter für audit_status — pflegt automatisch den
 * consecutive_failure_count + first/last_errored_at-Timestamps.
 *
 * Verhalten:
 * - newStatus === "ok": counter → 0, first/last → null
 * - newStatus startsWith "error_" und alter Status war auch error_*:
 *   counter += 1, firstErroredAt bleibt, lastErroredAt = now
 * - newStatus startsWith "error_" und alter Status war NICHT error_*:
 *   counter → 1, firstErroredAt = lastErroredAt = now
 * - alle anderen newStatus (pending, critical_ok, skip_*, transcript_*):
 *   Counter + Timestamps unangetastet — Zwischen-/Skip-Stati sind nicht zählbar
 *
 * Nicht concurrency-sicher — read-modify-write ohne Lock. Caller muss
 * serielle Ausführung pro youtubeId garantieren (im Nightly-Job durch
 * sequentielle Video-Iteration gegeben).
 */
export async function updateAuditStatus(
  prisma: PrismaClient,
  youtubeId: string,
  newStatus: AuditStatus,
  extraData: {
    auditError?: string | null
    auditRunId?: string
    auditedMd?: string | null
    auditedAt?: Date | null
    auditModel?: string | null
    auditDiffPct?: number | null
    namedEntities?: Prisma.InputJsonValue | typeof Prisma.DbNull
  } = {},
) {
  const isError = newStatus.startsWith("error_")
  const isOk = newStatus === "ok"

  let counterUpdate: {
    consecutiveFailureCount?: number
    firstErroredAt?: Date | null
    lastErroredAt?: Date | null
  } = {}

  if (isOk) {
    counterUpdate = {
      consecutiveFailureCount: 0,
      firstErroredAt: null,
      lastErroredAt: null,
    }
  } else if (isError) {
    const current = await prisma.transcript.findUniqueOrThrow({
      where: { youtubeId },
      select: {
        auditStatus: true,
        consecutiveFailureCount: true,
        firstErroredAt: true,
      },
    })
    const wasAlreadyErrored = current.auditStatus.startsWith("error_")
    const now = new Date()
    counterUpdate = {
      consecutiveFailureCount: current.consecutiveFailureCount + 1,
      firstErroredAt: wasAlreadyErrored ? current.firstErroredAt : now,
      lastErroredAt: now,
    }
  }

  await prisma.transcript.update({
    where: { youtubeId },
    data: { auditStatus: newStatus, ...extraData, ...counterUpdate },
  })
}
