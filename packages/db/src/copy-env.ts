#!/usr/bin/env bun

import { spawn } from "child_process"
import { config } from "dotenv"

// Load .env file
config({ path: ".env", quiet: true })

// Read schema from .env file
function getSchemaFromEnv(): string | undefined {
  const schema = process.env.DB_SCHEMA
  if (schema) {
    console.log(`📋 Schema from .env file: ${schema}`)
  }
  return schema
}

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2)

  const schemaIndex = args.indexOf("-s")
  const directionIndex =
    args.indexOf("up") !== -1 ? args.indexOf("up") : args.indexOf("down")
  const stagingOnly = args.includes("--staging-only")

  // Determine schema from .env or parameter
  let schema: string | undefined

  if (schemaIndex !== -1) {
    schema = args[schemaIndex + 1]
    console.log(`🎯 Schema from parameter: ${schema}`)
  } else {
    const envSchema = getSchemaFromEnv()
    if (!envSchema) {
      console.log(
        "Usage: bun copy-env.ts -s <schema> <up|down> [--staging-only]    (use schema from .env)",
      )
      console.log(
        "Usage: bun copy-env.ts <up|down> [--staging-only]       (schema from .env)",
      )
      console.log("")
      console.log("Parameters:")
      console.log(
        "  -s <schema>       Name of the schema (e.g. video, financy_forecast) - optional if DB_SCHEMA is set in .env",
      )
      console.log("  up                Copy from dev → staging → prod")
      console.log("  down              Copy from prod → staging → dev")
      console.log(
        "  --staging-only    Copy only up to staging (skip last stage)",
      )
      console.log("")
      console.log("Examples:")
      console.log(
        "  bun copy-env.ts up                    (with schema from .env)",
      )
      console.log(
        "  bun copy-env.ts -s video up           (schema as parameter)",
      )
      console.log(
        "  bun copy-env.ts down                  (with schema from .env)",
      )
      console.log(
        "  bun copy-env.ts -s video down         (schema as parameter)",
      )
      console.log("  bun copy-env.ts -s financy_forecast up --staging-only")
      console.log("  bun copy-env.ts -s financy_forecast down --staging-only")
      process.exit(1)
    }
    schema = envSchema
  }

  if (directionIndex === -1) {
    console.log(
      "Usage: bun copy-env.ts -s <schema> <up|down> [--staging-only]    (use schema from .env)",
    )
    console.log(
      "Usage: bun copy-env.ts <up|down> [--staging-only]       (schema from .env)",
    )
    console.log("")
    console.log("Parameters:")
    console.log(
      "  -s <schema>       Name of the schema (e.g. video, financy_forecast) - optional if DB_SCHEMA is set in .env",
    )
    console.log("  up                Copy from dev → staging → prod")
    console.log("  down              Copy from prod → staging → dev")
    console.log("  --staging-only    Copy only up to staging (skip last stage)")
    console.log("")
    console.log("Examples:")
    console.log(
      "  bun copy-env.ts up                    (with schema from .env)",
    )
    console.log("  bun copy-env.ts -s video up           (schema as parameter)")
    console.log(
      "  bun copy-env.ts down                  (with schema from .env)",
    )
    console.log("  bun copy-env.ts -s video down         (schema as parameter)")
    console.log("  bun copy-env.ts -s financy_forecast up --staging-only")
    console.log("  bun copy-env.ts -s financy_forecast down --staging-only")
    process.exit(1)
  }

  const direction = args[directionIndex]

  if (!schema) {
    console.error("Error: Schema name is required")
    process.exit(1)
  }

  if (direction !== "up" && direction !== "down") {
    console.error('Error: Direction must be "up" or "down"')
    process.exit(1)
  }

  console.log(`🔄 Copying schema '${schema}' in direction ${direction}...`)
  if (stagingOnly) {
    console.log("⚠️  --staging-only enabled: Last stage will be skipped")
  }

  return { schema, direction, stagingOnly }
}

// Execute copy.ts script
function executeCopyScript(
  schema: string,
  source: string,
  target: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if schema is present in .env
    const envSchema = process.env.DB_SCHEMA
    let command: string[]

    if (envSchema === schema) {
      // Schema is in .env, use new usage without -s
      console.log(
        `\n📦 Executing: bun copy.ts ${source} ${target} (schema from .env: ${schema})`,
      )
      command = ["run", "packages/db/src/copy.ts", source, target]
    } else {
      // Schema is not in .env or different, use legacy usage with -s
      console.log(
        `\n📦 Executing: bun copy.ts -s ${schema} ${source} ${target}`,
      )
      command = ["run", "packages/db/src/copy.ts", "-s", schema, source, target]
    }

    const childProcess = spawn("bun", command, {
      stdio: "inherit",
      cwd: "/Users/hoschi/repos/all-personal-projects",
    })

    childProcess.on("close", (code: number | null) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`copy.ts failed with exit code ${code}`))
      }
    })

    childProcess.on("error", (error: Error) => {
      reject(error)
    })
  })
}

// Main function for the copy operation
async function copyEnv(
  schema: string,
  direction: "up" | "down",
  stagingOnly: boolean,
) {
  try {
    if (direction === "up") {
      console.log("\n" + "=".repeat(60))
      console.log("🔄 DIRECTION UP: Development → Staging → Production")
      console.log("=".repeat(60))

      // 1. Dev → Staging
      console.log("\n🔄 STEP 1: Development → Staging")
      console.log(`\n🔄 Copying schema '${schema}' from dev to staging...`)
      await executeCopyScript(schema, "dev", "staging")
      console.log(
        `✅ Schema '${schema}' successfully copied from dev to staging`,
      )

      // 2. Staging → Production (optional)
      if (!stagingOnly) {
        console.log("\n🔄 STEP 2: Staging → Production")
        console.log(`\n🔄 Copying schema '${schema}' from staging to prod...`)
        await executeCopyScript(schema, "staging", "prod")
        console.log(
          `✅ Schema '${schema}' successfully copied from staging to prod`,
        )
      } else {
        console.log("\n⏭️  Production update skipped (--staging-only enabled)")
      }
    } else {
      // direction === 'down'
      console.log("\n" + "=".repeat(60))
      console.log("🔄 DIRECTION DOWN: Production → Staging → Development")
      console.log("=".repeat(60))

      // 1. Production → Staging
      console.log("\n🔄 STEP 1: Production → Staging")
      console.log(`\n🔄 Copying schema '${schema}' from prod to staging...`)
      await executeCopyScript(schema, "prod", "staging")
      console.log(
        `✅ Schema '${schema}' successfully copied from prod to staging`,
      )

      // 2. Staging → Development (optional)
      if (!stagingOnly) {
        console.log("\n🔄 STEP 2: Staging → Development")
        console.log(`\n🔄 Copying schema '${schema}' from staging to dev...`)
        await executeCopyScript(schema, "staging", "dev")
        console.log(
          `✅ Schema '${schema}' successfully copied from staging to dev`,
        )
      } else {
        console.log("\n⏭️  Development update skipped (--staging-only enabled)")
      }
    }

    console.log("\n" + "=".repeat(60))
    console.log("🎉 Database copying completed successfully!")
    console.log("=".repeat(60))

    if (stagingOnly) {
      if (direction === "up") {
        console.log("📋 Summary:")
        console.log("   - Development → Staging ✅")
        console.log("   - Staging → Production ⏭️ (skipped)")
      } else {
        console.log("📋 Summary:")
        console.log("   - Production → Staging ✅")
        console.log("   - Staging → Development ⏭️ (skipped)")
      }
    } else {
      if (direction === "up") {
        console.log("📋 Summary:")
        console.log("   - Development → Staging ✅")
        console.log("   - Staging → Production ✅")
      } else {
        console.log("📋 Summary:")
        console.log("   - Production → Staging ✅")
        console.log("   - Staging → Development ✅")
      }
    }
  } catch (error) {
    console.error(
      "\n❌ Error during copying:",
      error instanceof Error ? error.message : "Unknown error",
    )
    process.exit(1)
  }
}

// Main function
async function main() {
  try {
    const { schema, direction, stagingOnly } = parseArgs()
    await copyEnv(schema, direction as "up" | "down", stagingOnly)
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : "Unknown error",
    )
    process.exit(1)
  }
}

main()
