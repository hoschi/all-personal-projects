import { getAccounts, getSnapshotDetails } from "./db"
import { Option } from "effect"

// Matrix Data Structure for React component
export interface MatrixData {
  rows: Array<{
    id: string
    name: string
    cells: Array<{
      id: string
      amount: number
    }>
  }>
  header: string[]
}

export async function getMatrixData(limit: number): Promise<Option.Option<MatrixData>> {
  const [snapshotsResult, accounts] = await Promise.all([
    getSnapshotDetails(limit),
    getAccounts()
  ])

  if (Option.isNone(snapshotsResult)) {
    return Option.none()
  }

  const details = Option.getOrThrow(snapshotsResult)

  // Create matrix data structure
  const rows = accounts.map(account => {
    const cells: Array<{ id: string; amount: number }> = []

    // Add values for each snapshot chronologically (newest first)
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

  const header = details.map(detail => detail.snapshot.date.toString())

  return Option.some({
    rows,
    header
  })
}