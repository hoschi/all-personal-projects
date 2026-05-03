import {
  RecurringItem,
  RecurringItemInterval,
  ScenarioItem,
} from "@/server/schemas"
import { TimelineMonth } from "@/server/types"
import { addMonths, startOfMonth, isEqual, format } from "date-fns"

export function calculateTimeline(
  monthCount: number,
  variableCosts: number,
  startBalance: number,
  recurringItems: RecurringItem[],
  scenarios: ScenarioItem[],
  startDate: Date,
): TimelineMonth[] {
  const months: TimelineMonth[] = []
  let runningBalance = startBalance

  const baseIncome = recurringItems
    .filter(
      (item) =>
        item.interval === RecurringItemInterval.MONTHLY && item.amount > 0,
    )
    .reduce((sum, item) => sum + item.amount, 0)

  const monthlyBurn =
    variableCosts +
    Math.abs(
      recurringItems
        .filter(
          (item) =>
            item.interval === RecurringItemInterval.MONTHLY && item.amount < 0,
        )
        .reduce((sum, item) => sum + item.amount, 0),
    )

  for (let i = 0; i < monthCount; i++) {
    runningBalance += baseIncome
    runningBalance -= monthlyBurn

    const firstForecastMonth = addMonths(startOfMonth(startDate), 1)
    const currentForecastMonth = addMonths(firstForecastMonth, i)
    const currentMonthInYear = currentForecastMonth.getMonth() + 1

    const irregularCosts = recurringItems.filter((item) => {
      if (item.interval === RecurringItemInterval.MONTHLY) {
        return false
      }

      const dueMonth = item.dueMonth ?? 1

      if (item.interval === RecurringItemInterval.YEARLY) {
        return currentMonthInYear === dueMonth
      }

      if (item.interval === RecurringItemInterval.QUARTERLY) {
        const quarters = [dueMonth, dueMonth + 3, dueMonth + 6, dueMonth + 9]
        const validQuarters = quarters.map((month) =>
          month > 12 ? month - 12 : month,
        )
        return validQuarters.includes(currentMonthInYear)
      }

      return false
    })

    const costsTotal = irregularCosts.reduce((sum, item) => sum + item.amount, 0)
    runningBalance += costsTotal

    const monthScenarios = scenarios.filter((scenario) => {
      const scenarioMonth = startOfMonth(scenario.date)
      return isEqual(scenarioMonth, currentForecastMonth)
    })

    const scenariosTotal = monthScenarios
      .filter((scenario) => scenario.isActive)
      .reduce((sum, scenario) => sum + scenario.amount, 0)
    runningBalance += scenariosTotal

    months.push({
      index: i,
      name: format(currentForecastMonth, "yy-MM"),
      balance: runningBalance,
      scenarios: monthScenarios,
      irregularCosts,
      isCritical: runningBalance <= 0,
    })
  }

  return months
}
