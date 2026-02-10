#!/usr/bin/env bun

import { mkdirSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const SCRIPT_PATH = fileURLToPath(import.meta.url)
const ROOT_DIR = dirname(dirname(dirname(dirname(SCRIPT_PATH))))
const TMP_DIR = join(ROOT_DIR, "ai-ref")

const DOCS = [
  {
    url: "https://nextjs.org/docs/llms-full.txt",
    filename: "nextjs-llms-full.txt",
  },
  {
    url: "https://raw.githubusercontent.com/gvergnaud/ts-pattern/refs/heads/main/README.md",
    filename: "ts-pattern-README.md",
  },
]

mkdirSync(TMP_DIR, { recursive: true })

for (const doc of DOCS) {
  const response = await fetch(doc.url)

  if (!response.ok) {
    throw new Error(`Failed to download ${doc.url}: ${response.status}`)
  }

  const content = await response.text()
  const outputPath = join(TMP_DIR, doc.filename)

  writeFileSync(outputPath, content)
  console.log(`Downloaded ${doc.url} -> ${outputPath}`)
}
