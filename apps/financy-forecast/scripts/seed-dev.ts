/**
 * FinanceForecast Development Seed Data Script - FIXED VERSION
 *
 * This script populates the database with realistic sample data for development:
 * - 5 different accounts (3 liquid, 2 retirement)
 * - 6 months of asset snapshots with balance details
 * - Recurring items (monthly, quarterly, yearly)
 * - Scenario items (one-time payments)
 * - Default settings
 */

import { execSync } from "child_process"
import { calculateAccountsTotalBalance } from "../domain/snapshots"

// Load environment variables
import * as dotenv from "dotenv"
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable not set")
  console.log("Please create a .env file with DATABASE_URL=postgresql://...")
  process.exit(1)
}

/**
 * Execute SQL command directly
 */
function executeSql(sql: string): void {
  try {
    execSync(
      `psql "${DATABASE_URL}" -c "SET search_path TO financy_forecast, public; ${sql}"`,
      {
        stdio: "inherit",
        env: process.env,
      },
    )
  } catch (error) {
    console.error("❌ SQL execution failed:", sql)
    console.error("Error:", error)
    throw error
  }
}

/**
 * Get account IDs for reference
 */
function getAccountIds(): { [name: string]: string } {
  try {
    const result = execSync(
      `psql "${DATABASE_URL}" -t -c "SET search_path TO financy_forecast, public; SELECT name, id FROM accounts ORDER BY name;"`,
      {
        encoding: "utf8",
        env: process.env,
      },
    ).trim()

    const accounts: { [name: string]: string } = {}
    const lines = result.split("\n")

    lines.forEach((line) => {
      const [name, id] = line.trim().split("|")
      if (name && id) {
        accounts[name.trim()] = id.trim()
      }
    })

    return accounts
  } catch {
    throw new Error("Failed to fetch account IDs")
  }
}

/**
 * Generate date strings for the last 6 months from current date (first day of month)
 */
function getLastSixMonthsDates(): string[] {
  const dates: string[] = []
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-based (0 = January)

  // Generate dates for the last 6 months, ending with current month
  for (let i = 6; i > 0; i--) {
    const targetMonth = currentMonth - i
    const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear
    const adjustedMonth = targetMonth < 0 ? targetMonth + 12 : targetMonth

    // Get the first day of the month
    const dateStr = `${targetYear}-${String(adjustedMonth + 1).padStart(2, "0")}-01`
    dates.push(dateStr)
  }

  return dates
}

/**
 * Create sample asset snapshots and balance details for the last 6 months
 */
function seedAssetSnapshots(): void {
  console.log("📅 Creating 6 months of asset snapshots...")

  const accountIds = getAccountIds()
  const dates = getLastSixMonthsDates()

  console.log(`🗓️  Generated dates (last 6 months): ${dates.join(", ")}`)

  // Generate realistic balance progression with some variation
  const baseBalances = {
    "Sparkasse Girokonto": 125000, // 1,250.00 € (current)
    "ING DiBa Tagesgeld": 450000, // 4,500.00 € (current)
    "Comdirect Depot": 12500000, // 125,000.00 € (current)
    "DAX ETF Fond": 8750000, // 87,500.00 € (current)
    "PayPal Guthaben": 8900, // 89.00 € (current)
  }

  // Generate monthly progression backwards from current month
  const monthlyBalances = dates.map((date, index) => {
    const monthsBack = 5 - index
    const variation = Math.random() * 0.2 - 0.1 // ±10% variation

    return {
      date,
      balances: {
        "Sparkasse Girokonto": Math.round(
          baseBalances["Sparkasse Girokonto"] *
            (1 + variation + monthsBack * 0.05),
        ),
        "ING DiBa Tagesgeld": Math.round(
          baseBalances["ING DiBa Tagesgeld"] *
            (1 + variation + monthsBack * 0.02),
        ),
        "Comdirect Depot": Math.round(
          baseBalances["Comdirect Depot"] * (1 + variation + monthsBack * 0.03),
        ),
        "DAX ETF Fond": Math.round(
          baseBalances["DAX ETF Fond"] * (1 + variation + monthsBack * 0.04),
        ),
        "PayPal Guthaben": Math.round(
          baseBalances["PayPal Guthaben"] * (1 + variation + monthsBack * 0.1),
        ),
      },
    }
  })

  monthlyBalances.forEach((month) => {
    const totalLiquidity = calculateAccountsTotalBalance(
      Object.values(month.balances),
    )

    // Insert asset snapshot using PostgreSQL gen_random_uuid() and capture the ID
    const tempSnapshotId = execSync(
      `psql "${DATABASE_URL}" -t -A -c "SET search_path TO financy_forecast, public; INSERT INTO asset_snapshots (id, date, total_liquidity) VALUES (gen_random_uuid(), '${month.date}', ${totalLiquidity}) RETURNING id;"`,
      {
        encoding: "utf8",
        env: process.env,
      },
    ).trim()

    // Parse the UUID from psql output - it contains the UUID in the result
    const snapshotId =
      tempSnapshotId
        .split("\n")
        .find((line) => line.trim() && !line.startsWith("SET"))
        ?.trim() || ""

    if (snapshotId) {
      // Insert balance details for each account
      console.log(
        `💰 Creating balance details for snapshot ${snapshotId} (${month.date})...`,
      )
      Object.entries(month.balances).forEach(([accountName, balance]) => {
        const accountId = accountIds[accountName]
        if (accountId) {
          const detailSql = `
                        INSERT INTO account_balance_details (id, snapshot_id, account_id, amount)
                        VALUES (gen_random_uuid(), '${snapshotId}', '${accountId}', ${balance});
                    `
          try {
            executeSql(detailSql)
            console.log(`  ✅ ${accountName}: ${balance} cents`)
          } catch (error) {
            console.error(
              `  ❌ Failed to insert balance for ${accountName}:`,
              error,
            )
          }
        } else {
          console.warn(`  ⚠️  No Account ID found for ${accountName}`)
        }
      })
    } else {
      console.error(`❌  Could not create snapshot for date ${month.date}`)
    }
  })

  console.log("✅ Asset snapshots and balance details created")
}

/**
 * Generate future scenarios (max 20 months from today)
 */
function generateFutureScenarios(
  startDate: Date,
  maxMonths: number,
): Array<{
  name: string
  amount: number
  date: string
  is_active: boolean
}> {
  const scenarios = []
  const currentMonth = startDate.getMonth() // 0-based

  // Generate scenarios spread across the next 20 months
  const scenarioTemplates = [
    {
      name: "MacBook Pro Kauf",
      amount: -250000,
      monthsFromNow: 2,
      is_active: true,
    },
    {
      name: "Urlaub Spanien",
      amount: -180000,
      monthsFromNow: 6,
      is_active: true,
    },
    {
      name: "Neue Winterreifen",
      amount: -60000,
      monthsFromNow: 11,
      is_active: true,
    },
    {
      name: "Geschenke Weihnachten",
      amount: -50000,
      monthsFromNow: 12,
      is_active: true,
    },
    {
      name: "Wohnung renovieren",
      amount: -500000,
      monthsFromNow: 15,
      is_active: true,
    },
    {
      name: "Urlaub Japan",
      amount: -350000,
      monthsFromNow: 18,
      is_active: true,
    },
    {
      name: "Neues Auto",
      amount: -3500000,
      monthsFromNow: 20,
      is_active: true,
    },
    { name: "Aktiengewinn", amount: 150000, monthsFromNow: 8, is_active: true },
    {
      name: "Bonus Zahlung",
      amount: 200000,
      monthsFromNow: 4,
      is_active: true,
    },
    {
      name: "Konzertkarten",
      amount: -25000,
      monthsFromNow: 3,
      is_active: false,
    },
  ]

  for (const template of scenarioTemplates) {
    if (template.monthsFromNow <= maxMonths) {
      const scenarioDate = new Date(startDate)
      scenarioDate.setMonth(currentMonth + template.monthsFromNow)

      // Add some randomness to the day of month (1-28 to avoid month-end issues)
      const dayOfMonth = Math.floor(Math.random() * 28) + 1
      scenarioDate.setDate(dayOfMonth)

      const dateString = scenarioDate.toISOString().split("T")[0] // YYYY-MM-DD format

      scenarios.push({
        name: template.name,
        amount: template.amount,
        date: dateString,
        is_active: template.is_active,
      })
    }
  }

  return scenarios
}

/**
 * Main seed function
 */
function seedDatabase(): void {
  console.log("🌱 Starting FinanceForecast development seed - FIXED VERSION...")
  console.log("==============================================")

  try {
    // Test connection
    executeSql("SELECT 1")
    console.log("✅ Database connection successful\n")

    // Clear existing data first
    console.log("🧹 Clearing existing data...")
    executeSql("DELETE FROM account_balance_details;")
    executeSql("DELETE FROM asset_snapshots;")
    executeSql("DELETE FROM scenario_items;")
    executeSql("DELETE FROM recurring_items;")
    executeSql("DELETE FROM accounts;")
    executeSql("UPDATE settings SET estimated_monthly_variable_costs = 0;")
    console.log("✅ Existing data cleared\n")

    // Create accounts
    const accountsSql = `
        INSERT INTO accounts (id, name, category, current_balance) VALUES
        (gen_random_uuid(), 'Sparkasse Girokonto', 'LIQUID', 125000),
        (gen_random_uuid(), 'ING DiBa Tagesgeld', 'LIQUID', 450000),
        (gen_random_uuid(), 'Comdirect Depot', 'RETIREMENT', 12500000),
        (gen_random_uuid(), 'DAX ETF Fond', 'RETIREMENT', 8750000),
        (gen_random_uuid(), 'PayPal Guthaben', 'LIQUID', 8900);
        `
    executeSql(accountsSql)
    console.log("✅ Sample accounts created\n")

    // Create asset snapshots with balance details
    seedAssetSnapshots()

    // Create other data
    const recurringItemsSql = `
        INSERT INTO recurring_items (id, name, amount, interval, due_month) VALUES
        (gen_random_uuid(), 'Miete', -120000, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Strom & Gas', -8500, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Internet & Telefon', -4500, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Versicherungen', -12500, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Supermarkt', -35000, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Öffentliche Verkehrsmittel', -8900, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Kfz-Steuer', -3000, 'QUARTERLY', 1),
        (gen_random_uuid(), 'Betriebskosten', -4500, 'QUARTERLY', 4),
        (gen_random_uuid(), 'Kfz-Versicherung', -48000, 'YEARLY', 6),
        (gen_random_uuid(), 'Hausratversicherung', -12000, 'YEARLY', 9),
        (gen_random_uuid(), 'Krankenkasse', -25000, 'YEARLY', 1),
        (gen_random_uuid(), 'Gehalt', 320000, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Nebeneinkommen', 45000, 'MONTHLY', NULL),
        (gen_random_uuid(), 'Steuerrückzahlung', 250000, 'QUARTERLY', 4),
        (gen_random_uuid(), 'Urlaubsgeld', 150000, 'YEARLY', 6),
        (gen_random_uuid(), 'Weihnachtsgeld', 200000, 'YEARLY', 11);
        `
    executeSql(recurringItemsSql)
    console.log("✅ Recurring items created\n")

    // Generate future scenarios only (max 20 months from today)
    const today = new Date()
    const scenarios = generateFutureScenarios(today, 20) // 20 months max

    const scenarioItemsSql = `
        INSERT INTO scenario_items (id, name, amount, date, is_active) VALUES
        ${scenarios
          .map(
            (scenario) =>
              `(gen_random_uuid(), '${scenario.name}', ${scenario.amount}, '${scenario.date}', ${scenario.is_active})`,
          )
          .join(",\n        ")};
        `
    executeSql(scenarioItemsSql)
    console.log("✅ Scenario items created\n")

    const settingsSql = `
        INSERT INTO settings (id, estimated_monthly_variable_costs)
        VALUES ('00000000-0000-0000-0000-000000000000', 120000)
        ON CONFLICT (id) DO UPDATE SET 
          estimated_monthly_variable_costs = EXCLUDED.estimated_monthly_variable_costs,
          updated_at = CURRENT_TIMESTAMP;
        `
    executeSql(settingsSql)
    console.log("✅ Settings created\n")

    console.log("\n🎉 Development seed completed successfully!")
    // Count scenarios for summary
    const scenarioCount = scenarios.length
    const activeScenarios = scenarios.filter((s) => s.is_active).length
    const inactiveScenarios = scenarioCount - activeScenarios

    console.log("\n📊 Summary:")
    console.log("  🏦 5 Accounts (3 liquid, 2 retirement)")
    console.log("  📅 6 Months of historical/projected data")
    console.log("  🔄 16 Recurring items (monthly, quarterly, yearly)")
    console.log(
      `  🎯 ${scenarioCount} Future scenario items (${activeScenarios} active, ${inactiveScenarios} inactive)`,
    )
    console.log("  ⚙️  Default settings configured")
    console.log("\n💡 You can now start developing with realistic sample data!")
  } catch (error) {
    console.error("\n💥 Seed failed:", error)
    process.exit(1)
  }
}

/**
 * Clear all development data
 */
function clearSeedData(): void {
  console.log("🧹 Clearing development seed data...")

  try {
    executeSql("DELETE FROM account_balance_details;")
    executeSql("DELETE FROM asset_snapshots;")
    executeSql("DELETE FROM scenario_items;")
    executeSql("DELETE FROM recurring_items;")
    executeSql("DELETE FROM accounts;")
    executeSql("UPDATE settings SET estimated_monthly_variable_costs = 0;")

    console.log("✅ Development data cleared")
  } catch (error) {
    console.error("❌ Failed to clear data:", error)
    throw error
  }
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const command = args[0] || "seed"

  switch (command) {
    case "seed":
      seedDatabase()
      break
    case "clear":
      clearSeedData()
      break
    default:
      console.log("❓ Available commands:")
      console.log("  seed  - Populate database with sample data (default)")
      console.log("  clear - Remove all sample data")
      console.log("\nUsage:")
      console.log("  bun run scripts/seed-dev.ts seed")
      console.log("  bun run scripts/seed-dev.ts clear")
      break
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
