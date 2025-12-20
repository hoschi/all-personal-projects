
import { RecurringItem, RecurringItemInterval, ScenarioItem } from "../lib/schemas";
import { TimelineMonth } from "../lib/types";
import { addMonths, startOfMonth, isEqual, format } from "date-fns";

/**
 * Calculates the monthly burn rate from recurring expenses and variable costs.
 * Only considers MONTHLY recurring items (ignores QUARTERLY/YEARLY).
 * Sum up negative amounts (expenses) from recurring items and add variable costs.
 * 
 * @param recurringItems - Array of recurring items
 * @param variableCosts - Variable monthly costs in cents
 * @returns Monthly burn rate in cents
 */
export function calculateMonthlyBurn(
    recurringItems: RecurringItem[],
    variableCosts: number
): number {
    const monthlyExpenses = Math.abs(
        recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    );

    return monthlyExpenses + variableCosts;
}


export function calculateTimeline(
    monthCount: number,
    variableCosts: number,
    startBalance: number,
    recurringItems: RecurringItem[],
    scenarios: ScenarioItem[],
    startDate: Date
): TimelineMonth[] {
    const months: TimelineMonth[] = [];
    let runningBalance = startBalance;

    // Alle positiven monatlichen Einnahmen
    const baseIncome = recurringItems
        .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount > 0)
        .reduce((sum, item) => sum + item.amount, 0);

    // Monthly burn aus wiederkehrenden Ausgaben und variablen Kosten
    const monthlyBurn = calculateMonthlyBurn(recurringItems, variableCosts);

    for (let i = 0; i < monthCount; i++) {
        // 1. Regular Cashflow
        runningBalance += baseIncome;
        runningBalance -= monthlyBurn;

        // 2. Quarterly & Yearly Fixed Costs
        // Berechne den absoluten Monat im Jahr (1-12) basierend auf dem Startdatum
        const firstForecastMonth = addMonths(startOfMonth(startDate), 1);
        const currentForecastMonth = addMonths(firstForecastMonth, i);
        const currentMonthInYear = currentForecastMonth.getMonth() + 1; // JavaScript getMonth() gibt 0-11 zurück

        const irregularCosts = recurringItems.filter(fc => {
            if (fc.interval === RecurringItemInterval.MONTHLY) return false;

            const dueMonth = fc.dueMonth ?? 1; // Default zu Januar (1) wenn null/undefined

            if (fc.interval === RecurringItemInterval.YEARLY) {
                return currentMonthInYear === dueMonth;
            }

            if (fc.interval === RecurringItemInterval.QUARTERLY) {
                // Quartalsweise: fällig im dueMonth und dann alle 3 Monate
                // Wenn dueMonth = 1 (Januar), dann: Jan(1), Apr(4), Jul(7), Okt(10)
                // Wenn dueMonth = 3 (März), dann: Mär(3), Jun(6), Sep(9), Dez(12)
                const quarters = [dueMonth, dueMonth + 3, dueMonth + 6, dueMonth + 9];
                // Stelle sicher, dass die Monate im Bereich 1-12 liegen
                const validQuarters = quarters.map(month => month > 12 ? month - 12 : month);
                return validQuarters.includes(currentMonthInYear);
            }

            return false;
        });

        // Apply Irregular Costs
        const costsTotal = irregularCosts.reduce((sum, c) => sum + c.amount, 0);
        runningBalance -= costsTotal;

        // 3. Scenarios - Filter für aktuellen Monat
        const targetMonth = currentForecastMonth;
        const monthScenarios = scenarios.filter(scenario => {
            const scenarioMonth = startOfMonth(scenario.date);
            return isEqual(scenarioMonth, targetMonth) && scenario.isActive;
        });

        const scenariosTotal = monthScenarios.reduce((sum, s) => sum + s.amount, 0);
        runningBalance += scenariosTotal;

        months.push({
            index: i,
            name: format(currentForecastMonth, "yy-MM"),
            balance: runningBalance,
            scenarios: monthScenarios,
            irregularCosts: irregularCosts,
            isCritical: runningBalance < 0
        });
    }
    return months;
}

