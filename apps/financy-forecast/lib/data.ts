import { getAccounts, getSnapshotDetails } from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import { MatrixData } from "./types"

export async function getMatrixData(limit: number): Promise<Option.Option<MatrixData>> {
  const [snapshotsResult, accounts] = await Promise.all([
    getSnapshotDetails(limit),
    getAccounts()
  ])

  if (Option.isNone(snapshotsResult)) {
    return Option.none()
  }

  const details = Option.getOrThrow(snapshotsResult)

  const rows = accounts.map(account => {
    const cells: Array<{ id: string; amount: number }> = []

    details.forEach(snapshot => {
      const amount = snapshot.accountBalances[account.id] || 0
      cells.push({
        id: `${account.id}-${snapshot.snapshot.date}`,
        amount: Number(amount)
      })
    })

    return {
      id: account.id,
      name: account.name,
      cells
    }
  })

  const header = details.map(detail => format(detail.snapshot.date, "yyyy-MM"))

  return Option.some({
    rows,
    header
  })
}