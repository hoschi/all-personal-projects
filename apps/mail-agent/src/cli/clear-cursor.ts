#!/usr/bin/env bun
import { clearCursor } from "../gmail/index.js"

async function main() {
  try {
    await clearCursor()
    console.log("Cursor cleared successfully. Next server start will perform a full sync.")
  } catch (error) {
    console.error("Failed to clear cursor:", error)
    process.exit(1)
  }
}

main()
