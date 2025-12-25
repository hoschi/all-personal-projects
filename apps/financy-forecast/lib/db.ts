'use server'

import postgres from 'postgres';
import { Option } from 'effect';
import {
    Account,
    AccountCategory,
    AccountBalanceDetail,
    AssetSnapshot,
    RecurringItem,
    RecurringItemInterval,
    ScenarioItem,
    Settings,
    SnapshotDetails,
    ForecastScenarioChanges
} from './schemas';
import * as dotenv from 'dotenv';

let sql: ReturnType<typeof postgres>
async function getDb() {
    if (!sql) {
        dotenv.config({ quiet: true });
        sql = postgres(process.env.DATABASE_URL!, {
            connect_timeout: 10,
            max: 10,
            idle_timeout: 30,          // close idle Connections after 30s schließen
            max_lifetime: 60 * 60,     // Max 1h pro Connection
            backoff: (attempt) => {    // Retry-Strategy
                return Math.min(1000 * Math.pow(2, attempt), 30000);
            },
        });
    }
    return sql;
}

sql = await getDb();

// Wrapper function to ensure schema is set before each query
export async function executeWithSchema<T>(queryFn: (sql: ReturnType<typeof postgres>) => Promise<T>): Promise<T> {
    const db = await getDb();
    // Set the search path to financy_forecast schema
    await db`SET search_path TO financy_forecast;`;
    return queryFn(db);
}

// Database connection test
export async function testConnection(): Promise<boolean> {
    try {
        await executeWithSchema(async (db) => await db`SELECT 1`);
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// ============================================================================
// Account Operations (Kontenverwaltung)
// ============================================================================

/**
 * Get all accounts with their current balances
 */
export async function getAccounts(): Promise<Account[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<Account[]>`
      SELECT id, name, category, current_balance as "currentBalance"
      FROM accounts
      ORDER BY name ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to fetch accounts');
    }
}

/**
 * Get account by ID using Option
 */
export async function getAccountById(id: string): Promise<Option.Option<Account>> {
    try {
        const result = await executeWithSchema(async (db) => await db<Account[]>`
      SELECT id, name, category, current_balance as "currentBalance"
      FROM accounts
      WHERE id = ${id}
    `);
        return Option.fromNullable(result[0]);
    } catch (error) {
        console.error('Error fetching account:', error);
        throw new Error('Failed to fetch account');
    }
}

/**
 * Create new account
 */
export async function createAccount(
    name: string,
    category: AccountCategory,
    currentBalance: number
): Promise<Account> {
    try {
        const result = await executeWithSchema(async (db) => await db<Account[]>`
      INSERT INTO accounts (id, name, category, current_balance)
      VALUES (gen_random_uuid(), ${name}, ${category}, ${currentBalance})
      RETURNING id, name, category, current_balance as "currentBalance"
    `);
        return result[0];
    } catch (error) {
        console.error('Error creating account:', error);
        throw new Error('Failed to create account');
    }
}

/**
 * Delete account (only if no balance details exist)
 */
export async function deleteAccount(id: string): Promise<boolean> {
    try {
        // Check if account has balance details
        const balanceCount = await executeWithSchema(async (db) => await db<{ count: number }[]>`
      SELECT COUNT(*) as count
      FROM account_balance_details
      WHERE account_id = ${id}
    `);

        if (balanceCount[0].count > 0) {
            throw new Error('Cannot delete account with existing balance history');
        }

        const result = await executeWithSchema(async (db) => await db`
      DELETE FROM accounts 
      WHERE id = ${id}
    `);

        return result.count > 0;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

// ============================================================================
// AssetSnapshot Operations (Monatliche Ist-Stände)
// ============================================================================

/**
 * Get all asset snapshots ordered by date
 */
export async function getAssetSnapshots(): Promise<AssetSnapshot[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<AssetSnapshot[]>`
      SELECT id, date, total_liquidity as "totalLiquidity"
      FROM asset_snapshots
      ORDER BY date ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching asset snapshots:', error);
        throw new Error('Failed to fetch asset snapshots');
    }
}

/**
 * Get latest asset snapshot using Option
 */
export async function getLatestAssetSnapshot(): Promise<Option.Option<AssetSnapshot>> {
    try {
        const result = await executeWithSchema(async (db) => await db<AssetSnapshot[]>`
      SELECT id, date, total_liquidity as "totalLiquidity"
      FROM asset_snapshots
      ORDER BY date DESC
      LIMIT 1
    `);
        return Option.fromNullable(result[0]);
    } catch (error) {
        console.error('Error fetching latest asset snapshot:', error);
        throw new Error('Failed to fetch latest asset snapshot');
    }
}

/**
 * Create new asset snapshot (legacy function - still available for explicit date usage)
 */
export async function createAssetSnapshot(
    date: Date,
    totalLiquidity: number
): Promise<AssetSnapshot> {
    try {
        const result = await executeWithSchema(async (db) => await db<AssetSnapshot[]>`
      INSERT INTO asset_snapshots (id, date, total_liquidity)
      VALUES (gen_random_uuid(), ${date}, ${totalLiquidity})
      RETURNING id, date, total_liquidity as "totalLiquidity"
    `);
        return result[0];
    } catch (error) {
        console.error('Error creating asset snapshot:', error);
        throw new Error('Failed to create asset snapshot');
    }
}

/**
 * Delete asset snapshot and all associated balance details
 */
export async function deleteAssetSnapshot(id: string): Promise<boolean> {
    try {
        // Delete associated balance details first
        await executeWithSchema(async (db) => await db`
      DELETE FROM account_balance_details 
      WHERE snapshot_id = ${id}
    `);

        // Delete the snapshot
        const result = await executeWithSchema(async (db) => await db`
      DELETE FROM asset_snapshots 
      WHERE id = ${id}
    `);

        return result.count > 0;
    } catch (error) {
        console.error('Error deleting asset snapshot:', error);
        throw error;
    }
}

/**
 * Get snapshot details with account balances for the last N months
 * @param limit Number of months to fetch from the current date backwards
 * @returns Option containing array of SnapshotDetails with snapshot data and account balance mappings
 */
export async function getSnapshotDetails(limit: number): Promise<Option.Option<SnapshotDetails[]>> {
    try {
        // Get the most recent snapshots with limit
        const snapshots = await executeWithSchema(async (db) => await db<AssetSnapshot[]>`
      SELECT id, date, total_liquidity as "totalLiquidity"
      FROM asset_snapshots
      ORDER BY date DESC
      LIMIT ${limit}
    `);

        if (snapshots.length === 0) {
            return Option.none();
        }

        // For each snapshot, get its balance details
        const snapshotDetails: SnapshotDetails[] = [];

        for (const snapshot of snapshots) {
            const balanceDetails = await executeWithSchema(async (db) => await db<AccountBalanceDetail[]>`
        SELECT id, snapshot_id as "snapshotId", account_id as "accountId", amount
        FROM account_balance_details
        WHERE snapshot_id = ${snapshot.id}
        ORDER BY account_id ASC
      `);

            // Create account balance mapping for this snapshot
            const accountBalances: Record<string, number> = {};
            for (const detail of balanceDetails) {
                accountBalances[detail.accountId] = detail.amount;
            }

            snapshotDetails.push({
                snapshot,
                accountBalances
            });
        }

        return Option.some(snapshotDetails);
    } catch (error) {
        console.error('Error fetching snapshot details:', error);
        throw new Error('Failed to fetch snapshot details');
    }
}

// ============================================================================
// AccountBalanceDetail Operations (Verknüpfung zwischen Snapshots und Accounts)
// ============================================================================

/**
 * Get balance details for a specific snapshot
 */
export async function getBalanceDetailsBySnapshotId(snapshotId: string): Promise<AccountBalanceDetail[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<AccountBalanceDetail[]>`
      SELECT id, snapshot_id as "snapshotId", account_id as "accountId", amount
      FROM account_balance_details
      WHERE snapshot_id = ${snapshotId}
    `);
        return result;
    } catch (error) {
        console.error('Error fetching balance details:', error);
        throw new Error('Failed to fetch balance details');
    }
}

/**
 * Create balance details for all accounts in a snapshot
 */
export async function createBalanceDetailsForSnapshot(
    snapshotId: string,
    accountBalances: { accountId: string; amount: number }[]
): Promise<AccountBalanceDetail[]> {
    try {
        const details = accountBalances.map(({ accountId, amount }) => ({
            snapshotId,
            accountId,
            amount
        }));

        // Create bulk insert using individual inserts for better compatibility
        const results: AccountBalanceDetail[] = [];

        for (const detail of details) {
            const result = await executeWithSchema(async (db) => await db<AccountBalanceDetail[]>`
                INSERT INTO account_balance_details (id, snapshot_id, account_id, amount)
                VALUES (gen_random_uuid(), ${detail.snapshotId}::uuid, ${detail.accountId}::uuid, ${detail.amount})
                RETURNING id, snapshot_id as "snapshotId", account_id as "accountId", amount
            `);
            results.push(result[0]);
        }

        return results;
    } catch (error) {
        console.error('Error creating balance details:', error);
        throw new Error('Failed to create balance details');
    }
}

// ============================================================================
// RecurringItem Operations (Fixkosten & Regelmäßige Einnahmen)
// ============================================================================

/**
 * Get all recurring items
 */
export async function getRecurringItems(): Promise<RecurringItem[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<RecurringItem[]>`
      SELECT id, name, amount, interval, due_month as "dueMonth"
      FROM recurring_items
      ORDER BY name ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching recurring items:', error);
        throw new Error('Failed to fetch recurring items');
    }
}

/**
 * Get recurring items by interval
 */
export async function getRecurringItemsByInterval(interval: RecurringItemInterval): Promise<RecurringItem[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<RecurringItem[]>`
      SELECT id, name, amount, interval, due_month as "dueMonth"
      FROM recurring_items
      WHERE interval = ${interval}
      ORDER BY name ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching recurring items by interval:', error);
        throw new Error('Failed to fetch recurring items by interval');
    }
}

/**
 * Create new recurring item
 */
export async function createRecurringItem(
    name: string,
    amount: number,
    interval: RecurringItemInterval,
    dueMonth?: number
): Promise<RecurringItem> {
    try {
        // Handle undefined dueMonth properly
        const dueMonthValue = dueMonth ?? null;

        const result = await executeWithSchema(async (db) => await db<RecurringItem[]>`
      INSERT INTO recurring_items (id, name, amount, interval, due_month)
      VALUES (gen_random_uuid(), ${name}, ${amount}, ${interval}, ${dueMonthValue})
      RETURNING id, name, amount, interval, due_month as "dueMonth"
    `);
        return result[0];
    } catch (error) {
        console.error('Error creating recurring item:', error);
        throw new Error('Failed to create recurring item');
    }
}

/**
 * Delete recurring item
 */
export async function deleteRecurringItem(id: string): Promise<boolean> {
    try {
        const result = await executeWithSchema(async (db) => await db`
      DELETE FROM recurring_items 
      WHERE id = ${id}
    `);
        return result.count > 0;
    } catch (error) {
        console.error('Error deleting recurring item:', error);
        throw error;
    }
}

// ============================================================================
// ScenarioItem Operations (Szenarien / Einmalzahlungen)
// ============================================================================

/**
 * Get all scenario items
 */
export async function getScenarioItems(): Promise<ScenarioItem[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      SELECT id, name, amount, date, is_active as "isActive"
      FROM scenario_items
      ORDER BY date ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching scenario items:', error);
        throw new Error('Failed to fetch scenario items');
    }
}

/**
 * Get active scenario items
 */
export async function getActiveScenarioItems(): Promise<ScenarioItem[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      SELECT id, name, amount, date, is_active as "isActive"
      FROM scenario_items
      WHERE is_active = true
      ORDER BY date ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching active scenario items:', error);
        throw new Error('Failed to fetch active scenario items');
    }
}

/**
 * Get scenario items by date range
 */
export async function getScenarioItemsByDateRange(
    startDate: Date,
    endDate: Date
): Promise<ScenarioItem[]> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      SELECT id, name, amount, date, is_active as "isActive"
      FROM scenario_items
      WHERE date >= ${startDate} AND date <= ${endDate}
      ORDER BY date ASC
    `);
        return result;
    } catch (error) {
        console.error('Error fetching scenario items by date range:', error);
        throw new Error('Failed to fetch scenario items by date range');
    }
}

/**
 * Create new scenario item
 */
export async function createScenarioItem(
    name: string,
    amount: number,
    date: Date,
    isActive: boolean = true
): Promise<ScenarioItem> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      INSERT INTO scenario_items (id, name, amount, date, is_active)
      VALUES (gen_random_uuid(), ${name}, ${amount}, ${date}, ${isActive})
      RETURNING id, name, amount, date, is_active as "isActive"
    `);
        return result[0];
    } catch (error) {
        console.error('Error creating scenario item:', error);
        throw new Error('Failed to create scenario item');
    }
}

/**
 * Update scenario item
 */
export async function updateForcastScenario(data: ForecastScenarioChanges): Promise<undefined> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      UPDATE scenario_items 
      SET is_active = ${data.isActive},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${data.id}
      RETURNING id
    `);

        if (!result[0]) {
            throw new Error('Scenario item not found');
        }
        return;
    } catch (error) {
        console.error('Error updating scenario item:', error);
        throw new Error('Failed to update scenario item');
    }
}

/**
 * Update scenario item isActive status only
 */
export async function updateScenarioIsActive(id: string, isActive: boolean): Promise<ScenarioItem> {
    try {
        const result = await executeWithSchema(async (db) => await db<ScenarioItem[]>`
      UPDATE scenario_items
      SET is_active = ${isActive},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, amount, date, is_active as "isActive"
    `);

        if (!result[0]) {
            throw new Error('Scenario item not found');
        }
        return result[0];
    } catch (error) {
        console.error('Error updating scenario item isActive:', error);
        throw new Error('Failed to update scenario item isActive');
    }
}

/**
 * Delete scenario item
 */
export async function deleteScenarioItem(id: string): Promise<boolean> {
    try {
        const result = await executeWithSchema(async (db) => await db`
      DELETE FROM scenario_items 
      WHERE id = ${id}
    `);
        return result.count > 0;
    } catch (error) {
        console.error('Error deleting scenario item:', error);
        throw error;
    }
}

// ============================================================================
// Settings Operations (Globale Einstellungen)
// ============================================================================

/**
 * Get settings (singleton) using Option
 */
export async function getSettings(): Promise<Option.Option<Settings>> {
    try {
        const result = await executeWithSchema(async (db) => await db<Settings[]>`
      SELECT estimated_monthly_variable_costs as "estimatedMonthlyVariableCosts"
      FROM settings
      LIMIT 1
    `);
        return Option.fromNullable(result[0]);
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw new Error('Failed to fetch settings');
    }
}

/**
 * Change settings singleton!
 */
export async function changeSettings(data: Settings): Promise<Settings> {
    try {
        const result = await executeWithSchema(async (db) => await db<Settings[]>`
      UPDATE settings 
      SET estimated_monthly_variable_costs = ${data.estimatedMonthlyVariableCosts},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = '00000000-0000-0000-0000-000000000000'
      RETURNING estimated_monthly_variable_costs as "estimatedMonthlyVariableCosts"
    `);
        return result[0];
    } catch (error) {
        console.error('Error upserting settings:', error);
        throw new Error('Failed to upsert settings');
    }
}

// ============================================================================
// Close database connection
// ============================================================================

export async function closeConnection(): Promise<void> {
    try {
        await sql.end();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
    }
}