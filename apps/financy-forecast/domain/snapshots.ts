
import { addMonths, isAfter, isEqual } from "date-fns";
import { now } from "../lib/utils";

/**
 * Prüft ob ein Snapshot basierend auf dem letzten Snapshot-Datum erstellt werden kann
 */
export function calculateApprovable(lastDate: Date): boolean {
    const approvableDate = addMonths(lastDate, 2) // +2 months brings us to the first day of the month after next
    const today = now()
    return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}