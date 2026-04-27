import { addMonths, isAfter, isEqual, startOfMonth, subMonths } from "date-fns"
import { sumAll } from "effect/Number"
import { now } from "@/lib/utils"

export function calculateEarliestApprovalDate(lastDate: Date): Date {
  return addMonths(lastDate, 2)
}

export function calculateApprovable(lastDate: Date): boolean {
  const approvableDate = calculateEarliestApprovalDate(lastDate)
  const today = now()
  return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}

export function calculateNextSnapshotDate(lastDate: Date): Date {
  return startOfMonth(addMonths(lastDate, 1))
}

export function calculateInitialSnapshotDate(referenceDate: Date = now()): Date {
  return startOfMonth(subMonths(referenceDate, 1))
}

export function calculateAccountsTotalBalance(
  balancesInCents: ReadonlyArray<number>,
): number {
  return sumAll(balancesInCents)
}
