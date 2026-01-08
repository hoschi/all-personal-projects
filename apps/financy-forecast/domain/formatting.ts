import { addMonths, startOfMonth, format } from "date-fns"
import { now } from "../lib/utils"

export function formatMonthNumericYYMM(monthOffset: number): string {
  const today = now()
  const targetMonth = addMonths(startOfMonth(today), monthOffset)
  return format(targetMonth, "yy-MM")
}
