import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { z } from "zod"
import Debug from "debug"
import { prisma as ytPrisma } from "@repo/yt-notes-scripts/db"
import { prisma as sstPrisma } from "./prisma"
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { createStubFile } from "@repo/yt-notes-scripts/stub-creation"
import {
  enrichVideoCritical,
  enrichVideoBackground,
} from "@repo/yt-notes-scripts/enrich-pipeline"
import { findStubPath } from "@repo/yt-notes-scripts/stub-path-finder"
import { readFile, writeFile } from "node:fs/promises"
import { toTabSnapshot } from "./tab-sync-actions"
import { findH2Sections } from "@repo/yt-notes-scripts/markdown-parser"
import { commitFile } from "@repo/yt-notes-scripts/git-commit-helper"

const debugValidate = Debug("sst:yt:server:validate")
const debugBind = Debug("sst:yt:server:bind")

// CLI-Spawns für yt-notes-scripts brauchen Repo-Root als cwd, weil der
// Skript-Pfad Repo-Root-relativ ist; dev-cwd ist aber apps/sst/.
function findRepoRoot(): string {
  let dir = process.cwd()
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, "turbo.json"))) return dir
    dir = dirname(dir)
  }
  throw new Error("Repo-Root nicht gefunden (kein turbo.json)")
}
const REPO_ROOT = findRepoRoot()

const tabIdSchema = z.string().min(1)

export const validateYoutubeUrlFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      url: z.string().min(1),
      tabId: tabIdSchema,
    }),
  )
  .handler(async ({ data }) => {
    debugValidate("enter url=%s tabId=%s", data.url, data.tabId)
    // 1. URL parsen
    const youtubeId = parseVideoIdFromUrl(data.url)
    if (!youtubeId) {
      debugValidate("parse failed: not a youtube url")
      return { kind: "error" as const, message: "Keine gültige YouTube-URL." }
    }
    debugValidate("parsed youtubeId=%s", youtubeId)

    // 2. Tab-Mode-Check
    const tab = await sstPrisma.tab.findUniqueOrThrow({
      where: { id: data.tabId },
      select: { mode: true, youtubeId: true },
    })
    debugValidate("tab mode=%s youtubeId=%s", tab.mode, tab.youtubeId)
    if (tab.mode !== "work") {
      return { kind: "error" as const, message: "Tab ist nicht im Work-Modus." }
    }
    if (tab.youtubeId !== null) {
      return {
        kind: "error" as const,
        message: "Tab ist bereits an ein Video gebunden.",
      }
    }

    // 3. yt.video lookup (oder via YouTube Data API laden)
    let video = await ytPrisma.video.findUnique({
      where: { youtubeId },
      include: { channel: true, transcript: true },
    })
    debugValidate(
      "video lookup result=%s channelId=%s",
      video ? "found" : "not-found",
      video?.channelId ?? "(null)",
    )
    // Stub-Row-Fall: transcript-only Import hat yt.video angelegt, ohne Channel
    // und Metadaten — ohne Channel würde enrichVideoCritical sofort mit
    // skip_classification_mismatch abbrechen. Daher auch dann nach-fetchen.
    if (!video || !video.channelId) {
      try {
        await fetchAndPersistVideoDetails(youtubeId)
        video = await ytPrisma.video.findUniqueOrThrow({
          where: { youtubeId },
          include: { channel: true, transcript: true },
        })
        debugValidate(
          "video fetched + persisted channelId=%s",
          video.channelId ?? "(still-null)",
        )
      } catch (e) {
        debugValidate("video fetch error: %s", (e as Error).message)
        return {
          kind: "error" as const,
          message: `Konnte Video-Details nicht laden: ${(e as Error).message}`,
        }
      }
    }

    // 4. Channel-Klassifikations-Gate
    debugValidate(
      "channel classification=%s",
      video.channel?.classification ?? "(no-channel)",
    )
    if (video.channel?.classification === "privat") {
      return {
        kind: "error" as const,
        message:
          "Channel ist privat klassifiziert. Inhalte gehören nicht in die KB.",
      }
    }
    if (video.channel?.classification === "unknown") {
      await ytPrisma.channel.update({
        where: { id: video.channel.id },
        data: { classification: "arbeit" },
      })
    }

    // 5. Video-Dauer
    if (video.durationSec && video.durationSec > 2700) {
      debugValidate("rejected: duration=%d > 2700", video.durationSec)
      return {
        kind: "error" as const,
        message: "Video ist länger als 45 Minuten — nicht unterstützt.",
      }
    }

    // 6. Transcript-Probe
    if (!video.transcript?.plain) {
      try {
        debugValidate("transcript missing, probing…")
        await probeAndPersistTranscript(youtubeId)
      } catch (e) {
        debugValidate("transcript probe error: %s", (e as Error).message)
        return {
          kind: "error" as const,
          message: `Untertitel konnten nicht geladen werden: ${(e as Error).message}`,
        }
      }
    }

    const transcript = await ytPrisma.transcript.findUnique({
      where: { youtubeId },
    })
    debugValidate(
      "transcript auditStatus=%s plainLen=%d",
      transcript?.auditStatus ?? "(none)",
      transcript?.plain?.length ?? 0,
    )

    // 7. Reuse-Check
    if (
      transcript &&
      (transcript.auditStatus === "ok" ||
        transcript.auditStatus === "critical_ok")
    ) {
      debugValidate("=> reusable youtubeId=%s", youtubeId)
      return {
        kind: "reusable" as const,
        video: {
          youtubeId,
          displayTitle: video.displayTitle ?? video.title,
          channelName: video.channel?.name ?? "Unknown",
        },
      }
    }

    debugValidate("=> ready_for_enrichment youtubeId=%s", youtubeId)
    return {
      kind: "ready_for_enrichment" as const,
      video: {
        youtubeId,
        channelName: video.channel?.name ?? "Unknown",
      },
    }
  })

// URL-Parser — inline OR import aus packages/yt-notes-scripts/utils/parser.ts (wenn dort als Public-Export verfügbar)
function parseVideoIdFromUrl(url: string): string | null {
  const patterns = [
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = re.exec(url)
    if (m) return m[1] ?? null
  }
  return null
}

// get_video_details.ts nutzt Subcommand-Syntax: `fetch <videoId>` (kein --id Flag)
async function fetchAndPersistVideoDetails(youtubeId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "bun",
      [
        "run",
        "packages/yt-notes-scripts/src/get_video_details.ts",
        "fetch",
        youtubeId,
      ],
      { cwd: REPO_ROOT, stdio: "pipe" },
    )
    let stderr = ""
    proc.stderr.on("data", (b) => {
      stderr += b.toString()
    })
    proc.on("close", (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr || `get_video_details exit ${code}`))
    })
  })
}

// import_youtube_transcript.ts nutzt --video-id (kein --id Flag)
async function probeAndPersistTranscript(youtubeId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "bun",
      [
        "run",
        "packages/yt-notes-scripts/src/import_youtube_transcript.ts",
        "--video-id",
        youtubeId,
      ],
      { cwd: REPO_ROOT, stdio: "pipe" },
    )
    let stderr = ""
    proc.stderr.on("data", (b) => {
      stderr += b.toString()
    })
    proc.on("close", (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr || `import_youtube_transcript exit ${code}`))
    })
  })
}

// stubPathFor — Wrapper um findStubPath aus dem yt-Workspace,
// injiziert den lokalen ytPrisma-Client.
// createServerOnlyFn: hält die Modul-Scope-Referenz auf ytPrisma innerhalb
// einer vom Start-Compiler erkannten Server-Boundary. Ohne den Wrapper würde
// der Prisma-Client (→ @prisma/client-Runtime mit node:*-Builtins) ins
// Client-Bundle gezogen und der Vite-Build brechen. Siehe TanStack-Start
// "Import Protection" (Common Pitfall: Why Some Imports Stay Alive).
const stubPathFor = createServerOnlyFn((youtubeId: string) =>
  findStubPath(ytPrisma, youtubeId),
)

export const bindYoutubeToTabFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tabId: tabIdSchema,
      youtubeId: z.string().min(11).max(11),
      reuse: z.boolean(),
      clientId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    debugBind(
      "enter tabId=%s youtubeId=%s reuse=%s",
      data.tabId,
      data.youtubeId,
      data.reuse,
    )
    // 1. Tab + Video laden
    const tab = await sstPrisma.tab.findUniqueOrThrow({
      where: { id: data.tabId },
      select: { id: true, mode: true, youtubeId: true, titleVersion: true },
    })
    debugBind("tab loaded mode=%s currentYoutubeId=%s", tab.mode, tab.youtubeId)
    if (tab.mode !== "work" || tab.youtubeId !== null) {
      debugBind("guard reject: not in work-mode or already bound")
      throw new Error("Tab ist nicht im Work-Modus oder schon gebunden.")
    }

    const video = await ytPrisma.video.findUniqueOrThrow({
      where: { youtubeId: data.youtubeId },
      include: { channel: true, transcript: true },
    })
    debugBind(
      "video loaded title=%j channel=%s",
      video.title,
      video.channel?.name ?? "(none)",
    )

    const sharedVaultPath = process.env.SHARED_VAULT_PATH
    const templatePath = process.env.YT_TEMPLATE_PATH
    if (!sharedVaultPath || !templatePath) {
      debugBind("env missing: SHARED_VAULT_PATH or YT_TEMPLATE_PATH")
      throw new Error(
        "SHARED_VAULT_PATH + YT_TEMPLATE_PATH müssen gesetzt sein.",
      )
    }

    // 2. Stub-Datei anlegen (idempotent)
    try {
      await createStubFile({
        prisma: ytPrisma,
        video: {
          youtubeId: data.youtubeId,
          title: video.title,
          channel: { name: video.channel?.name ?? "Unknown" },
          publishedAt: video.publishedAt, // Task-7-Fix: required for publish_date frontmatter
        },
        vaultRoot: sharedVaultPath,
        vaultName: "stefans-vault/shared",
        templatePath,
      })
      debugBind("createStubFile ok")
    } catch (e) {
      debugBind("createStubFile threw: %s", (e as Error).message)
      throw e
    }

    // 3. Reuse-Pfad: kein Enrich-Lauf
    if (data.reuse) {
      const displayTitle = video.displayTitle ?? video.title
      const updatedTab = await sstPrisma.tab.update({
        where: { id: data.tabId },
        data: {
          youtubeId: data.youtubeId,
          youtubeReused: true,
          title: `reused: ${displayTitle}`,
          titleVersion: { increment: 1 },
          titleUpdatedAt: new Date(),
        },
      })
      debugBind(
        "reuse-path tab updated id=%s youtubeId=%s title=%j titleVersion=%d",
        updatedTab.id,
        updatedTab.youtubeId,
        updatedTab.title,
        updatedTab.titleVersion,
      )
      return {
        kind: "ok" as const,
        tab: { ...toTabSnapshot(updatedTab), ytDisplayTitle: displayTitle },
      }
    }

    // 4. Fresh-Enrich: Critical-Phase synchron
    const run = await ytPrisma.enrichRun.create({
      data: { trigger: "sst-binding", classification: "arbeit" },
    })
    debugBind("fresh-enrich enrichRun created id=%s", run.id)
    const criticalResult = await enrichVideoCritical({
      prisma: ytPrisma,
      youtubeId: data.youtubeId,
      classification: "arbeit",
      runId: run.id,
      stubPath: stubPathFor,
      bypassClassificationCheck: video.channel?.classification === "mixed",
    })
    debugBind("critical result status=%s", criticalResult.status)

    if (criticalResult.status !== "critical_ok") {
      debugBind("critical not ok, returning error")
      return {
        kind: "error" as const,
        criticalStatus: criticalResult.status,
        message: `Enrichment fehlgeschlagen: ${criticalResult.status}. Details: bun run packages/yt-notes-scripts/src/enrich-status.ts --errors`,
      }
    }

    // 5. Tab updaten — Tab-Titel auf voller Länge; UI kürzt visuell per CSS.
    const displayTitle =
      criticalResult.displayTitle ?? video.displayTitle ?? video.title
    const updatedTab = await sstPrisma.tab.update({
      where: { id: data.tabId },
      data: {
        youtubeId: data.youtubeId,
        youtubeReused: false,
        title: displayTitle,
        titleVersion: { increment: 1 },
        titleUpdatedAt: new Date(),
      },
    })
    debugBind(
      "fresh-path tab updated id=%s youtubeId=%s title=%j",
      updatedTab.id,
      updatedTab.youtubeId,
      updatedTab.title,
    )

    // 6. Background-Phase im Hintergrund (kein await)
    void enrichVideoBackground({
      prisma: ytPrisma,
      youtubeId: data.youtubeId,
      classification: "arbeit",
      runId: run.id,
      stubPath: stubPathFor,
      bypassClassificationCheck: video.channel?.classification === "mixed",
    }).catch((err) => {
      console.error(`[sst-yt-background] ${data.youtubeId}: ${err}`)
    })

    return {
      kind: "ok" as const,
      tab: { ...toTabSnapshot(updatedTab), ytDisplayTitle: displayTitle },
    }
  })

export function appendToNotizenSection(md: string, noteText: string): string {
  // Split Frontmatter + Body
  const fmMatch = /^---\n[\s\S]*?\n---\n/.exec(md)
  const fmRaw = fmMatch?.[0] ?? ""
  const body = md.slice(fmRaw.length)

  const sections = findH2Sections(body)
  const notizen = sections.find((s) => s.heading === "Notizen")
  const noteLine = `\n${noteText.trim()}\n`

  if (notizen) {
    // Pass-5-Layout schreibt einen `---`-Trenner zwischen Notizen-Content und
    // nächster H2 (stub-md-updater.ts:97). Der Trenner liegt im
    // `body.slice(0, notizen.end)`-Bereich, weil `findH2Sections` die Sektion
    // bis zur nächsten H2 ausdehnt. Trenner ausklammern, Note einfügen,
    // Trenner wieder anhängen — sonst landet die Note hinter dem `---`.
    const rawBefore = body.slice(0, notizen.end)
    const trennerMatch = /\n+---[ \t]*\n*$/.exec(rawBefore)
    if (trennerMatch) {
      const before = rawBefore.slice(0, trennerMatch.index).replace(/\n+$/, "")
      const after = body.slice(notizen.end)
      return `${fmRaw}${before}${noteLine}\n---\n\n${after}`
    }
    const before = rawBefore.replace(/\n+$/, "")
    const after = body.slice(notizen.end)
    return `${fmRaw}${before}${noteLine}\n${after}`
  }

  // Notizen-Sektion existiert nicht → ans Ende anfügen
  const trimmedBody = body.replace(/\n+$/, "")
  return `${fmRaw}${trimmedBody}\n\n## Notizen\n${noteLine}`
}

export const pushNoteAndDeleteTabFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tabId: tabIdSchema,
      noteText: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const tab = await sstPrisma.tab.findUniqueOrThrow({
      where: { id: data.tabId },
      select: { id: true, youtubeId: true },
    })
    if (!tab.youtubeId) {
      throw new Error("Tab ist nicht an ein YT-Video gebunden.")
    }

    const stub = await stubPathFor(tab.youtubeId)
    if (!stub) {
      throw new Error(
        "Stub-MD nicht gefunden — wurde die Datei manuell gelöscht?",
      )
    }

    const mdContent = await readFile(stub.absPath, "utf-8")
    const appendedMd = appendToNotizenSection(mdContent, data.noteText)
    await writeFile(stub.absPath, appendedMd, "utf-8")
    await commitFile(
      stub.vaultRoot,
      stub.relPath,
      `sst-note: ${tab.youtubeId} — append note`,
    )

    await sstPrisma.tab.delete({ where: { id: data.tabId } })
    return { status: "deleted" as const, tabId: data.tabId }
  })
