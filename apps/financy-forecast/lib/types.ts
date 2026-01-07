import { RecurringItem, ScenarioItem } from "./schemas";

// Matrix Types (for existing MatrixData component)
export interface MatrixData {
    rows: Array<{
        id: string;
        name: string;
        cells: Array<{
            id: string;
            amount: number;
        }>;
    }>;
    header: string[];
    lastDate: Date;
}

// Forecast Timeline Types
export interface Cell {
    id: string;
    amount: number;
}

export interface Row {
    id: string;
    name: string;
    cells: Cell[];
}

export interface TimelineMonth {
    index: number;
    name: string; // Format: YY-MM (e.g. "25-01" for January 2025)
    balance: number; // Account balance in cents
    scenarios: ScenarioItem[]; // All scenarios for this month
    irregularCosts: RecurringItem[]; // Irregular costs (quarterly/yearly)
    isCritical: boolean; // True if balance < 0
}

export interface ForecastTimelineData {
    startAmount: number; // Starting balance in cents
    estimatedMonthlyVariableCosts: number;
    recurringItems: RecurringItem[]; // All recurring items
    scenarios: ScenarioItem[]; // All scenarios
    lastSnapshotDate: Date; // Date of the last snapshot (for forecast start point)
    months?: TimelineMonth[]; // Calculated timeline months (optional, calculated)
}
