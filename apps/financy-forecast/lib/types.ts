import { RecurringItem, ScenarioItem } from "./schemas";

// Matrix Types (für bestehende MatrixData Komponente)
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
    name: string; // Format: YY-MM (z.B. "25-01" für Januar 2025)
    balance: number; // Kontostand in Cents
    scenarios: ScenarioItem[]; // Aktive Szenarien für diesen Monat
    irregularCosts: RecurringItem[]; // Unregelmäßige Kosten (quartalsweise/jährlich)
    isCritical: boolean; // Ist true wenn balance < 0
}

export interface ForecastTimelineData {
    startAmount: number; // Ausgangssaldo in Cents
    estimatedMonthlyVariableCosts: number;
    recurringItems: RecurringItem[]; // Alle wiederkehrenden Posten
    scenarios: ScenarioItem[]; // Alle Szenarien
    lastSnapshotDate: Date; // Datum des letzten Snapshots (für Startpunkt der Prognose)
    months?: TimelineMonth[]; // Berechnete Timeline-Monate (optional, wird berechnet)
}
