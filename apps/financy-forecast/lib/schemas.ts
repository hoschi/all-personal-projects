import { z } from "zod";

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

/**
 * Category of an account.
 * - LIQUID: Liquid funds (checking account, savings).
 * - RETIREMENT: Retirement/investments (deposit, fixed-term), not counted for immediate liquidity.
 */
export enum AccountCategory {
    LIQUID = "LIQUID",
    RETIREMENT = "RETIREMENT",
}

/**
 * Payment interval for recurring items.
 */
export enum RecurringItemInterval {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
}

// Zod Schemas for Enums
export const accountCategorySchema = z.enum(Object.values(AccountCategory));
export const recurringItemIntervalSchema = z.enum(Object.values(RecurringItemInterval));

// -----------------------------------------------------------------------------
// Data Models
// -----------------------------------------------------------------------------

/**
 * A. Account
 * Represents a bank account or depot.
 */
export const accountSchema = z.object({
    /** Unique ID of the account (UUID) */
    id: z.uuid(),
    /** Name of the account (e.g. "Sparkasse") */
    name: z.string().min(1, "Name is required"),
    /** Category of the account (LIQUID or RETIREMENT) */
    category: accountCategorySchema,
    /** Current account balance in cents (Integer) for performance optimization */
    currentBalance: z.number().int(),
});

export type Account = z.infer<typeof accountSchema>;

/**
 * B. AssetSnapshot (Monthly Actuals)
 * Represents the status on the 1st of a month for past months.
 * Serves as history and basis for forecasts.
 */
export const assetSnapshotSchema = z.object({
    /** Unique ID of the snapshot (UUID) */
    id: z.uuid(),
    /** Date of the snapshot (Always the 1st of the month) */
    date: z.date(),
    /** Total liquidity in cents (Sum of all LIQUID accounts at snapshot time) */
    totalLiquidity: z.number().int(),
});

export type AssetSnapshot = z.infer<typeof assetSnapshotSchema>;

/**
 * C. AccountBalanceDetail
 * Junction table for the account balance within a snapshot.
 * Enables detailed breakdown of assets per month.
 */
export const accountBalanceDetailSchema = z.object({
    /** Unique ID of the detail (UUID) */
    id: z.uuid(),
    /** Reference to the snapshot (FK) */
    snapshotId: z.uuid(),
    /** Reference to the account (FK) */
    accountId: z.uuid(),
    /** Amount in cents (Integer) at that point in time */
    amount: z.number().int(),
});

export type AccountBalanceDetail = z.infer<typeof accountBalanceDetailSchema>;

/**
 * D. RecurringItem (Fixed Costs & Regular Income)
 * Definition of recurring payments like rent, salary, subscriptions.
 */
export const recurringItemSchema = z.object({
    /** Unique ID of the item (UUID) */
    id: z.uuid(),
    /** Name of the item (e.g. "Rent", "Salary") */
    name: z.string().min(1, "Name is required"),
    /** Amount in cents (Integer). Positive for income, negative for expenses. */
    amount: z.number().int(),
    /** Payment interval (MONTHLY, QUARTERLY, YEARLY) */
    interval: recurringItemIntervalSchema,
    /**
     * Due month (1-12).
     * Relevant for QUARTERLY (start month of quarter) and YEARLY (month of payment).
     * Can be ignored for MONTHLY.
     */
    dueMonth: z.number().int().min(1).max(12).optional().nullable(),
});

export type RecurringItem = z.infer<typeof recurringItemSchema>;

/**
 * E. ScenarioItem (Scenarios / One-time Payments)
 * One-time payments or planned scenarios for forecasting (e.g. "Vacation", "Tax refund").
 */
export const scenarioItemSchema = z.object({
    /** Unique ID of the scenario (UUID) */
    id: z.uuid(),
    /** Name of the scenario (e.g. "Summer Vacation") */
    name: z.string().min(1, "Name is required"),
    /** Amount in cents (Integer). Positive for income, negative for expenses. */
    amount: z.number().int(),
    /** Payment date. Scenarios are always assigned to a month. Required! */
    date: z.date(),
    /**
     * Status of the scenario.
     * If true, it's included in the forecast.
     * If false, it's ignored (inactive scenario).
     * Default: true.
     */
    isActive: z.boolean().default(true),
});

export type ScenarioItem = z.infer<typeof scenarioItemSchema>;

/**
 * F. Settings
 * Global settings for the application.
 */
export const settingsSchema = z.object({
    /** Estimated monthly variable costs in cents (Integer). Used for forecasting. */
    estimatedMonthlyVariableCosts: z.number().int(),
});

// Note: id is handled at database level with fixed UUID 00000000-0000-0000-0000-000000000000
export type Settings = z.infer<typeof settingsSchema>;

/**
 * SnapshotAccountBalances
 * Map of Account ID to Amount for a snapshot.
 * 
 */
export const snapshotAccountBalancesSchema = z.record(
    accountSchema.shape.id,
    accountBalanceDetailSchema.shape.amount
);

export type SnapshotAccountBalances = z.infer<typeof snapshotAccountBalancesSchema>;


/**
 * E. SnapshotDetails
 */
export const snapshotDetailsSchema = z.object({
    snapshot: assetSnapshotSchema,
    accountBalances: snapshotAccountBalancesSchema,
});

export type SnapshotDetails = z.infer<typeof snapshotDetailsSchema>;


export const forecastScenarioChanges = scenarioItemSchema.pick({ isActive: true, id: true })
export type ForecastScenarioChanges = z.infer<typeof forecastScenarioChanges>;

export const saveForecastSchema = z.object({
    variableCosts: settingsSchema.shape.estimatedMonthlyVariableCosts,
    scenarios: z.array(forecastScenarioChanges).default([])
})
export type SaveForecastSchema = z.infer<typeof saveForecastSchema>;
