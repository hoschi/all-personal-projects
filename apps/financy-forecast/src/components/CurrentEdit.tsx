import { useState, useTransition } from "react"
import { useRouter } from "@tanstack/react-router"
import Debug from "debug"
import { Either } from "effect"
import { format, formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

const debugCurrentEditSave = Debug("app:client:currentEditSave")

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
      inputValue,
      liveDelta,
    }
  })
  const hasParseErrors = rows.some((row) => Either.isLeft(row.liveDelta))

  const handleSubmit = () => {
    if (hasParseErrors) {
      setError("Please fix invalid balances before saving.")
      return
    }

    startTransition(async () => {
      setError(null)
      debugCurrentEditSave(
        "request:start accountCount=%d",
        Object.keys(valuesByAccountId).length,
      )
      try {
        await saveCurrentBalancesFn({ data: { valuesByAccountId } })
        debugCurrentEditSave("request:done")
        debugCurrentEditSave("router:invalidate:start")
        await router.invalidate()
        debugCurrentEditSave("router:invalidate:done")
      } catch (submitError) {
        debugCurrentEditSave("request:error %O", submitError)
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
            ? `Snapshot date: ${format(data.lastSnapshotDate, "yyyy-MM-dd")}`
            : "No snapshot available yet."}
        </p>
      </div>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Latest Snapshot</TableHead>
            <TableHead colSpan={3}>Current</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[30%]">Account</TableHead>
            <TableHead className="w-[20%]">Snapshot</TableHead>
            <TableHead className="w-[20%]">Current (EUR)</TableHead>
            <TableHead className="w-[15%]">Delta</TableHead>
            <TableHead className="w-[15%]">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                {row.snapshotBalance === null
                  ? "—"
                  : eurFormatter.format(row.snapshotBalance / 100)}
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={row.inputValue}
                  aria-invalid={Either.isLeft(row.liveDelta)}
                  onChange={(event) => {
                    const nextValue = event.currentTarget.value
                    setValuesByAccountId((prev) => ({
                      ...prev,
                      [row.id]: nextValue,
                    }))
                  }}
                  aria-label={`Current balance for ${row.name}`}
                  required
                />
              </TableCell>
              <TableCell
                className={Either.match(row.liveDelta, {
                  onLeft: () => "text-red-600",
                  onRight: (delta) => getDeltaColorClass(delta),
                })}
              >
                {Either.match(row.liveDelta, {
                  onLeft: (leftError) => leftError,
                  onRight: (delta) => formatDelta(delta),
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      {formatDistanceToNow(row.updatedAt, { addSuffix: true })}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {format(row.updatedAt, "yyyy-MM-dd HH:mm:ss")}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || hasParseErrors}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </section>
  )
}
