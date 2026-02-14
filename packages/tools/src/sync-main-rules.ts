#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const SCRIPT_PATH = fileURLToPath(import.meta.url)
const ROOT_DIR = dirname(dirname(dirname(dirname(SCRIPT_PATH))))

const SOURCE_PATH = join(ROOT_DIR, "ai-assistants/main-rules.md")
const TARGET_PATHS = [
  join(ROOT_DIR, ".roo/rules/main-rules.md"),
  join(ROOT_DIR, ".kilocode/rules/main-rules.md"),
]

if (!existsSync(SOURCE_PATH)) {
  throw new Error(`Source file not found: ${SOURCE_PATH}`)
}

const sourceContent = readFileSync(SOURCE_PATH, "utf-8")
const updatedTargets: string[] = []

for (const targetPath of TARGET_PATHS) {
  if (!existsSync(targetPath)) {
    throw new Error(`Target file not found: ${targetPath}`)
  }

  const targetContent = readFileSync(targetPath, "utf-8")

  if (targetContent !== sourceContent) {
    writeFileSync(targetPath, sourceContent)
    updatedTargets.push(targetPath)
  }
}

if (updatedTargets.length > 0) {
  console.log(
    `Synchronized main-rules to ${updatedTargets.length} target file(s).`,
  )
}
