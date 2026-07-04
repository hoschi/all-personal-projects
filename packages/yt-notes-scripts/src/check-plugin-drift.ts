#!/usr/bin/env bun
import { Command } from "commander"
import { readFile, writeFile, appendFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

export const CRITICAL_FILES = [
  "src/utils/parser.ts",
  "src/utils/file.ts",
  "src/utils/templater.ts",
  "src/apis/youtube.ts",
  "src/types/",
  "LICENSE",
] as const

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASELINE_PATH = join(__dirname, "..", ".plugin-baseline.json")
const LOG_PATH = join(__dirname, "..", ".plugin-drift-log.md")
const UPSTREAM_REPO = "sundevista/youtube-template"

interface DriftClassification {
  critical: string[]
  cosmetic: string[]
}

export function parseChangedFiles(ghOutput: string): string[] {
  return ghOutput
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function classifyDrift(files: string[]): DriftClassification {
  const critical: string[] = []
  const cosmetic: string[] = []
  for (const f of files) {
    const isCritical = CRITICAL_FILES.some((c) =>
      c.endsWith("/") ? f.startsWith(c) : f === c,
    )
    if (isCritical) critical.push(f)
    else cosmetic.push(f)
  }
  return { critical, cosmetic }
}

async function fetchHeadSha(): Promise<string> {
  const { stdout } = await execAsync(
    `gh api repos/${UPSTREAM_REPO}/commits/master --jq .sha`,
  )
  return stdout.trim()
}

async function fetchChangedFiles(
  baseline: string,
  head: string,
): Promise<string[]> {
  const { stdout } = await execAsync(
    `gh api repos/${UPSTREAM_REPO}/compare/${baseline}...${head} --jq '.files[].filename'`,
  )
  return parseChangedFiles(stdout)
}

async function readBaseline(): Promise<string> {
  const raw = await readFile(BASELINE_PATH, "utf-8")
  const parsed = JSON.parse(raw) as { baselineSha: string }
  return parsed.baselineSha
}

async function writeBaseline(sha: string): Promise<void> {
  await writeFile(
    BASELINE_PATH,
    JSON.stringify({ baselineSha: sha }, null, 2) + "\n",
  )
}

async function appendLog(
  baseline: string,
  head: string,
  classification: DriftClassification,
  action: string,
): Promise<void> {
  const date = new Date().toISOString().slice(0, 10)
  const critFlag =
    classification.critical.length > 0
      ? `**Ja: ${classification.critical.join(", ")}**`
      : `Nein (${classification.cosmetic.length} kosmetisch)`
  const line = `| ${date} | ${baseline.slice(0, 7)} | ${head.slice(0, 7)} | ${critFlag} | ${action} | |\n`
  await appendFile(LOG_PATH, line)
}

async function main() {
  const program = new Command()
  program
    .option("--accept-baseline", "updated .plugin-baseline.json nach Review")
    .option("--show-diff", "öffnet GitHub-Compare-URL im Browser")
    .parse()
  const opts = program.opts()

  // gh-Auth-Check
  try {
    await execAsync("gh auth status")
  } catch {
    console.error(
      "check-plugin-drift: gh-Auth fehlt. Bitte `gh auth login` ausführen.",
    )
    process.exit(2)
  }

  const baseline = await readBaseline()
  const head = await fetchHeadSha()

  console.log(`Baseline-SHA: ${baseline}`)
  console.log(`Aktueller HEAD-SHA: ${head}`)

  if (baseline === head) {
    console.log("✓ Keine Drift — Baseline ist aktuell.")
    process.exit(0)
  }

  const changedFiles = await fetchChangedFiles(baseline, head)
  const classification = classifyDrift(changedFiles)

  console.log(`\nGeänderte Files (${changedFiles.length}):`)
  for (const f of changedFiles) {
    const marker = classification.critical.includes(f) ? "  🔴" : "  ⚪"
    console.log(`${marker} ${f}`)
  }

  const compareUrl = `https://github.com/${UPSTREAM_REPO}/compare/${baseline}...${head}`
  console.log(`\nCompare-URL: ${compareUrl}`)

  if (opts.showDiff) {
    await execAsync(`open ${compareUrl}`)
  }

  if (opts.acceptBaseline) {
    await writeBaseline(head)
    await appendLog(baseline, head, classification, "--accept-baseline")
    console.log(`\n✓ Baseline aktualisiert auf ${head.slice(0, 7)}.`)
    process.exit(0)
  }

  if (classification.critical.length > 0) {
    console.log(
      `\n⚠ ${classification.critical.length} kritische Files geändert. Bitte Compare-URL reviewen, ggf. Code in packages/yt-notes-scripts nachziehen, dann erneut mit --accept-baseline aufrufen.`,
    )
    await appendLog(baseline, head, classification, "Manual-Review pending")
    process.exit(1)
  }

  console.log(
    `\nNur kosmetische Drift (${classification.cosmetic.length} Files). Wenn OK: erneut mit --accept-baseline aufrufen.`,
  )
  await appendLog(baseline, head, classification, "Cosmetic — accept pending")
  process.exit(0)
}

if (import.meta.main) {
  try {
    await main()
  } catch (e) {
    console.error(
      `check-plugin-drift: unerwarteter Fehler — ${e instanceof Error ? e.message : e}`,
    )
    process.exit(3)
  }
}
