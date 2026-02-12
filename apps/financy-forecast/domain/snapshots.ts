import { addMonths, isAfter, isEqual, startOfMonth, subMonths } from "date-fns"
import { sumAll } from "effect/Number"
import { now } from "../lib/utils"

/**
 * Frühestes Datum, an dem auf Basis des letzten Snapshot-Datums wieder freigegeben werden darf.
 */
export function calculateEarliestApprovalDate(lastDate: Date): Date {
  return addMonths(lastDate, 2)
}

/**
 * Prüft ob ein Snapshot basierend auf dem letzten Snapshot-Datum erstellt werden kann
 */
export function calculateApprovable(lastDate: Date): boolean {
  const approvableDate = calculateEarliestApprovalDate(lastDate) // +2 months brings us to the first day of the month after next
  const today = now()
  return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}

/**
 * Nächstes Snapshot-Datum auf Basis des letzten Snapshot-Datums.
 * Persistiert wird immer der erste Tag des Monats.
 */
export function calculateNextSnapshotDate(lastDate: Date): Date {
  return startOfMonth(addMonths(lastDate, 1))
}

/**
 * Initiales Snapshot-Datum wenn noch kein Snapshot existiert.
 * Persistiert wird immer der erste Tag des Vormonats.
 */
export function calculateInitialSnapshotDate(
  referenceDate: Date = now(),
): Date {
  return startOfMonth(subMonths(referenceDate, 1))
}

/**
 * Berechnet die Gesamtsumme über alle Kontostände in Cents.
 */
export function calculateAccountsTotalBalance(
  balancesInCents: ReadonlyArray<number>,
): number {
  return sumAll(balancesInCents)
}
