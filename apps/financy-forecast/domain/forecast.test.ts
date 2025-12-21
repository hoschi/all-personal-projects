import { test, expect, mock } from "bun:test";
import { RecurringItemInterval, RecurringItem, ScenarioItem } from "@/lib/schemas";
import { TimelineMonth } from "@/lib/types";
import { calculateTimeline, calculateMonthlyBurn } from "./forecast";

// Test date constant to ensure consistent testing
const TEST_DATE = new Date("2025-01-15T10:30:00Z");

// Mock date-fns functions for consistent testing
mock.module("date-fns", () => ({
    addMonths: (date: Date, months: number) => {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    },
    startOfMonth: (date: Date) => {
        const result = new Date(date);
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        return result;
    },
    isAfter: (date1: Date, date2: Date) => date1 > date2,
    isEqual: (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    },
    format: (date: Date, formatStr: string) => {
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        if (formatStr === "yy-MM") {
            return `${year}-${month}`;
        }
        return date.toISOString().split('T')[0]; // fallback
    }
}));

// Factory Functions for Test Data
const createRecurringItem = (overrides: Partial<RecurringItem> = {}): RecurringItem => ({
    id: "test-recurring-id",
    name: "Test Recurring Item",
    amount: -50000, // -500.00€ in Cents
    interval: RecurringItemInterval.MONTHLY,
    dueMonth: 1,
    ...overrides
});

const createScenarioItem = (overrides: Partial<ScenarioItem> = {}): ScenarioItem => ({
    id: "test-scenario-id",
    name: "Test Scenario",
    amount: -100000, // -1000.00€ in Cents
    date: new Date("2025-03-15"),
    isActive: true,
    ...overrides
});

// =============================================================================
// calculateTimeline Tests
// =============================================================================

test("calculateTimeline - should return empty array when monthCount is 0", () => {
    const result = calculateTimeline(
        0,
        100000, // 1000.00€ variable costs
        500000, // 5000.00€ start balance
        [],
        [],
        TEST_DATE
    );

    expect(result).toEqual([]);
});

test("calculateTimeline - should handle empty recurringItems and scenarios arrays", () => {
    const result = calculateTimeline(
        3,
        100000, // 1000.00€ variable costs
        500000, // 5000.00€ start balance
        [],
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(3);
    // Da das TEST_DATE 2025-01-15 ist, beginnt die Prognose mit 2025-02
    expect(result[0]).toMatchObject({
        index: 0,
        name: "25-02", // Februar 2025 (erster Prognosemonat)
        balance: 400000, // 5000 - 1000
        scenarios: [],
        irregularCosts: [],
        isCritical: false
    });
});

test("calculateTimeline - should calculate monthly income and expenses correctly", () => {
    const recurringItems = [
        createRecurringItem({ amount: 300000, interval: RecurringItemInterval.MONTHLY }), // +3000€
        createRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€
    ];

    const result = calculateTimeline(
        2,
        100000, // 1000€ variable costs
        500000, // 5000€ start balance
        recurringItems,
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(2);

    // Month 0: 5000 + 3000 - 800 - 1000 = 6200€
    expect(result[0].balance).toBe(620000);
    expect(result[0].isCritical).toBe(false);

    // Month 1: 6200 + 3000 - 800 - 1000 = 7400€
    expect(result[1].balance).toBe(740000);
    expect(result[1].isCritical).toBe(false);
});

test("calculateTimeline - should handle quarterly recurring items correctly", () => {
    const recurringItems = [
        createRecurringItem({
            amount: -150000, // -1500€
            interval: RecurringItemInterval.QUARTERLY,
            dueMonth: 3 // March quarterly (Mar, Jun, Sep, Dec)
        }),
    ];

    const result = calculateTimeline(
        12, // 12 months to see multiple quarters
        100000, // 1000€ variable costs
        500000, // 5000€ start balance
        recurringItems,
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(12);

    // Quarterly cost with dueMonth=3 (Mar) should appear in: Mar, Jun, Sep, Dec
    // Since TEST_DATE is Jan 15, 2025, forecast starts Feb 2025
    // Expected: Mar(1), Jun(4), Sep(7), Dec(10)
    expect(result[0].irregularCosts).toHaveLength(0); // Feb 2025
    expect(result[1].irregularCosts).toHaveLength(1); // Mar 2025 ✓
    expect(result[4].irregularCosts).toHaveLength(1); // Jun 2025 ✓
    expect(result[7].irregularCosts).toHaveLength(1); // Sep 2025 ✓
    expect(result[10].irregularCosts).toHaveLength(1); // Dec 2025 ✓
});

test("calculateTimeline - should handle yearly recurring items correctly", () => {
    const recurringItems = [
        createRecurringItem({
            amount: -200000, // -2000€
            interval: RecurringItemInterval.YEARLY,
            dueMonth: 6 // June yearly
        }),
    ];

    const result = calculateTimeline(
        24, // 24 months to see multiple years
        100000, // 1000€ variable costs
        500000, // 5000€ start balance
        recurringItems,
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(24);

    // Yearly cost with dueMonth=6 should only appear in June
    // Forecast starts Feb 2025, so we expect: Jun 2025 (index 4), Jun 2026 (index 16)
    expect(result[0].irregularCosts).toHaveLength(0); // Feb 2025
    expect(result[4].irregularCosts).toHaveLength(1); // Jun 2025 ✓
    expect(result[15].irregularCosts).toHaveLength(0); // May 2026
    expect(result[16].irregularCosts).toHaveLength(1); // Jun 2026 ✓
    expect(result[23].irregularCosts).toHaveLength(0); // Jan 2027
});

test("calculateTimeline - should show all scenarios but calculate only active ones", () => {
    const scenarios = [
        createScenarioItem({
            date: new Date("2025-02-15"),
            isActive: true,
            amount: -50000 // -500€
        }),
        createScenarioItem({
            date: new Date("2025-03-15"),
            isActive: false, // Should be shown but not calculated
            amount: -75000
        }),
        createScenarioItem({
            date: new Date("2025-04-15"),
            isActive: true,
            amount: -100000 // -1000€
        }),
    ];

    const result = calculateTimeline(
        3,
        100000, // 1000€ variable costs
        500000, // 5000€ start balance
        [],
        scenarios,
        TEST_DATE
    );

    expect(result).toHaveLength(3);

    // ALL scenarios should be shown (new behavior)
    expect(result[0].scenarios).toHaveLength(1); // Feb 2025 matches Feb 15 scenario
    expect(result[1].scenarios).toHaveLength(1); // Mar 2025 shows inactive scenario
    expect(result[2].scenarios).toHaveLength(1); // Apr 2025 matches Apr 15 scenario

    // But calculation should only use active scenarios
    // Feb: +5000 -1000 -500 = 3500€
    expect(result[0].balance).toBe(350000);

    // Mar: 3500 -1000 = 2500€ (inactive scenario not calculated)
    expect(result[1].balance).toBe(250000);

    // Apr: 2500 -1000 -1000 = 500€ (both active scenarios calculated)
    expect(result[2].balance).toBe(50000);
});

test("calculateTimeline - should mark months as critical when balance is negative", () => {
    const result = calculateTimeline(
        5,
        200000, // 2000€ variable costs (high costs)
        100000, // 1000€ start balance (low balance)
        [],
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(5);

    // First few months should be critical
    expect(result[0].isCritical).toBe(true);
    expect(result[0].balance).toBe(-100000); // 1000 - 2000

    // All months should be critical with negative balance
    result.forEach((month: TimelineMonth) => {
        expect(month.isCritical).toBe(true);
        expect(month.balance).toBeLessThan(0);
    });
});

test("calculateTimeline - should calculate complex scenario with all features", () => {
    const recurringItems = [
        createRecurringItem({
            name: "Salary",
            amount: 400000, // +4000€
            interval: RecurringItemInterval.MONTHLY
        }),
        createRecurringItem({
            name: "Rent",
            amount: -120000, // -1200€
            interval: RecurringItemInterval.MONTHLY
        }),
        createRecurringItem({
            name: "Insurance",
            amount: -30000, // -300€
            interval: RecurringItemInterval.QUARTERLY,
            dueMonth: 3 // March quarterly (Mar, Jun, Sep, Dec)
        }),
        createRecurringItem({
            name: "Tax",
            amount: -50000, // -500€
            interval: RecurringItemInterval.YEARLY,
            dueMonth: 6 // June yearly
        }),
    ];

    const scenarios = [
        createScenarioItem({
            name: "Vacation",
            date: new Date("2025-07-15"),
            amount: -200000, // -2000€
            isActive: true
        }),
    ];

    const result = calculateTimeline(
        12,
        50000, // 500€ variable costs
        300000, // 3000€ start balance
        recurringItems,
        scenarios,
        TEST_DATE
    );

    expect(result).toHaveLength(12);

    // Check basic monthly calculation
    // Monthly: +4000 -1200 -500 = +2300€
    // Start: 3000€, so Month 0: 3000 + 2300 = 5300€
    expect(result[0].balance).toBe(530000); // Actual calculated value

    // Check quarterly insurance (dueMonth=3, so Mar, Jun, Sep, Dec)
    // Forecast starts Feb 2025, so: Mar(1), Jun(4), Sep(7), Dec(10)
    expect(result[0].irregularCosts).toHaveLength(0); // Feb 2025
    expect(result[1].irregularCosts).toHaveLength(1); // Mar 2025 ✓ Insurance
    expect(result[4].irregularCosts).toHaveLength(2); // Jun 2025 ✓ Insurance + Tax (both due in June)
    expect(result[7].irregularCosts).toHaveLength(1); // Sep 2025 ✓ Insurance
    expect(result[10].irregularCosts).toHaveLength(1); // Dec 2025 ✓ Insurance

    // Check yearly tax (dueMonth=6, only June: Jun 2025)
    expect(result[4].irregularCosts).toHaveLength(2); // Jun 2025 ✓ Insurance + Tax

    // Check scenario in month 5 (July 2025)
    expect(result[5].scenarios).toHaveLength(1); // Vacation scenario in July
    // Verify the scenario is present and balance is correctly affected
    // Base calculation up to July: Month 0: 5300€, then subtract monthly burn for 5 months
    // Monthly burn: +4000 -1200 -500 = +2300€ (net positive)
    // Month 5 (July): Should have vacation scenario amount deducted
    expect(result[5].balance).toBeGreaterThan(0); // Should still be positive after vacation
});

test("calculateTimeline - should handle very long time periods", () => {
    const result = calculateTimeline(
        60, // 5 years
        100000, // 1000€ variable costs
        500000, // 5000€ start balance
        [],
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(60);

    // Should maintain consistent pattern
    expect(result[0].balance).toBe(400000); // 5000 - 1000
    expect(result[1].balance).toBe(300000); // 4000 - 1000
    expect(result[2].balance).toBe(200000); // 3000 - 1000
});

test("calculateTimeline - should handle edge case with very high variable costs", () => {
    const result = calculateTimeline(
        3,
        1000000, // 10000€ variable costs (very high)
        500000, // 5000€ start balance
        [],
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(3);
    result.forEach((month: TimelineMonth) => {
        expect(month.isCritical).toBe(true);
        expect(month.balance).toBeLessThan(0);
    });
});

test("calculateTimeline - should handle edge case with very high income", () => {
    const recurringItems = [
        createRecurringItem({
            amount: 2000000, // +20000€
            interval: RecurringItemInterval.MONTHLY
        }),
    ];

    const result = calculateTimeline(
        3,
        100000, // 1000€ variable costs
        100000, // 1000€ start balance
        recurringItems,
        [],
        TEST_DATE
    );

    expect(result).toHaveLength(3);
    result.forEach((month: TimelineMonth) => {
        expect(month.isCritical).toBe(false);
        expect(month.balance).toBeGreaterThan(0);
    });

    // Should grow exponentially with high income
    expect(result[2].balance).toBeGreaterThan(result[1].balance);
    expect(result[1].balance).toBeGreaterThan(result[0].balance);
});

// =============================================================================
// calculateMonthlyBurn Tests
// =============================================================================
// Factory function for creating test recurring items
const createBurnTestRecurringItem = (overrides: Partial<RecurringItem> = {}): RecurringItem => ({
    id: "test-id",
    name: "Test Item",
    amount: -50000, // -500.00€ in Cents
    interval: RecurringItemInterval.MONTHLY,
    dueMonth: 1,
    ...overrides
});

test("calculateMonthlyBurn - should return only variable costs when recurringItems is empty", () => {
    const result = calculateMonthlyBurn([], 100000); // 1000€ variable costs
    expect(result).toBe(100000);
});

test("calculateMonthlyBurn - should return only variable costs when there are no recurring expenses", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: 300000, interval: RecurringItemInterval.MONTHLY }), // +3000€ income
    ];

    const result = calculateMonthlyBurn(recurringItems, 100000); // 1000€ variable costs
    expect(result).toBe(100000); // Only variable costs
});

test("calculateMonthlyBurn - should handle only negative recurring items correctly", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€
        createBurnTestRecurringItem({ amount: -120000, interval: RecurringItemInterval.MONTHLY }), // -1200€
    ];

    const result = calculateMonthlyBurn(recurringItems, 100000); // 1000€ variable costs
    expect(result).toBe(300000); // 800 + 1200 + 1000 = 3000€
});

test("calculateMonthlyBurn - should handle mixed positive and negative recurring items correctly", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: 400000, interval: RecurringItemInterval.MONTHLY }), // +4000€ income
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€ expense
        createBurnTestRecurringItem({ amount: -120000, interval: RecurringItemInterval.MONTHLY }), // -1200€ expense
    ];

    const result = calculateMonthlyBurn(recurringItems, 50000); // 500€ variable costs
    expect(result).toBe(250000); // 800 + 1200 + 500 = 2500€
});

test("calculateMonthlyBurn - should ignore QUARTERLY recurring items", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€ (should be counted)
        createBurnTestRecurringItem({ amount: -150000, interval: RecurringItemInterval.QUARTERLY }), // -1500€ (should be ignored)
    ];

    const result = calculateMonthlyBurn(recurringItems, 100000); // 1000€ variable costs
    expect(result).toBe(180000); // Only monthly (-800) + variable (1000) = 1800€
});

test("calculateMonthlyBurn - should ignore YEARLY recurring items", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€ (should be counted)
        createBurnTestRecurringItem({ amount: -200000, interval: RecurringItemInterval.YEARLY }), // -2000€ (should be ignored)
    ];

    const result = calculateMonthlyBurn(recurringItems, 100000); // 1000€ variable costs
    expect(result).toBe(180000); // Only monthly (-800) + variable (1000) = 1800€
});

test("calculateMonthlyBurn - should ignore all non-MONTHLY intervals", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€ (should be counted)
        createBurnTestRecurringItem({ amount: -150000, interval: RecurringItemInterval.QUARTERLY }), // -1500€ (ignored)
        createBurnTestRecurringItem({ amount: -200000, interval: RecurringItemInterval.YEARLY }), // -2000€ (ignored)
    ];

    const result = calculateMonthlyBurn(recurringItems, 100000); // 1000€ variable costs
    expect(result).toBe(180000); // Only monthly (-800) + variable (1000) = 1800€
});

test("calculateMonthlyBurn - should handle zero variable costs", () => {
    const recurringItems = [
        createBurnTestRecurringItem({ amount: -80000, interval: RecurringItemInterval.MONTHLY }), // -800€
        createBurnTestRecurringItem({ amount: -120000, interval: RecurringItemInterval.MONTHLY }), // -1200€
    ];

    const result = calculateMonthlyBurn(recurringItems, 0); // 0€ variable costs
    expect(result).toBe(200000); // 800 + 1200 = 2000€
});