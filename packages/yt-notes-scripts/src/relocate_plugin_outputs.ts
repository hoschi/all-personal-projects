import { Command } from "commander"
import { prisma, USER_KB_VAULT_NAME } from "./db"
import { planMove, type PlanResult } from "./utils/relocator-planner"
import * as fs from "fs"
import { execFileSync } from "child_process"
import { confirm } from "@inquirer/prompts"
import * as path from "path"
import {
  findUrlsToStub,
  applyPatches,
  type Patch,
} from "./utils/obsidian-url-patcher"

const REQUIRED_VAULTS = [
  "stefans-vault/shared",
  "stefans-vault/private",
  USER_KB_VAULT_NAME,
] as const

const requireEnv = (name: string): string => {
  const v = process.env[name]
  if (!v || v.trim() === "") {
    console.error(`[sanity] FAIL: env var ${name} is missing or empty`)
    process.exit(1)
  }
  return v
}

const runSanity = async (): Promise<{
  sharedVaultName: string
  userKbVaultPath: string
  vaultRoots: Map<string, string>
}> => {
  const sharedVaultName = requireEnv("SHARED_VAULT_NAME")
  const userKbVaultPath = requireEnv("USER_KB_VAULT_PATH")

  if (!fs.existsSync(userKbVaultPath)) {
    console.error(
      `[sanity] FAIL: USER_KB_VAULT_PATH does not exist: ${userKbVaultPath}`,
    )
    process.exit(1)
  }

  const vaults = await prisma.vault.findMany({
    where: { name: { in: [...REQUIRED_VAULTS] } },
    select: { name: true, rootPath: true },
  })
  const found = new Set(vaults.map((v) => v.name))
  for (const required of REQUIRED_VAULTS) {
    if (!found.has(required)) {
      console.error(`[sanity] FAIL: yt.vault row '${required}' missing`)
      process.exit(1)
    }
  }
  const vaultRoots = new Map(vaults.map((v) => [v.name, v.rootPath]))
  for (const [name, root] of vaultRoots.entries()) {
    if (!fs.existsSync(root)) {
      console.error(
        `[sanity] FAIL: vault '${name}' root_path does not exist: ${root}`,
      )
      process.exit(1)
    }
  }

  // obsidian CLI Smoke
  try {
    execFileSync(
      "obsidian",
      [`vault=${sharedVaultName}`, "search", "query=youtube", "limit=1"],
      { stdio: "pipe" },
    )
  } catch {
    console.error(
      `[sanity] FAIL: obsidian CLI not reachable (vault '${sharedVaultName}'). ` +
        `Aborting per CLAUDE.md HITL-Protokoll.`,
    )
    process.exit(3)
  }

  return { sharedVaultName, userKbVaultPath, vaultRoots }
}

type MoveCandidate = {
  noteLinkId: bigint
  youtubeId: string
  channelId: string
  channelName: string
  classification: string
  sourceVault: string
  targetVault: string
  reason: "plugin-output-to-private" | "reverse-reclassification"
  vaultRelativePath: string // z.B. 'youtube/<channel>/<title>.md'
}

const USER_KB_SKIP_DIRS = new Set(["raw", ".obsidian", ".git", "node_modules"])

const walkMarkdownFiles = function* (root: string): Generator<string> {
  const stack: string[] = [root]
  while (stack.length > 0) {
    const dir = stack.pop()!
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith(".") || USER_KB_SKIP_DIRS.has(entry.name))
          continue
        stack.push(full)
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        yield full
      }
    }
  }
}

type UserKbPatchSet = {
  filePath: string // absoluter Pfad im User-KB-Vault
  patches: Patch[]
}

const scanUserKbForCandidate = (
  userKbVaultPath: string,
  sharedVaultName: string,
  candidate: MoveCandidate,
): UserKbPatchSet[] => {
  const sourceRoot =
    candidate.sourceVault === "stefans-vault/shared" ? "shared" : "private"
  const targetRoot =
    candidate.targetVault === "stefans-vault/shared" ? "shared" : "private"
  const sets: UserKbPatchSet[] = []
  for (const filePath of walkMarkdownFiles(userKbVaultPath)) {
    let content: string
    try {
      content = fs.readFileSync(filePath, "utf-8")
    } catch {
      continue
    }
    const patches = findUrlsToStub(
      content,
      candidate.vaultRelativePath,
      sharedVaultName,
      sourceRoot,
      targetRoot,
    )
    if (patches.length > 0) {
      sets.push({ filePath, patches })
    }
  }
  return sets
}

const runPlan = async (opts: {
  limit?: number
  include?: string
}): Promise<MoveCandidate[]> => {
  const includeNames = opts.include
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const rows = await prisma.noteLink.findMany({
    where: {
      AND: [
        { filePath: { startsWith: "youtube/" } },
        {
          OR: [
            { vault: "stefans-vault/shared" },
            { vault: "stefans-vault/private" },
          ],
        },
        {
          video: {
            channel: {
              classification: { in: ["privat", "arbeit"] },
              ...(includeNames?.length ? { name: { in: includeNames } } : {}),
            },
          },
        },
      ],
    },
    select: {
      id: true,
      youtubeId: true,
      vault: true,
      filePath: true,
      video: {
        select: {
          channel: {
            select: { id: true, name: true, classification: true },
          },
        },
      },
    },
    orderBy: [{ video: { channel: { name: "asc" } } }, { filePath: "asc" }],
    take: opts.limit,
  })

  const candidates: MoveCandidate[] = []
  for (const r of rows) {
    if (!r.video.channel) continue
    const result: PlanResult = planMove(r.vault, r.video.channel.classification)
    if (!result) continue // mixed/null/already-correct
    candidates.push({
      noteLinkId: r.id,
      youtubeId: r.youtubeId,
      channelId: r.video.channel.id,
      channelName: r.video.channel.name,
      classification: r.video.channel.classification!,
      sourceVault: r.vault,
      targetVault: result.targetVault,
      reason: result.reason,
      vaultRelativePath: r.filePath,
    })
  }
  return candidates
}

const printDryRunReport = (
  candidates: MoveCandidate[],
  userKbPatches: Map<bigint, UserKbPatchSet[]>,
): void => {
  console.log("\n=== Move Plan ===")
  if (candidates.length === 0) {
    console.log("(no candidates)")
  }
  candidates.forEach((c, i) => {
    console.log(
      `[${i + 1}] ${c.classification} (${c.reason}): ${c.channelName} (${c.channelId})`,
    )
    console.log(`    ${c.sourceVault} → ${c.targetVault}`)
    console.log(`    ${c.vaultRelativePath}`)
  })

  console.log("\n=== User-KB URL Patches ===")
  let articleCount = 0
  let urlCount = 0
  for (const c of candidates) {
    const sets = userKbPatches.get(c.noteLinkId) ?? []
    for (const set of sets) {
      articleCount++
      urlCount += set.patches.length
      // relativen KB-Pfad anzeigen
      const relPath = path.relative(
        process.env.USER_KB_VAULT_PATH!,
        set.filePath,
      )
      console.log(`[${articleCount}] ${relPath}`)
      for (const p of set.patches) {
        console.log(`    - ${p.oldUrl}`)
        console.log(`    + ${p.newUrl}`)
      }
    }
  }
  if (articleCount === 0) {
    console.log("(no user-KB articles affected)")
  }

  const shared2priv = candidates.filter(
    (c) => c.reason === "plugin-output-to-private",
  ).length
  const priv2shared = candidates.filter(
    (c) => c.reason === "reverse-reclassification",
  ).length
  console.log("\n=== Summary ===")
  console.log(`moves planned:    ${candidates.length}`)
  console.log(`  shared → private:  ${shared2priv}`)
  console.log(`  private → shared:  ${priv2shared}`)
  console.log(
    `user-KB patches: ${urlCount} (across ${articleCount} article(s))`,
  )
  console.log(`silent-skipped:   (mixed/null/already-correct — not shown)`)
}

type LiveSummary = {
  movesExecuted: number
  shared2priv: number
  priv2shared: number
  userKbPatchedArticles: number
  userKbPatchedUrls: number
  errors: number
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const updateDbVaultWithRetry = async (
  noteLinkId: bigint,
  targetVault: string,
): Promise<void> => {
  const delays = [100, 500, 2000]
  let lastErr: unknown
  for (let attempt = 0; attempt < delays.length; attempt++) {
    try {
      await prisma.noteLink.update({
        where: { id: noteLinkId },
        data: { vault: targetVault },
      })
      return
    } catch (err) {
      lastErr = err
      await sleep(delays[attempt])
    }
  }
  // Total fail — Hard-Abort mit Repair-Anweisung (R19)
  console.error(
    `\nFATAL: Move done, DB update failed after ${delays.length} retries.\n` +
      `Repair manually:\n` +
      `  psql $DATABASE_URL -c "UPDATE yt.note_link SET vault='${targetVault}' WHERE id=${noteLinkId}"\n`,
  )
  console.error("Last error:", lastErr)
  process.exit(4)
}

const runLive = async (
  ctx: {
    sharedVaultName: string
    userKbVaultPath: string
    vaultRoots: Map<string, string>
  },
  candidates: MoveCandidate[],
  userKbPatches: Map<bigint, UserKbPatchSet[]>,
): Promise<LiveSummary> => {
  const summary: LiveSummary = {
    movesExecuted: 0,
    shared2priv: 0,
    priv2shared: 0,
    userKbPatchedArticles: 0,
    userKbPatchedUrls: 0,
    errors: 0,
  }

  for (const c of candidates) {
    const sourceRoot =
      c.sourceVault === "stefans-vault/shared" ? "shared" : "private"
    const targetRoot =
      c.targetVault === "stefans-vault/shared" ? "shared" : "private"
    const sourceVaultRelative = `${sourceRoot}/${c.vaultRelativePath}`
    const targetVaultRelative = `${targetRoot}/${c.vaultRelativePath}`

    // Ziel-Pfad-Konflikt (z.B. paralleler Plugin-Output am Target)
    const targetVaultRootPath = ctx.vaultRoots.get(c.targetVault)
    if (!targetVaultRootPath) {
      console.error(
        `[live] internal error: missing root_path for ${c.targetVault}`,
      )
      summary.errors++
      continue
    }
    const targetAbsolutePath = path.join(
      targetVaultRootPath,
      c.vaultRelativePath,
    )
    if (fs.existsSync(targetAbsolutePath)) {
      console.error(
        `[live] target already exists, skipping: ${targetAbsolutePath}`,
      )
      summary.errors++
      continue
    }

    const sets = userKbPatches.get(c.noteLinkId) ?? []

    // 1. User-KB-Patches schreiben
    let userKbWriteFailed = false
    for (const set of sets) {
      try {
        const original = fs.readFileSync(set.filePath, "utf-8")
        const patched = applyPatches(original, set.patches)
        fs.writeFileSync(set.filePath, patched, "utf-8")
        summary.userKbPatchedArticles++
        summary.userKbPatchedUrls += set.patches.length
      } catch (err) {
        console.error(
          `[live] user-KB write failed for ${set.filePath}: ${(err as Error).message} — skipping candidate`,
        )
        userKbWriteFailed = true
        summary.errors++
        break
      }
    }
    if (userKbWriteFailed) continue

    // 2. obsidian move (innerhalb stefans-vault, vault=SHARED_VAULT_NAME, sub-folder switch)
    // obsidian CLI's move calls fs.rename internally and does not mkdir -p the target folder
    const targetAbsDir = path.dirname(
      path.join(targetVaultRootPath, c.vaultRelativePath),
    )
    fs.mkdirSync(targetAbsDir, { recursive: true })
    const obsidianArgs = [
      `vault=${ctx.sharedVaultName}`,
      "move",
      `path=${sourceVaultRelative}`,
      `to=${targetVaultRelative}`,
    ]
    try {
      execFileSync("obsidian", obsidianArgs, { stdio: "pipe" })
    } catch (err) {
      console.error(
        `\nFATAL: obsidian move failed for ${sourceVaultRelative} → ${targetVaultRelative}.\n` +
          `User-KB patches already written (${sets.length} article(s)).\n` +
          `Manual cleanup required:\n` +
          `  1. Inspect user-KB diffs (git diff in your KB repo)\n` +
          `  2. Either re-run move manually OR revert user-KB patches\n`,
      )
      console.error("Error:", (err as Error).message)
      process.exit(3)
    }

    // Defensive post-move verify: obsidian CLI returns exit 0 even on errors.
    // Verify the target file physically exists at the expected absolute path.
    const expectedTargetAbsPath = path.join(
      targetVaultRootPath,
      c.vaultRelativePath,
    )
    if (!fs.existsSync(expectedTargetAbsPath)) {
      console.error(
        `\nFATAL: obsidian move reported success but target file is missing.\n` +
          `Expected: ${expectedTargetAbsPath}\n` +
          `Args:  ${["obsidian", ...obsidianArgs].join(" ")}\n` +
          `User-KB patches already written (${sets.length} article(s)).\n` +
          `Manual cleanup required:\n` +
          `  1. Inspect user-KB diffs (git diff in your KB repo)\n` +
          `  2. Either move the stub manually OR revert user-KB patches\n`,
      )
      process.exit(3)
    }

    // 3. DB-Update mit Retry
    await updateDbVaultWithRetry(c.noteLinkId, c.targetVault)

    summary.movesExecuted++
    if (c.reason === "plugin-output-to-private") summary.shared2priv++
    else summary.priv2shared++

    console.log(
      `[live] ✓ ${c.channelName} — ${sourceVaultRelative} → ${targetVaultRelative} ` +
        `(${sets.length} user-KB article(s) patched)`,
    )
  }

  return summary
}

const program = new Command()

program
  .name("relocate-plugin-outputs")
  .description(
    "Moves YouTube stub articles between <stefans-vault>/shared/youtube/ and " +
      "<stefans-vault>/private/youtube/ based on channel classification. " +
      "Patches obsidian:// URLs in user-KB articles inline.",
  )
  .option(
    "--dry-run",
    "List planned moves + user-KB patch diffs, write nothing",
  )
  .option("--limit <n>", "Process only first N move candidates", (v) =>
    parseInt(v, 10),
  )
  .option(
    "--include <list>",
    "Restrict to channels matching comma-separated names",
  )
  .option("-y, --yes", "Skip confirmation prompt (auto-confirm live run)")
  .action(async (opts) => {
    const ctx = await runSanity()
    console.log("[sanity] OK", {
      sharedVaultName: ctx.sharedVaultName,
      userKbVaultPath: ctx.userKbVaultPath,
      vaults: [...ctx.vaultRoots.keys()],
    })

    const candidates = await runPlan({
      limit: opts.limit,
      include: opts.include,
    })
    console.log(`[plan] ${candidates.length} move candidates`)

    console.log(
      `[user-kb-scan] scanning ${ctx.userKbVaultPath} for ${candidates.length} candidates`,
    )
    const userKbPatchesPerCandidate = new Map<bigint, UserKbPatchSet[]>()
    for (const c of candidates) {
      const sets = scanUserKbForCandidate(
        ctx.userKbVaultPath,
        ctx.sharedVaultName,
        c,
      )
      userKbPatchesPerCandidate.set(c.noteLinkId, sets)
    }

    if (opts.dryRun) {
      printDryRunReport(candidates, userKbPatchesPerCandidate)
      await prisma.$disconnect()
      return
    }

    // Confirmation gate: require explicit consent before destructive live run
    if (!opts.yes) {
      if (!process.stdin.isTTY) {
        console.error(
          "[live] Non-interactive session and --yes not provided. Aborting.",
        )
        await prisma.$disconnect()
        process.exit(1)
      }
      const confirmed = await confirm({
        message: `Execute ${candidates.length} live move(s)? This writes files and updates the DB.`,
        default: false,
      })
      if (!confirmed) {
        console.log("[live] Aborted.")
        await prisma.$disconnect()
        return
      }
    }

    const summary = await runLive(
      {
        sharedVaultName: ctx.sharedVaultName,
        userKbVaultPath: ctx.userKbVaultPath,
        vaultRoots: ctx.vaultRoots,
      },
      candidates,
      userKbPatchesPerCandidate,
    )

    console.log("\n=== Summary ===")
    console.log(`moves executed:           ${summary.movesExecuted}`)
    console.log(`  shared → private:        ${summary.shared2priv}`)
    console.log(`  private → shared:        ${summary.priv2shared}`)
    console.log(
      `user-KB url patches:     ${summary.userKbPatchedUrls} (across ${summary.userKbPatchedArticles} article(s))`,
    )
    console.log(`errors:                   ${summary.errors}`)
    await prisma.$disconnect()
  })

if (import.meta.main) {
  await program.parseAsync(process.argv)
}
