import { getAccounts, getSnapshotDetails } from "./db"
import { Option } from "effect"
import { format } from "date-fns"
import { MatrixData } from "./types"
import { last } from 'ramda'
import { AccountCategory, SnapshotDetails } from "./schemas"

interface Cell {
  id: string;
  amount: number;
}

interface Row {
  id: string
  name: string
  cells: Cell[]
}

// Dependency Injection Interface
interface DatabaseServices {
  getSnapshotDetails: (limit: number) => Promise<Option.Option<SnapshotDetails[]>>;
  getAccounts: () => Promise<{
    id: string;
    name: string;
    category: AccountCategory;
    currentBalance: number;
  }[]>;
}

// Default implementation using real database
const createDefaultDatabaseServices = (): DatabaseServices => ({
  getSnapshotDetails,
  getAccounts
});

export function getMatrixData(
  limit: number,
  services: DatabaseServices = createDefaultDatabaseServices()
): Promise<Option.Option<MatrixData>> {
  return Promise.resolve().then(async () => {
    const [snapshotsResult, accounts] = await Promise.all([
      services.getSnapshotDetails(limit),
      services.getAccounts()
    ])

    if (Option.isNone(snapshotsResult)) {
      return Option.none()
    }

    const details = Option.getOrThrow(snapshotsResult).reverse()
    if (details.length <= 1) {
      return Option.none()
    }

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

    const lastDate = last(details)?.snapshot.date || new Date()

    return Option.some({
      rows,
      header,
      lastDate
    })
  })
}