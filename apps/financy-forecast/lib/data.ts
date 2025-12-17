import { getAccounts, getSnapshotDetails } from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import { MatrixData } from "./types"
import { last } from 'ramda'

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
  })

  const header = details.map(detail => format(detail.snapshot.date, "yyyy-MM")).concat(['Current'])

  // QUESTION details is checked above that at least one element is in the array. Investigate with the MCP server the docs of this and search the internet for solutions
  const lastDate = last(details)?.snapshot.date || new Date()

  return Option.some({
    rows,
    header,
    lastDate
  })
}