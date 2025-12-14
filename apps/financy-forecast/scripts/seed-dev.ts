/**
 * FinanceForecast Development Seed Data Script
 * 
 * This script populates the database with realistic sample data for development:
 * - 5 different accounts (3 liquid, 2 retirement)
 * - 6 months of asset snapshots with balance details
 * - Recurring items (monthly, quarterly, yearly)
 * - Scenario items (one-time payments)
 * - Default settings
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.log('Please create a .env file with DATABASE_URL=postgresql://...');
    process.exit(1);
}

/**
 * Execute SQL command
 */
function executeSql(sql: string): void {
    try {
        // Use a temporary SQL file to avoid shell escaping issues
        const tempSqlFile = '/tmp/temp_seed_sql.sql';
        writeFileSync(tempSqlFile, `SET search_path TO financy_forecast, public; ${sql}`);
        execSync(`psql "${DATABASE_URL}" -f "${tempSqlFile}"`, {
            stdio: 'pipe',
            env: process.env
        });
        unlinkSync(tempSqlFile); // Clean up
    } catch (error) {
        console.error('❌ SQL execution failed:', sql);
        console.error('Error:', error);
        throw error;
    }
}

/**
 * Create sample accounts
 */
function seedAccounts(): void {
    console.log('🏦 Creating sample accounts...');

    const accountsSql = `
    INSERT INTO accounts (id, name, category, current_balance) VALUES
    (gen_random_uuid(), 'Sparkasse Girokonto', 'LIQUID', 125000),  -- 1,250.00 €
    (gen_random_uuid(), 'ING DiBa Tagesgeld', 'LIQUID', 450000),   -- 4,500.00 €
    (gen_random_uuid(), 'Comdirect Depot', 'RETIREMENT', 12500000), -- 125,000.00 €
    (gen_random_uuid(), 'DAX ETF Fond', 'RETIREMENT', 8750000),    -- 87,500.00 €
    (gen_random_uuid(), 'PayPal Guthaben', 'LIQUID', 8900)         -- 89.00 €
    ON CONFLICT DO NOTHING;
  `;

    executeSql(accountsSql);
    console.log('✅ Sample accounts created');
}

/**
 * Get account IDs for reference
 */
function getAccountIds(): { [name: string]: string } {
    try {
        const result = execSync(`psql "${DATABASE_URL}" -t -c "SET search_path TO financy_forecast, public; SELECT name, id FROM accounts ORDER BY name;"`, {
            encoding: 'utf8',
            env: process.env
        }).trim();

        const accounts: { [name: string]: string } = {};
        const lines = result.split('\n');

        lines.forEach(line => {
            const [name, id] = line.trim().split('|');
            if (name && id) {
                accounts[name.trim()] = id.trim();
            }
        });

        return accounts;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        throw new Error('Failed to fetch account IDs');
    }
}

/**
 * Generate date strings for the last 6 months from current date
 */
function getLastSixMonthsDates(): string[] {
    const dates: string[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (0 = January)

    // Generate dates for the last 6 months, ending with current month
    for (let i = 5; i >= 0; i--) {
        const targetMonth = currentMonth - i;
        const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedMonth = targetMonth < 0 ? targetMonth + 12 : targetMonth;
        const dateStr = `${targetYear}-${String(adjustedMonth + 1).padStart(2, '0')}-01`;
        dates.push(dateStr);
    }

    return dates;
}

/**
 * Create sample asset snapshots and balance details for the last 6 months
 */
function seedAssetSnapshots(): void {
    console.log('📅 Creating 6 months of asset snapshots...');

    const accountIds = getAccountIds();
    const dates = getLastSixMonthsDates();

    console.log(`🗓️  Generated dates (last 6 months): ${dates.join(', ')}`);

    // Generate realistic balance progression with some variation
    const baseBalances = {
        'Sparkasse Girokonto': 125000,    // 1,250.00 € (current)
        'ING DiBa Tagesgeld': 450000,     // 4,500.00 € (current)
        'Comdirect Depot': 12500000,      // 125,000.00 € (current)
        'DAX ETF Fond': 8750000,          // 87,500.00 € (current)
        'PayPal Guthaben': 8900           // 89.00 € (current)
    };

    // Generate monthly progression backwards from current month
    const monthlyBalances = dates.map((date, index) => {
        const monthsBack = 5 - index;
        const variation = Math.random() * 0.2 - 0.1; // ±10% variation

        return {
            date,
            balances: {
                'Sparkasse Girokonto': Math.round(baseBalances['Sparkasse Girokonto'] * (1 + variation + (monthsBack * 0.05))),
                'ING DiBa Tagesgeld': Math.round(baseBalances['ING DiBa Tagesgeld'] * (1 + variation + (monthsBack * 0.02))),
                'Comdirect Depot': Math.round(baseBalances['Comdirect Depot'] * (1 + variation + (monthsBack * 0.03))),
                'DAX ETF Fond': Math.round(baseBalances['DAX ETF Fond'] * (1 + variation + (monthsBack * 0.04))),
                'PayPal Guthaben': Math.round(baseBalances['PayPal Guthaben'] * (1 + variation + (monthsBack * 0.1)))
            }
        };
    });

    monthlyBalances.forEach(month => {
        const totalLiquidity = Object.entries(month.balances)
            .filter(([accountName]) => accountName !== 'Comdirect Depot' && accountName !== 'DAX ETF Fond')
            .reduce((sum, [, balance]) => sum + balance, 0);

        // Insert asset snapshot
        const snapshotSql = `
      INSERT INTO asset_snapshots (id, date, total_liquidity)
      VALUES (gen_random_uuid(), '${month.date}', ${totalLiquidity})
      ON CONFLICT DO NOTHING;
    `;

        executeSql(snapshotSql);

        // Get the snapshot ID
        const snapshotIdResult = execSync(`psql "${DATABASE_URL}" -t -c "SET search_path TO financy_forecast, public; SELECT id FROM asset_snapshots WHERE date = '${month.date}';"`, {
            encoding: 'utf8',
            env: process.env
        }).trim();

        const snapshotId = snapshotIdResult.split('|')[0]?.trim();

        if (snapshotId) {
            // Insert balance details for each account
            console.log(`💰 Creating balance details for snapshot ${snapshotId} (${month.date})...`);
            Object.entries(month.balances).forEach(([accountName, balance]) => {
                const accountId = accountIds[accountName];
                if (accountId) {
                    const detailSql = `
            INSERT INTO account_balance_details (id, snapshot_id, account_id, amount)
            VALUES (gen_random_uuid(), '${snapshotId}', '${accountId}', ${balance})
          `;
                    executeSql(detailSql);
                    console.log(`  ✅ ${accountName}: ${balance} cents`);
                }
            });
        } else {
            console.warn(`⚠️  Could not find snapshot ID for date ${month.date}`);
        }
    });

    console.log('✅ Asset snapshots and balance details created');
}

/**
 * Create sample recurring items (Fixkosten & Einnahmen)
 */
function seedRecurringItems(): void {
    console.log('🔄 Creating recurring items...');

    const recurringItemsSql = `
    -- Monatliche Fixkosten (negativ)
    INSERT INTO recurring_items (id, name, amount, interval, due_month) VALUES
    (gen_random_uuid(), 'Miete', -120000, 'MONTHLY', NULL),           -- -1,200.00 €
    (gen_random_uuid(), 'Strom & Gas', -8500, 'MONTHLY', NULL),       -- -85.00 €
    (gen_random_uuid(), 'Internet & Telefon', -4500, 'MONTHLY', NULL), -- -45.00 €
    (gen_random_uuid(), 'Versicherungen', -12500, 'MONTHLY', NULL),   -- -125.00 €
    (gen_random_uuid(), 'Supermarkt', -35000, 'MONTHLY', NULL),       -- -350.00 €
    (gen_random_uuid(), 'Öffentliche Verkehrsmittel', -8900, 'MONTHLY', NULL), -- -89.00 €
    
    -- Quartalsweise Kosten
    (gen_random_uuid(), 'Kfz-Steuer', -3000, 'QUARTERLY', 1),         -- -30.00 € (Jan, Apr, Jul, Okt)
    (gen_random_uuid(), 'Betriebskosten', -4500, 'QUARTERLY', 4),     -- -45.00 € (Apr, Jul, Okt, Jan)
    
    -- Jährliche Kosten
    (gen_random_uuid(), 'Kfz-Versicherung', -48000, 'YEARLY', 6),     -- -480.00 € (Juni)
    (gen_random_uuid(), 'Hausratversicherung', -12000, 'YEARLY', 9),  -- -120.00 € (September)
    (gen_random_uuid(), 'Krankenkasse', -25000, 'YEARLY', 1),         -- -250.00 € (Januar)
    
    -- Monatliche Einnahmen (positiv)
    (gen_random_uuid(), 'Gehalt', 320000, 'MONTHLY', NULL),           -- 3,200.00 €
    (gen_random_uuid(), 'Nebeneinkommen', 45000, 'MONTHLY', NULL),    -- 450.00 €
    
    -- Quartalsweise Einnahmen
    (gen_random_uuid(), 'Steuerrückzahlung', 250000, 'QUARTERLY', 4), -- 2,500.00 € (April)
    
    -- Jährliche Einnahmen
    (gen_random_uuid(), 'Urlaubsgeld', 150000, 'YEARLY', 6),          -- 1,500.00 € (Juni)
    (gen_random_uuid(), 'Weihnachtsgeld', 200000, 'YEARLY', 11)       -- 2,000.00 € (November)
    ON CONFLICT DO NOTHING;
  `;

    executeSql(recurringItemsSql);
    console.log('✅ Recurring items created');
}

/**
 * Create sample scenario items (Szenarien/Einmalzahlungen)
 */
function seedScenarioItems(): void {
    console.log('🎯 Creating scenario items...');

    const currentYear = new Date().getFullYear();

    const scenarioItemsSql = `
    -- 2025 Szenarien
    INSERT INTO scenario_items (id, name, amount, date, is_active) VALUES
    (gen_random_uuid(), 'MacBook Pro Kauf', -250000, '${currentYear}-10-15', true),     -- -2,500.00 €
    (gen_random_uuid(), 'Urlaub Spanien', -180000, '${currentYear}-07-20', true),       -- -1,800.00 €
    (gen_random_uuid(), 'Neue Winterreifen', -60000, '${currentYear}-11-01', true),     -- -600.00 €
    (gen_random_uuid(), 'Geschenke Weihnachten', -50000, '${currentYear}-12-20', true), -- -500.00 €
    
    -- 2026 Szenarien
    (gen_random_uuid(), 'Wohnung renovieren', -500000, '${currentYear + 1}-03-01', true), -- -5,000.00 €
    (gen_random_uuid(), 'Urlaub Japan', -350000, '${currentYear + 1}-08-15', true),       -- -3,500.00 €
    (gen_random_uuid(), 'Neues Auto', -3500000, '${currentYear + 1}-09-01', true),        -- -35,000.00 €
    (gen_random_uuid(), 'Aktiengewinn', 150000, '${currentYear + 1}-12-01', true),        -- 1,500.00 €
    
    -- Inaktive Szenarien (zeigen Funktionalität)
    (gen_random_uuid(), 'Laptop kaputt (inaktiv)', -80000, '${currentYear}-08-10', false),
    (gen_random_uuid(), 'Konzertkarten (inaktiv)', -25000, '${currentYear}-11-15', false)
    ON CONFLICT DO NOTHING;
  `;

    executeSql(scenarioItemsSql);
    console.log('✅ Scenario items created');
}

/**
 * Create default settings
 */
function seedSettings(): void {
    console.log('⚙️  Creating default settings...');

    const settingsSql = `
    INSERT INTO settings (id, estimated_monthly_variable_costs)
    VALUES ('00000000-0000-0000-0000-000000000000', 120000)  -- 1,200.00 € variable costs
    ON CONFLICT (id) DO UPDATE SET 
      estimated_monthly_variable_costs = EXCLUDED.estimated_monthly_variable_costs,
      updated_at = CURRENT_TIMESTAMP;
  `;

    executeSql(settingsSql);
    console.log('✅ Settings created');
}

/**
 * Get the latest snapshot date (dynamically generated)
 */
function getLatestSnapshotDate(): string {
    const dates = getLastSixMonthsDates();
    return dates[dates.length - 1]; // Last date is the most recent
}

/**
 * Update current balances in accounts table
 */
function updateCurrentBalances(): void {
    console.log('💰 Updating current account balances...');

    const accountIds = getAccountIds();

    // Get the latest snapshot balances dynamically
    const latestDate = getLatestSnapshotDate();

    Object.entries(accountIds).forEach(([accountName, accountId]) => {
        const balanceSql = `
      SELECT abd.amount 
      FROM account_balance_details abd
      JOIN asset_snapshots s ON abd.snapshot_id = s.id
      WHERE abd.account_id = '${accountId}' AND s.date = '${latestDate}';
    `;

        try {
            const balanceResult = execSync(`psql "${DATABASE_URL}" -t -c "SET search_path TO financy_forecast, public; ${balanceSql}"`, {
                encoding: 'utf8',
                env: process.env
            }).trim();

            const balance = parseInt(balanceResult.split('|')[0]?.trim() || '0');

            if (balance > 0) {
                const updateSql = `
          UPDATE accounts 
          SET current_balance = ${balance}, updated_at = CURRENT_TIMESTAMP
          WHERE id = '${accountId}';
        `;
                executeSql(updateSql);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            console.warn(`⚠️  Could not update balance for ${accountName}`);
        }
    });

    console.log('✅ Current account balances updated');
}

/**
 * Main seed function
 */
function seedDatabase(): void {
    console.log('🌱 Starting FinanceForecast development seed...');
    console.log('==============================================');

    try {
        // Test connection
        executeSql('SELECT 1');
        console.log('✅ Database connection successful\n');

        // Seed data in order
        seedAccounts();
        seedAssetSnapshots();
        seedRecurringItems();
        seedScenarioItems();
        seedSettings();
        updateCurrentBalances();

        console.log('\n🎉 Development seed completed successfully!');
        console.log('\n📊 Summary:');
        console.log('  🏦 5 Accounts (3 liquid, 2 retirement)');
        console.log('  📅 6 Months of historical/projected data');
        console.log('  🔄 15 Recurring items (monthly, quarterly, yearly)');
        console.log('  🎯 9 Scenario items (active & inactive)');
        console.log('  ⚙️  Default settings configured');
        console.log('\n💡 You can now start developing with realistic sample data!');

    } catch (error) {
        console.error('\n💥 Seed failed:', error);
        process.exit(1);
    }
}

/**
 * Clear all development data
 */
function clearSeedData(): void {
    console.log('🧹 Clearing development seed data...');

    try {
        executeSql('DELETE FROM account_balance_details;');
        executeSql('DELETE FROM asset_snapshots;');
        executeSql('DELETE FROM scenario_items;');
        executeSql('DELETE FROM recurring_items;');
        executeSql('DELETE FROM accounts;');
        executeSql('UPDATE settings SET estimated_monthly_variable_costs = 0;');

        console.log('✅ Development data cleared');
    } catch (error) {
        console.error('❌ Failed to clear data:', error);
        throw error;
    }
}

/**
 * Main execution
 */
function main(): void {
    const args = process.argv.slice(2);
    const command = args[0] || 'seed';

    switch (command) {
        case 'seed':
            seedDatabase();
            break;
        case 'clear':
            clearSeedData();
            break;
        default:
            console.log('❓ Available commands:');
            console.log('  seed  - Populate database with sample data (default)');
            console.log('  clear - Remove all sample data');
            console.log('\nUsage:');
            console.log('  npx tsx scripts/seed-dev.ts seed');
            console.log('  npx tsx scripts/seed-dev.ts clear');
            break;
    }
}

// Run if called directly
if (require.main === module) {
    main();
}