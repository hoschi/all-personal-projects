import {
  getAccounts,
  getLatestAssetSnapshot,
  getRecurringItems,
  getScenarioItems,
  getSettings,
  getSnapshotDetails,
} from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import {
  MatrixChangeCell,
  MatrixCell,
  MatrixData,
  MatrixRow,
  ForecastTimelineData,
} from "./types"
import { last } from "ramda"
import { sumAll } from "effect/Number"

function createMonthlyChangeCells(sumCells: MatrixCell[]): MatrixChangeCell[] {
  return sumCells.map((cell, index, cells) => ({
    id: `change-${cell.id}`,
    delta: index === 0 ? null : cell.amount - cells[index - 1]!.amount,
  }))
}

function createTotalChange(sumCells: MatrixCell[]): number | null {
  if (sumCells.length < 2) {
    return null
  }

  return sumCells[sumCells.length - 1]!.amount - sumCells[0]!.amount
}

export async function getMatrixData(
  limit: number,
): Promise<Option.Option<MatrixData>> {
  const [snapshotsResult, accounts] = await Promise.all([
    getSnapshotDetails(limit),
    getAccounts(),
  ])

  if (Option.isNone(snapshotsResult)) {
    return Option.none()
  }

  const details = Option.getOrThrow(snapshotsResult).reverse()
  const sumCells: MatrixCell[] = details
    .map((detail) => ({
      id: `sum-${detail.snapshot.id}`,
      amount: detail.snapshot.totalLiquidity,
    }))
    .concat([
      {
        id: "sum-curent",
        amount: sumAll(accounts.map((a) => a.currentBalance)),
      },
    ])
  const changes = createMonthlyChangeCells(sumCells)
  const totalChange = createTotalChange(sumCells)

  const rows: MatrixRow[] = accounts
    .map((account) => {
      const cells = details
        .map((snapshot) => {
          const amount = snapshot.accountBalances[account.id] || 0
          return {
            id: `${account.id}-${snapshot.snapshot.date}`,
            amount: amount,
          }
        })
        .concat([
          {
            id: `current-${account.id}`,
            amount: account.currentBalance || 0,
          },
        ])

      return {
        id: account.id,
        name: account.name,
        cells,
      }
    })
    .concat([
      {
        id: "sum",
        name: "",
        cells: sumCells,
      },
    ])

  const header = details
    .map((detail) => format(detail.snapshot.date, "yyyy-MM"))
    .concat(["Current"])
  const lastDate = last(details)?.snapshot.date || new Date()

  return Option.some({
    rows,
    changes,
    totalChange,
    header,
    lastDate,
  })
}

export async function getForecastData(): Promise<
  Option.Option<ForecastTimelineData>
> {
  const [snapshot, recurringItems, scenarios, settings] = await Promise.all([
    getLatestAssetSnapshot(),
    getRecurringItems(),
    getScenarioItems(),
    getSettings(),
  ])

  if (
    Option.isNone(snapshot) ||
    Option.isNone(settings) ||
    recurringItems.length <= 0
  )
    return Option.none()

  const snapshotData = Option.getOrThrow(snapshot)
  const startAmount = snapshotData.totalLiquidity

  return Option.some({
    startAmount,
    recurringItems,
    estimatedMonthlyVariableCosts:
      Option.getOrThrow(settings).estimatedMonthlyVariableCosts,
    scenarios,
    lastSnapshotDate: snapshotData.date,
  })
}
