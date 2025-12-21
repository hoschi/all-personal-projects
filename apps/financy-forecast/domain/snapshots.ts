
import { addMonths, isAfter, isEqual, getDaysInMonth, subMonths } from "date-fns";
import { now } from "../lib/utils";

/**
 * Berechnet das Datum für einen neuen Snapshot (letzter Tag des Vormonats)
 */
export function calculateNewSnapshotDate(lastSnapshotDate?: Date): Date {
    if (!lastSnapshotDate) {
        // Erster Snapshot: letzter Tag des Vormonats vom aktuellen Datum
        const lastMonth = subMonths(now(), 1);
        const lastDayOfMonth = getDaysInMonth(lastMonth);
        return new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastDayOfMonth);
    }

    // Nachfolgende Snapshots: letzter Tag des Monats vom letzten Snapshot
    const lastDayOfMonth = getDaysInMonth(lastSnapshotDate);
    return new Date(lastSnapshotDate.getFullYear(), lastSnapshotDate.getMonth(), lastDayOfMonth);
}

/**
 * Prüft ob ein Snapshot basierend auf dem letzten Snapshot-Datum erstellt werden kann
 */
export function calculateApprovable(lastDate: Date): boolean {
    // Neues System: Snapshot ist approvable wenn der erste Tag des übernächsten Monats erreicht ist
    // Beispiel: Letzter Snapshot 31.3.2024 -> übernächster Monat ist Mai 2024 -> approvable ab 1.5.2024
    const approvableDate = addMonths(lastDate, 3) // +3 Monate brings us to the first day of the month after next
    const today = now()
    return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}