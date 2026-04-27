import { useState, useTransition } from "react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { Array as EffectArray } from "effect"
import type { MatrixData } from "@/server/types"
import { approveSnapshotFn } from "@/server/actions"
import { eurFormatter, formatDelta, getDeltaColorClass } from "./format"

type MatrixProps = {
  data: MatrixData
}

export function Matrix({ data }: MatrixProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { rows, header, changes, totalChange, isApprovable } = data

  const handleApprove = () => {
    startTransition(async () => {
      setError(null)
      const result = await approveSnapshotFn()

      if (!result.success) {
        setError(result.error)
        return
      }

      await router.invalidate()
    })
  }

  return (
    <div className="space-y-3">
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              {header.map((dateStr, index) => (
                <th
                  key={`${dateStr}-${index}`}
                  className="whitespace-nowrap px-3 py-2 text-left font-medium"
                >
                  <div className="flex items-center gap-2">
                    <span>{dateStr}</span>
                    {dateStr === "Current" ? (
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-0.5 text-xs"
                        onClick={() => navigate({ to: "/current/edit" })}
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium">Account</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {row.cells.map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2">
                    {eurFormatter.format(cell.amount / 100)}
                  </td>
                ))}
                <td className="px-3 py-2 font-medium">{row.name}</td>
              </tr>
            ))}

            <tr className="border-t border-border">
              {changes.map((changeCell) => (
                <td
                  key={changeCell.id}
                  className={`whitespace-nowrap px-3 py-2 ${getDeltaColorClass(changeCell.delta)}`}
                >
                  {formatDelta(changeCell.delta)}
                </td>
              ))}
              <td className={`px-3 py-2 ${getDeltaColorClass(totalChange)}`}>
                {formatDelta(totalChange)}
              </td>
            </tr>

            <tr className="border-t border-border">
              {EffectArray.makeBy(header.length - 1, (index) => (
                <td key={`empty-${index}`} className="px-3 py-2" />
              ))}
              <td className="px-3 py-2">
                {isApprovable ? (
                  <button
                    type="button"
                    className="rounded border border-border px-3 py-1"
                    onClick={handleApprove}
                    disabled={isPending}
                  >
                    {isPending ? "Approving..." : "Approve Snapshot"}
                  </button>
                ) : (
                  <span className="text-muted-foreground">Estimated</span>
                )}
              </td>
              <td className="px-3 py-2" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
