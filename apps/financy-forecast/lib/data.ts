import { getAccounts, getLatestAssetSnapshot, getRecurringItems, getScenarioItems, getSnapshotDetails } from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import { MatrixData, ForecastTimelineData } from "./types"
import { last } from 'ramda'
import { sumAll } from "effect/Number"

// TODO diese typen Cell/Row müssen in `types` gepackt werden und in `MatrixData` verwendet werden.
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
        amount: Number(amount)
      })
    }).concat([{
      id: `current-${account.id}`,
      amount: Number(account.currentBalance) || 0
    }])

    return {
      id: account.id,
      name: account.name,
      cells
    }
  }).concat([{
    id: 'sum',
    name: '',
    cells: details.map(detail => ({ id: `sum-${detail.snapshot.id}`, amount: Number(detail.snapshot.totalLiquidity) }))
      .concat([{ id: 'sum-curent', amount: sumAll(accounts.map(a => Number(a.currentBalance))) }])
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
  const [snapshot, recurringItems, scenarios] = await Promise.all([
    getLatestAssetSnapshot(),
    getRecurringItems(),
    getScenarioItems()
  ])

  if (Option.isNone(snapshot) || recurringItems.length <= 0) return Option.none();

  const startAmount = Option.getOrThrow(snapshot).totalLiquidity

  return Option.some({
    startAmount,
    recurringItems,
    scenarios
  })
}