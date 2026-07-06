import * as fs from "fs/promises"
import * as path from "path"
import { Command } from "commander"
import { prisma } from "./db"
import { parseVideoId } from "./utils/parser"

const isYouTubeUrl = (url: string): boolean =>
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)

const extractFirstH1 = (md: string): string | undefined =>
  (md.match(/^# (.+)$/m) ?? [])[1]

const findAllMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name)
      if (entry.isDirectory()) return findAllMarkdownFiles(res)
      return res.endsWith(".md") ? [res] : []
    }),
  )
  return nested.flat()
}

const extractLinks = (md: string): Array<{ label: string; url: string }> => {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const result: Array<{ label: string; url: string }> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(md))) result.push({ label: m[1], url: m[2] })
  return result
}

export interface RunImportOpts {
  dryRun?: boolean
}

export interface RunImportResult {
  vault: string
  rootPath: string
  scannedFiles: number
  candidates: number
  nonYoutube: number
  unparsable: number
  inserted: number
  duplicates: number
  dryRun: boolean
}

export const runImportForVault = async (
  vaultName: string,
  opts: RunImportOpts = {},
): Promise<RunImportResult> => {
  const vault = await prisma.vault.findUnique({ where: { name: vaultName } })
  if (!vault) {
    throw new Error(
      `Vault '${vaultName}' not configured in yt.vault. See --help for the seed INSERT.`,
    )
  }
  const folder = vault.rootPath
  console.log(`vault: ${vaultName} → ${folder}`)
  const files = await findAllMarkdownFiles(folder)
  console.log(`scanned: ${files.length} markdown files`)
  let nonYoutube = 0
  let unparsable = 0
  const candidates: Array<{
    youtubeId: string
    title: string | null
    filePath: string
  }> = []

  for (const file of files) {
    const content = await fs.readFile(file, "utf8")
    const title = extractFirstH1(content) ?? null
    const links = extractLinks(content).filter((l) => l.label === "URL")
    for (const link of links) {
      if (!isYouTubeUrl(link.url)) {
        nonYoutube++
        console.warn(`[non-youtube] ${file}: ${link.url}`)
        continue
      }
      const youtubeId = parseVideoId(link.url)
      if (!youtubeId) {
        unparsable++
        console.warn(`[no-id] ${file}: ${link.url}`)
        continue
      }
      candidates.push({
        youtubeId,
        title,
        filePath: path.relative(folder, file),
      })
    }
  }

  console.log(`=== Summary (${vaultName}) ===`)
  console.log(`candidates: ${candidates.length}`)
  console.log(`non_youtube: ${nonYoutube}`)
  console.log(`unparsable:  ${unparsable}`)

  if (opts.dryRun) {
    console.log(`\n[dry-run] no writes performed`)
    return {
      vault: vaultName,
      rootPath: folder,
      scannedFiles: files.length,
      candidates: candidates.length,
      nonYoutube,
      unparsable,
      inserted: 0,
      duplicates: 0,
      dryRun: true,
    }
  }

  // Ensure video stubs exist (FK constraint)
  const uniqueIds = Array.from(new Set(candidates.map((c) => c.youtubeId)))
  for (const id of uniqueIds) {
    await prisma.video.upsert({
      where: { youtubeId: id },
      update: {},
      create: { youtubeId: id, title: "" },
    })
  }

  const result = await prisma.noteLink.createMany({
    data: candidates.map((c) => ({
      youtubeId: c.youtubeId,
      title: c.title,
      filePath: c.filePath,
      vault: vaultName,
    })),
    skipDuplicates: true,
  })

  console.log(`\ninserted:   ${result.count}`)
  console.log(`duplicates: ${candidates.length - result.count}`)
  return {
    vault: vaultName,
    rootPath: folder,
    scannedFiles: files.length,
    candidates: candidates.length,
    nonYoutube,
    unparsable,
    inserted: result.count,
    duplicates: candidates.length - result.count,
    dryRun: false,
  }
}

const program = new Command()
  .name("import_youtube_note_links")
  .description(
    "Scans the configured Markdown root of a vault for YouTube URL links and imports them into yt.note_link. Vault root paths are stored in yt.vault — see --help for seed.",
  )
  .requiredOption(
    "--vault <name>",
    "Vault identifier. Must be present in yt.vault; the script reads root_path from there.",
  )
  .option("--dry-run", "Scan + count, no DB writes", false)
  .addHelpText(
    "after",
    `
Environment:
  DATABASE_URL          Postgres connection string
  DATABASE_SCHEMA_NAME  Must be "yt"

Vault configuration:
  Vault root paths live in yt.vault (name PK, root_path). Seed once via psql:

    INSERT INTO yt.vault (name, root_path) VALUES
      ('shared',              '/path/to/shared/vault'),
      ('<your-kb-vault-name>', '/path/to/your/knowledge-base')
    ON CONFLICT (name) DO UPDATE SET root_path = EXCLUDED.root_path;

Examples:
  bun run src/import_youtube_note_links.ts --vault shared
  bun run src/import_youtube_note_links.ts --vault <your-kb-vault-name> --dry-run

Exit codes:
  0  success
  1  input error (vault not in yt.vault, root_path unreadable)
  2  DB connection error
  3  validation error
`,
  )
  .action(async (opts: { vault: string; dryRun: boolean }) => {
    try {
      await runImportForVault(opts.vault, { dryRun: opts.dryRun })
    } catch (e) {
      console.error((e as Error).message)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  })

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
