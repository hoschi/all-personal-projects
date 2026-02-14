#!/usr/bin/env bun

import { spawnSync } from "child_process"
import { existsSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { Command } from "commander"
import { confirm } from "@inquirer/prompts"

const SCRIPT_PATH = fileURLToPath(import.meta.url)
const ROOT_DIR = dirname(dirname(dirname(dirname(SCRIPT_PATH))))

const program = new Command()
  .name("init-fresh-clone")
  .description(
    "Link bins, fetch AI docs, set up Husky hooks, and optionally run bun install.",
  )
  .option("-y, --yes", "Run bun install without prompting")
  .parse(process.argv)

const options = program.opts<{ yes?: boolean }>()
const autoYes = Boolean(options.yes)

function runCommand(command: string, commandArgs: string[]): void {
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT_DIR,
    stdio: "inherit",
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function setupHuskyHooks(): void {
  console.log("Setting up Husky hooks...")

  const localHuskyPackage = join(ROOT_DIR, "node_modules/husky/package.json")
  if (existsSync(localHuskyPackage)) {
    runCommand("bun", ["run", "prepare"])
    return
  }

  // Fallback for cases where install is skipped but hooks should still be initialized.
  runCommand("bunx", ["husky"])
}

async function askToRunInstall(): Promise<boolean> {
  if (autoYes) {
    return true
  }

  if (!process.stdin.isTTY) {
    return false
  }

  return confirm({
    message: "Run `bun install`?",
    default: false,
  })
}

console.log("Linking workspace bins...")
runCommand("bun", ["run", "packages/tools/src/link-bins.ts"])

console.log("Fetching AI docs...")
runCommand("bun", ["run", "packages/tools/src/fetch-ai-docs.ts"])

const shouldInstall = await askToRunInstall()

if (shouldInstall) {
  console.log("Running bun install...")
  runCommand("bun", ["install"])
} else {
  console.log("Skipping bun install.")
}

setupHuskyHooks()
