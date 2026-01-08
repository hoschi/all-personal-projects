/**
 * FinanceForecast Database Setup Script
 *
 * This script provides utilities to manage database tables.
 * Use the SQL file for direct database operations:
 * psql $DATABASE_URL -f create-tables.sql
 */

import { execSync } from "child_process"
import { existsSync } from "fs"
import { join } from "path"

// Load environment variables
import * as dotenv from "dotenv"
dotenv.config()

const SCRIPT_DIR = __dirname
const SQL_FILE = join(SCRIPT_DIR, "create-tables.sql")

/**
 * Execute SQL file against the database
 */
function executeSqlFile(): void {
  if (!existsSync(SQL_FILE)) {
    throw new Error(`SQL file not found: ${SQL_FILE}`)
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable not set")
  }

  try {
    // Create schema first
    execSync(
      `psql "${process.env.DATABASE_URL}" -c "CREATE SCHEMA IF NOT EXISTS financy_forecast;"`,
      {
        stdio: "inherit",
        env: process.env,
      },
    )

    // Execute SQL file with search path set in the file itself
    execSync(`psql "${process.env.DATABASE_URL}" -f "${SQL_FILE}"`, {
      stdio: "inherit",
      env: process.env,
    })
    console.log("✅ SQL file executed successfully")
  } catch (error) {
    console.error("❌ Failed to execute SQL file:", error)
    throw error
  }
}

/**
 * Create all tables using the SQL file
 */
export function createAllTables(): void {
  console.log("🚀 Creating tables from SQL file...")
  executeSqlFile()
  console.log("🎉 All tables created successfully!")
}

/**
 * Drop all tables
 */
export function dropAllTables(): void {
  console.log("⚠️  Dropping all tables...")

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable not set")
  }

  const dropSql = `
    DROP SCHEMA IF EXISTS financy_forecast CASCADE;
  `

  try {
    execSync(`psql "${process.env.DATABASE_URL}" -c "${dropSql}"`, {
      stdio: "inherit",
      env: process.env,
    })
    console.log("✅ All tables dropped successfully")
  } catch (error) {
    console.error("❌ Failed to drop tables:", error)
    throw error
  }
}

/**
 * Reset database (drop and recreate)
 */
export function resetDatabase(): void {
  console.log("🔄 Resetting database...")
  dropAllTables()
  createAllTables()
  console.log("🎉 Database reset completed!")
}

/**
 * Main execution function
 */
function main(): void {
  try {
    console.log("📊 FinanceForecast Database Setup")
    console.log("=================================")

    // Test database connection
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable not set")
      console.log(
        "Please create a .env file with DATABASE_URL=postgresql://...",
      )
      process.exit(1)
    }

    // Test connection
    execSync(`psql "${process.env.DATABASE_URL}" -c "SELECT 1"`, {
      stdio: "pipe",
    })
    console.log("✅ Database connection successful")

    // Parse command line arguments
    const args = process.argv.slice(2)
    const command = args[0] || "create"

    switch (command) {
      case "create":
        createAllTables()
        break
      case "reset":
        resetDatabase()
        break
      case "drop":
        dropAllTables()
        break
      default:
        console.log("\n❓ Unknown command. Available commands:")
        console.log("  create  - Create all tables (default)")
        console.log("  reset   - Drop and recreate all tables")
        console.log("  drop    - Drop all tables")
        console.log("\nOr run directly:")
        console.log("  bun run scripts/create-tables.ts create")
        console.log("  psql $DATABASE_URL -f scripts/create-tables.sql")
        break
    }

    console.log("\n✨ Database setup completed!")
  } catch (error) {
    console.error("\n💥 Database setup failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
