import { useState, useTransition } from "react"
import { useRouter } from "@tanstack/react-router"
import { Either } from "effect"
import { format, formatDistanceToNow } from "date-fns"
import type { CurrentEditData } from "@/server/types"
import {
  calculateSnapshotDelta,
  parseCurrentBalanceValue,
} from "@/domain/currentBalances"
import { saveCurrentBalancesFn } from "@/server/actions"
import {
  eurFormatter,
  formatDelta,
  getDeltaColorClass,
  toInputValue,
} from "./format"

type CurrentEditProps = {
  data: CurrentEditData
}

function deserializeDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(String(value))
}

export function CurrentEdit({ data }: CurrentEditProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [valuesByAccountId, setValuesByAccountId] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      data.rows.map((row) => [row.id, toInputValue(row.currentBalance)]),
    ),
  )

  const rows = data.rows.map((row) => {
    const inputValue =
      valuesByAccountId[row.id] ?? toInputValue(row.currentBalance)
    const parsedCurrentValue = parseCurrentBalanceValue(inputValue)
    const liveDelta = Either.map(parsedCurrentValue, (currentBalance) =>
      calculateSnapshotDelta(currentBalance, row.snapshotBalance),
    )

    return {
      ...row,
      updatedAt: deserializeDate(row.updatedAt),
      inputValue,
      liveDelta,
    }
  })

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null)
      try {
        await saveCurrentBalancesFn({ data: { valuesByAccountId } })
        await router.invalidate()
      } catch (submitError) {
        if (submitError instanceof Error) {
          setError(submitError.message)
          return
        }

        setError("Failed to save current balances.")
      }
    })
  }

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div>
        <h3 className="text-xl">Current Balances</h3>
        <p className="text-sm text-muted-foreground">
          {data.lastSnapshotDate
            ? `Snapshot date: ${format(deserializeDate(data.lastSnapshotDate), "yyyy-MM-dd")}`
            : "No snapshot available yet."}
        </p>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-left">Account</th>
              <th className="px-3 py-2 text-left">Snapshot</th>
              <th className="px-3 py-2 text-left">Current (EUR)</th>
              <th className="px-3 py-2 text-left">Delta</th>
              <th className="px-3 py-2 text-left">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2">
                  {row.snapshotBalance === null
                    ? "—"
                    : eurFormatter.format(row.snapshotBalance / 100)}
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full rounded border border-border px-2 py-1"
                    value={row.inputValue}
                    onChange={(event) => {
                      const nextValue = event.currentTarget.value
                      setValuesByAccountId((prev) => ({
                        ...prev,
                        [row.id]: nextValue,
                      }))
                    }}
                  />
                </td>
                <td
                  className={`px-3 py-2 ${Either.match(row.liveDelta, {
                    onLeft: () => "text-red-600",
                    onRight: (delta) => getDeltaColorClass(delta),
                  })}`}
                >
                  {Either.match(row.liveDelta, {
                    onLeft: (leftError) => leftError,
                    onRight: (delta) => formatDelta(delta),
                  })}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  <span title={format(row.updatedAt, "yyyy-MM-dd HH:mm:ss")}>
                    {formatDistanceToNow(row.updatedAt, { addSuffix: true })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded border border-border px-3 py-1"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  )
}
