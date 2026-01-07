import { getAccounts, getLatestAssetSnapshot, getRecurringItems, getScenarioItems, getSettings, getSnapshotDetails } from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import { MatrixData, ForecastTimelineData } from "./types"
import { last } from 'ramda'
import { sumAll } from "effect/Number"

// TODO these types Cell/Row need to be moved to `types` and used in `MatrixData`.
interface Cell {
  id: string;
  amount: number;
}

interface Row {
  id: string
  name: string
  cells: Cell[]
}

export async function getMatrixData(limit: number): Promise<Option.Option<MatrixData>> {
  const [snapshotsResult, accounts] = await Promise.all([
    getSnapshotDetails(limit),
    getAccounts()
  ])

  if (Option.isNone(snapshotsResult)) {
    return Option.none()
  }

  const details = Option.getOrThrow(snapshotsResult).reverse()

  const rows: Row[] = accounts.map(account => {
    const cells = details.map(snapshot => {
      const amount = snapshot.accountBalances[account.id] || 0
      return ({
        id: `${account.id}-${snapshot.snapshot.date}`,
        amount: amount
      })
    }).concat([{
      id: `current-${account.id}`,
      amount: account.currentBalance || 0
    }])

    return {
      id: account.id,
      name: account.name,
      cells
    }
  }).concat([{
    id: 'sum',
    name: '',
    cells: details.map(detail => ({ id: `sum-${detail.snapshot.id}`, amount: detail.snapshot.totalLiquidity }))
      .concat([{ id: 'sum-curent', amount: sumAll(accounts.map(a => a.currentBalance)) }])
  }])

  const header = details.map(detail => format(detail.snapshot.date, "yyyy-MM")).concat(['Current'])
  const lastDate = last(details)?.snapshot.date || new Date()

  return Option.some({
    rows,
    header,
    lastDate
  })
}

export async function getForecastData(): Promise<Option.Option<ForecastTimelineData>> {
  const [snapshot, recurringItems, scenarios, settings] = await Promise.all([
    getLatestAssetSnapshot(),
    getRecurringItems(),
    getScenarioItems(),
    getSettings()
  ])

  if (Option.isNone(snapshot) || Option.isNone(settings) || recurringItems.length <= 0) return Option.none();

  const snapshotData = Option.getOrThrow(snapshot)
  const startAmount = snapshotData.totalLiquidity

  return Option.some({
    startAmount,
    recurringItems,
    estimatedMonthlyVariableCosts: Option.getOrThrow(settings).estimatedMonthlyVariableCosts,
    scenarios,
    lastSnapshotDate: snapshotData.date
  })
}
