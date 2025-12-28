#!/usr/bin/env bun

import { spawn } from "child_process"
import { readFileSync, unlinkSync } from "fs"
import { config } from "dotenv"

// Load .env file
config({ path: ".env", quiet: true })

// Environments and their connection data
const ENVIRONMENTS = {
  dev: {
    host: "localhost",
    port: "5432",
    user: "all_personal_projects_dev",
    password: "all_personal_projects_dev",
    database: "all_personal_projects_dev",
  },
  staging: {
    host: "localhost",
    port: "5432",
    user: "all_personal_projects_staging",
    password: "all_personal_projects_staging",
    database: "all_personal_projects_staging",
  },
  prod: {
    host: "localhost",
    port: "5432",
    user: "all_personal_projects_prod",
    password: "all_personal_projects_prod",
    database: "all_personal_projects_prod",
  },
}

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

  if (args.length < 2) {
    console.log("Usage:")
    console.log(
      "  Copy:    bun copy.ts <source> <target>          (schema from .env)",
    )
    console.log(
      "  Copy:    bun copy.ts -s <schema> <source> <target>  (schema as parameter)",
    )
    console.log(
      "  Backup:  bun copy.ts -f <backup-file> -b <source>          (schema from .env)",
    )
    console.log(
      "  Backup:  bun copy.ts -s <schema> -f <backup-file> -b <source>  (schema as parameter)",
    )
    console.log(
      "  Restore: bun copy.ts -f <backup-file> -r <target>          (schema from .env)",
    )
    console.log(
      "  Restore: bun copy.ts -s <schema> -f <backup-file> -r <target>  (schema as parameter)",
    )
    console.log("")
    console.log("Parameters:")
    console.log(
      "  -s <schema>        Name of the schema (e.g. video, financy_forecast) - optional if DB_SCHEMA is set in .env",
    )
    console.log("  -f <backup-file>   Backup/Restore file")
    console.log("  -b                 Backup mode (Export)")
    console.log("  -r                 Restore mode (Import)")
    console.log("  <source>           Source: dev, staging or prod")
    console.log("  <target>           Target: dev, staging or prod")
    console.log("")
    console.log("Examples:")
    console.log(
      "  bun copy.ts dev staging                           (with schema from .env)",
    )
    console.log(
      "  bun copy.ts -s video dev staging                  (schema as parameter)",
    )
    console.log(
      "  bun copy.ts -f backup.sql -b dev                  (backup with schema from .env)",
    )
    console.log(
      "  bun copy.ts -s video -f backup.sql -b dev         (backup with schema as parameter)",
    )
    console.log(
      "  bun copy.ts -f backup.sql -r dev                  (restore with schema from .env)",
    )
    console.log(
      "  bun copy.ts -s video -f backup.sql -r dev         (restore with schema as parameter)",
    )
    process.exit(1)
  }

  const schemaIndex = args.indexOf("-s")
  const fileIndex = args.indexOf("-f")
  const backupIndex = args.indexOf("-b")
  const restoreIndex = args.indexOf("-r")

  // Determine schema from .env or parameter
  let schema: string | undefined

  if (schemaIndex !== -1) {
    schema = args[schemaIndex + 1]
    console.log(`🎯 Schema from parameter: ${schema}`)
  } else {
    const envSchema = getSchemaFromEnv()
    if (!envSchema) {
      console.error(
        "Error: No schema found. Please either set DB_SCHEMA in .env or use -s parameter",
      )
      process.exit(1)
    }
    schema = envSchema
  }

  let backupFile: string | undefined
  let mode: "copy" | "backup" | "restore"
  let source: string | undefined
  let target: string | undefined

  // Backup/Restore mode
  if (fileIndex !== -1) {
    backupFile = args[fileIndex + 1]

    if (backupIndex !== -1 && restoreIndex !== -1) {
      console.error("Error: -b and -r cannot be used simultaneously")
      process.exit(1)
    }

    if (backupIndex !== -1) {
      // Backup mode
      mode = "backup"
      source = args[backupIndex + 1]
    } else if (restoreIndex !== -1) {
      // Restore mode
      mode = "restore"
      target = args[restoreIndex + 1]
    } else {
      console.error("Error: With -f, either -b or -r must be specified")
      process.exit(1)
    }

    // Validation
    if (mode === "backup" && !source) {
      console.error("Error: Source is required for backup")
      process.exit(1)
    }

    if (mode === "restore" && !target) {
      console.error("Error: Target is required for restore")
      process.exit(1)
    }

    if (mode === "backup" && !(source! in ENVIRONMENTS)) {
      console.error(
        `Error: Unknown source '${source}'. Available: ${Object.keys(ENVIRONMENTS).join(", ")}`,
      )
      process.exit(1)
    }

    if (mode === "restore" && !(target! in ENVIRONMENTS)) {
      console.error(
        `Error: Unknown target '${target}'. Available: ${Object.keys(ENVIRONMENTS).join(", ")}`,
      )
      process.exit(1)
    }

    return { mode, schema, backupFile, source, target }
  } else {
    // Copy mode
    mode = "copy"

    // Determine parameters after -s schema
    let remainingArgs: string[]

    if (schemaIndex !== -1) {
      // -s parameter was present, remove -s and schema
      remainingArgs = args.filter(
        (_, index) => index !== schemaIndex && index !== schemaIndex + 1,
      )
    } else {
      // No -s parameter, use all arguments
      remainingArgs = args
    }

    if (remainingArgs.length < 2) {
      console.error("Error: Source and target are required for copying")
      console.error(`Received arguments: ${remainingArgs.join(", ")}`)
      process.exit(1)
    }

    source = remainingArgs[0]
    target = remainingArgs[1]

    if (!(source in ENVIRONMENTS)) {
      console.error(
        `Error: Unknown source '${source}'. Available: ${Object.keys(ENVIRONMENTS).join(", ")}`,
      )
      process.exit(1)
    }

    if (!(target in ENVIRONMENTS)) {
      console.error(
        `Error: Unknown target '${target}'. Available: ${Object.keys(ENVIRONMENTS).join(", ")}`,
      )
      process.exit(1)
    }

    if (source === target) {
      console.error("Error: Source and target must not be identical")
      process.exit(1)
    }

    return { mode, schema, source: source!, target: target! }
  }
}

// Build PostgreSQL URL
function buildUrl(env: keyof typeof ENVIRONMENTS): string {
  const config = ENVIRONMENTS[env]
  return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
}

// Execute PostgreSQL command
function executeCommand(
  command: string,
  args: string[],
  envVars?: Record<string, string>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        PGPASSWORD: undefined, // Remove PGPASSWORD from process environment
        ...envVars,
      },
    })

    childProcess.on("close", (code: number | null) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    childProcess.on("error", (error: Error) => {
      reject(error)
    })
  })
}

// Backup function
async function backupSchema(
  schema: string,
  sourceEnv: keyof typeof ENVIRONMENTS,
  backupFile: string,
) {
  const sourceUrl = buildUrl(sourceEnv)

  console.log(`💾 Creating backup of schema '${schema}' from ${sourceEnv}`)
  console.log(`📤 Source: ${sourceUrl}`)
  console.log(`💾 Backup file: ${backupFile}`)

  // Export schema
  console.log(`\n📤 Exporting schema '${schema}' from ${sourceEnv}...`)
  await executeCommand(
    "pg_dump",
    [
      "-h",
      ENVIRONMENTS[sourceEnv].host,
      "-p",
      ENVIRONMENTS[sourceEnv].port,
      "-U",
      ENVIRONMENTS[sourceEnv].user,
      "-d",
      ENVIRONMENTS[sourceEnv].database,
      "-n",
      schema,
      "-f",
      backupFile,
    ],
    {
      PGPASSWORD: ENVIRONMENTS[sourceEnv].password,
    },
  )

  console.log(`\n✅ Backup successfully created: ${backupFile}`)
}

// Restore function
async function restoreSchema(
  schema: string,
  targetEnv: keyof typeof ENVIRONMENTS,
  backupFile: string,
) {
  const targetUrl = buildUrl(targetEnv)

  console.log(`🔄 Restoring schema '${schema}' from backup in ${targetEnv}`)
  console.log(`📥 Target: ${targetUrl}`)
  console.log(`💾 Backup file: ${backupFile}`)

  // Check if backup file exists
  try {
    readFileSync(backupFile, "utf8")
  } catch (error) {
    console.error(
      `Error: Backup file '${backupFile}' not found or not readable`,
    )
    process.exit(1)
  }

  // Delete existing schema (if present)
  console.log(`\n🗑️ Deleting existing schema '${schema}' in ${targetEnv}...`)
  try {
    await executeCommand(
      "psql",
      [
        "-h",
        ENVIRONMENTS[targetEnv].host,
        "-p",
        ENVIRONMENTS[targetEnv].port,
        "-U",
        ENVIRONMENTS[targetEnv].user,
        "-d",
        ENVIRONMENTS[targetEnv].database,
        "-c",
        `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
      ],
      {
        PGPASSWORD: ENVIRONMENTS[targetEnv].password,
      },
    )
    console.log(`✅ Schema '${schema}' successfully deleted`)
  } catch (error) {
    console.log(
      `ℹ️ Schema '${schema}' did not exist or could not be deleted (possibly already empty)`,
    )
  }

  // Import backup to target
  console.log(
    `\n📥 Importing schema '${schema}' from ${backupFile} to ${targetEnv}...`,
  )
  await executeCommand(
    "psql",
    [
      "-h",
      ENVIRONMENTS[targetEnv].host,
      "-p",
      ENVIRONMENTS[targetEnv].port,
      "-U",
      ENVIRONMENTS[targetEnv].user,
      "-d",
      ENVIRONMENTS[targetEnv].database,
      "-f",
      backupFile,
    ],
    {
      PGPASSWORD: ENVIRONMENTS[targetEnv].password,
    },
  )

  console.log(
    `\n✅ Successfully restored schema '${schema}' from ${backupFile} to ${targetEnv}!`,
  )
}

// Main copy function
async function copySchema(
  schema: string,
  sourceEnv: keyof typeof ENVIRONMENTS,
  targetEnv: keyof typeof ENVIRONMENTS,
) {
  const sourceUrl = buildUrl(sourceEnv)
  const targetUrl = buildUrl(targetEnv)

  console.log(`🔄 Copying schema '${schema}' from ${sourceEnv} to ${targetEnv}`)
  console.log(`📤 Source: ${sourceUrl}`)
  console.log(`📥 Target: ${targetUrl}`)

  // Temporary file for dump
  const TEMP_DUMP_FILE = "/tmp/schema_dump.sql"

  // 1. Export schema with --clean flag (including DROP statements)
  console.log(`\n📤 Exporting schema '${schema}' from ${sourceEnv}...`)
  await executeCommand(
    "pg_dump",
    [
      "-h",
      ENVIRONMENTS[sourceEnv].host,
      "-p",
      ENVIRONMENTS[sourceEnv].port,
      "-U",
      ENVIRONMENTS[sourceEnv].user,
      "-d",
      ENVIRONMENTS[sourceEnv].database,
      "-n",
      schema,
      "--clean",
      "--if-exists",
      "--no-owner",
      "-f",
      TEMP_DUMP_FILE,
    ],
    {
      PGPASSWORD: ENVIRONMENTS[sourceEnv].password,
    },
  )

  // 2. Import dump to target
  console.log(`\n📥 Importing schema '${schema}' to ${targetEnv}...`)
  await executeCommand(
    "psql",
    [
      "-h",
      ENVIRONMENTS[targetEnv].host,
      "-p",
      ENVIRONMENTS[targetEnv].port,
      "-U",
      ENVIRONMENTS[targetEnv].user,
      "-d",
      ENVIRONMENTS[targetEnv].database,
      "-f",
      TEMP_DUMP_FILE,
    ],
    {
      PGPASSWORD: ENVIRONMENTS[targetEnv].password,
    },
  )

  // 3. Delete temporary file
  try {
    unlinkSync(TEMP_DUMP_FILE)
  } catch (error) {
    // Ignore if file does not exist
  }

  console.log(
    `\n✅ Successfully copied schema '${schema}' from ${sourceEnv} to ${targetEnv}!`,
  )
}

// Main function
async function main() {
  try {
    const args = parseArgs()

    if (args.mode === "backup") {
      await backupSchema(
        args.schema,
        args.source as keyof typeof ENVIRONMENTS,
        args.backupFile!,
      )
    } else if (args.mode === "restore") {
      await restoreSchema(
        args.schema,
        args.target as keyof typeof ENVIRONMENTS,
        args.backupFile!,
      )
    } else {
      await copySchema(
        args.schema,
        args.source as keyof typeof ENVIRONMENTS,
        args.target as keyof typeof ENVIRONMENTS,
      )
    }
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : "Unknown error",
    )
    process.exit(1)
  }
}

main()
