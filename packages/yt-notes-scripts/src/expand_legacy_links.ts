import * as path from "path"
import { Command } from "commander"
import { prisma } from "./db"
import { runImportForVault } from "./import_youtube_note_links"
import {
  fetchVideo,
  writeVideo,
  fetchChannel,
  writeChannelStats,
} from "./get_video_details"
import { createStubFile } from "./stub-creation"

const DEFAULT_TEMPLATE_PATH = path.join(
  process.env.HOME ?? "",
  "Library/CloudStorage/Dropbox/obsidian-test/test/yt-template.md",
)

interface Summary {
  scannedLinks: number
  skippedAlreadyStub: number
  createdStubs: number
  filenameConflicts: number
  apiFetches: number
  errors: number
}

const program = new Command()
  .name("expand_legacy_links")
  .description(
    "Expands YouTube legacy links (mentioned in normal notes) into dedicated stub articles in the plugin default output folder. Format matches sundevista/youtube-template via the shared template file.",
  )
  .option("--dry-run", "List counts + sample paths, write nothing", false)
  .option("--limit <n>", "Process only first N legacy links", (v) =>
    Number.parseInt(v, 10),
  )
  .option(
    "--vault <name>",
    "Restrict to one vault (default: all yt.vault entries)",
  )
  .option(
    "--skip-scan",
    "Skip the import_youtube_note_links pre-pass (use stale DB state)",
    false,
  )
  .option(
    "--template <path>",
    "Override template file path",
    DEFAULT_TEMPLATE_PATH,
  )
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL               Postgres connection string
  YOUTUBE_API_KEY            YouTube Data API v3 key (lazy fetch for missing details)

Examples:
  bun run src/expand_legacy_links.ts --dry-run
  bun run src/expand_legacy_links.ts --limit 5
  bun run src/expand_legacy_links.ts --vault <your-kb-vault-name> --dry-run

Exit codes:
  0  success
  1  input error (template missing, vault not found)
  2  DB error
  3  API error (lazy fetch failed)
`,
  )
  .action(
    async (opts: {
      dryRun: boolean
      limit?: number
      vault?: string
      skipScan: boolean
      template: string
    }) => {
      try {
        const summary = await run(opts)
        printSummary(summary)
      } catch (e) {
        console.error((e as Error).message)
        const code = (e as { exitCode?: number }).exitCode ?? 2
        process.exit(code)
      } finally {
        await prisma.$disconnect()
      }
    },
  )

const run = async (opts: {
  dryRun: boolean
  limit?: number
  vault?: string
  skipScan: boolean
  template: string
}): Promise<Summary> => {
  // Sanity-Check: Template existiert. Vaults werden im Pre-Pass + Link-Schleife
  // pro Eintrag via FK validiert — kein hartkodierter Default-Vault mehr.
  // (createStubFile liest das Template intern; hier nur Vorprüfung.)
  const { access } = await import("fs/promises")
  await access(opts.template)

  // Pre-Pass: import_youtube_note_links pro Vault (Hybrid-Strategie)
  if (!opts.skipScan) {
    const vaults = opts.vault
      ? [await prisma.vault.findUnique({ where: { name: opts.vault } })]
      : await prisma.vault.findMany({ orderBy: { name: "asc" } })
    for (const v of vaults) {
      if (!v) {
        throw Object.assign(
          new Error(`Vault '${opts.vault}' not in yt.vault.`),
          { exitCode: 1 },
        )
      }
      try {
        await runImportForVault(v.name, { dryRun: opts.dryRun })
      } catch (e) {
        console.warn(`[skip-vault] ${v.name}: ${(e as Error).message}`)
      }
    }
  }

  // Selektion: alle Note-Links, die nicht selbst Stub-Artikel sind
  const allLinks = await prisma.noteLink.findMany({
    where: opts.vault ? { vault: opts.vault } : undefined,
    include: { vaultRef: true, video: { include: { channel: true } } },
    orderBy: { id: "asc" },
  })
  // Stubs ausschließen (file_path beginnt mit "youtube/" gemäß filePath-
  // Konsolidierungs-Migration 20260607115258).
  const candidates = allLinks.filter(
    (link) => !link.filePath.startsWith("youtube/"),
  )

  console.log(`\nBestandslinks (candidates) pro Vault:`)
  const grouped = new Map<string, typeof candidates>()
  for (const c of candidates) {
    const arr = grouped.get(c.vault) ?? []
    arr.push(c)
    grouped.set(c.vault, arr)
  }
  for (const [vault, arr] of grouped) {
    const sample = arr.slice(0, 3).map((c) => c.filePath)
    console.log(`  ${vault}: ${arr.length}`)
    for (const s of sample) console.log(`    sample: ${s}`)
  }

  // Frühe Beendigung bei --dry-run
  if (opts.dryRun) {
    return {
      scannedLinks: candidates.length,
      skippedAlreadyStub: allLinks.length - candidates.length,
      createdStubs: 0,
      filenameConflicts: 0,
      apiFetches: 0,
      errors: 0,
    }
  }

  const trimmed = opts.limit ? candidates.slice(0, opts.limit) : candidates

  let createdStubs = 0
  let apiFetches = 0
  let errors = 0

  for (const link of trimmed) {
    try {
      let video = link.video
      let channel = video.channel

      // Lazy API-Fetch wenn Details fehlen
      if (!video.title || !channel) {
        apiFetches++
        const apiItem = await fetchVideo(link.youtubeId)
        await writeVideo(apiItem)
        // Re-Lookup für aktualisierten Stand
        const refreshed = await prisma.video.findUnique({
          where: { youtubeId: link.youtubeId },
          include: { channel: true },
        })
        if (!refreshed) throw new Error(`Refresh failed: ${link.youtubeId}`)
        video = refreshed
        channel = refreshed.channel
      }

      if (!channel) {
        console.warn(`[no-channel] ${link.youtubeId} — skipping stub creation`)
        errors++
        continue
      }

      // Optional: Subscribers nachladen falls leer
      if (channel.subscribers === null) {
        try {
          const stats = await fetchChannel(channel.id)
          await writeChannelStats(stats)
          channel = {
            ...channel,
            subscribers: stats.subscribers,
            name: stats.name ?? channel.name,
          }
          apiFetches++
        } catch (e) {
          console.warn(
            `[no-channel-stats] ${channel.id}: ${(e as Error).message}`,
          )
        }
      }

      // Source-Vault-Routing (R12 korrigiert 2026-06-04): Stub landet in dem
      // Vault, in dem die Quell-Notiz liegt — nicht hartkodiert in shared.
      const targetVaultName = link.vault
      const targetRoot = link.vaultRef.rootPath

      const stub = await createStubFile({
        prisma,
        video: {
          youtubeId: video.youtubeId,
          title: video.title,
          channel: { name: channel.name },
          publishedAt: video.publishedAt,
        },
        vaultRoot: targetRoot,
        vaultName: targetVaultName,
        templatePath: opts.template,
      })
      console.log(`Created stub: ${stub.relPath}`)

      createdStubs++
    } catch (e) {
      errors++
      console.error(`[error] ${link.youtubeId}: ${(e as Error).message}`)
    }
  }

  return {
    scannedLinks: candidates.length,
    skippedAlreadyStub: allLinks.length - candidates.length,
    createdStubs,
    filenameConflicts: 0,
    apiFetches,
    errors,
  }
}

const printSummary = (s: Summary) => {
  console.log(`\n=== Summary ===`)
  console.log(`scanned links:          ${s.scannedLinks}`)
  console.log(`skipped (already stub): ${s.skippedAlreadyStub}`)
  console.log(`created stubs:          ${s.createdStubs}`)
  console.log(`filename conflicts:     ${s.filenameConflicts}`)
  console.log(`api fetches:            ${s.apiFetches}`)
  console.log(`errors:                 ${s.errors}`)
}

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
