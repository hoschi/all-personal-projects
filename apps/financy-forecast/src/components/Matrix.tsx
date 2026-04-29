import { useState, useTransition } from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { Array as EffectArray } from "effect"
import type { MatrixData } from "@/server/types"
import { approveSnapshotFn } from "@/server/actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { eurFormatter, formatDelta, getDeltaColorClass } from "./format"

type MatrixProps = {
  data: MatrixData
}

export function Matrix({ data }: MatrixProps) {
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
    <div>
      {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
      <Table className="table-layout-fixed text-md">
        <TableHeader>
          <TableRow>
            {header.map((dateStr, index) => (
              <TableHead key={`${dateStr}-${index}`} className="w-[150px]">
                <div className="flex items-center gap-1">
                  <span>{dateStr}</span>
                  {dateStr === "Current" ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <Link
                        to="/current/edit"
                        aria-label="Edit current balances"
                        title="Edit current balances"
                      >
                        ✏️
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-auto">Konten</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {row.cells.map((cell) => (
                <TableCell key={cell.id}>
                  {eurFormatter.format(cell.amount / 100)}
                </TableCell>
              ))}
              <TableCell className="font-medium">{row.name}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            {changes.map((changeCell) => (
              <TableCell
                key={changeCell.id}
                className={getDeltaColorClass(changeCell.delta)}
              >
                {formatDelta(changeCell.delta)}
              </TableCell>
            ))}
            <TableCell className={getDeltaColorClass(totalChange)}>
              {formatDelta(totalChange)}
            </TableCell>
          </TableRow>
          <TableRow>
            {EffectArray.makeBy(header.length - 1, (index) => (
              <TableCell key={`empty-${index}`}></TableCell>
            ))}
            <TableCell>
              {isApprovable ? (
                <Button
                  type="button"
                  variant="outline"
                  aria-label="approve"
                  onClick={handleApprove}
                  disabled={isPending}
                >
                  {isPending ? "…" : "✅"}
                </Button>
              ) : (
                <span className="text-muted-foreground font-medium">Est.</span>
              )}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
