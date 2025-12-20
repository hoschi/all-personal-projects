
import { addMonths, isAfter, isEqual } from "date-fns";
import { now } from "../lib/utils";

export function calculateApprovable(lastDate: Date): boolean {
    const approvableDate = addMonths(lastDate, 2)
    const today = now()
    return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}