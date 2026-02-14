"use client"

import { CurrentEditData } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  calculateSnapshotDelta,
  parseCurrentBalanceValue,
} from "@/domain/currentBalances"
import {
  eurFormatter,
  formatDelta,
  getDeltaColorClass,
  toInputValue,
} from "./format"
import { format, formatDistanceToNow } from "date-fns"
import { handleSaveCurrentBalances, ServerActionResult } from "@/lib/actions"
import { useActionState, useState } from "react"
import Link from "next/link"
import { Either } from "effect"

const initialActionState: ServerActionResult | null = null

function deserializeDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(String(value))
}

function createInitialInputState(rows: CurrentEditData["rows"]) {
  return Object.fromEntries(
    rows.map((row) => [row.id, toInputValue(row.currentBalance)]),
  )
}

function formatLastUpdatedRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

function formatLastUpdatedAbsolute(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss")
}

export function CurrentEdit({ data }: { data: CurrentEditData }) {
  const lastSnapshotDate = data.lastSnapshotDate
    ? deserializeDate(data.lastSnapshotDate)
    : null

  const [inputState, setInputState] = useState<Record<string, string>>(() =>
    createInitialInputState(data.rows),
  )

  const [actionState, formAction, isPending] = useActionState(
    handleSaveCurrentBalances,
    initialActionState,
  )

  const rows = data.rows.map((row) => {
    const updatedAt = deserializeDate(row.updatedAt)
    const inputValue = inputState[row.id] ?? toInputValue(row.currentBalance)
    const parsedCurrentValue = parseCurrentBalanceValue(inputValue)
    const liveDelta = Either.map(parsedCurrentValue, (currentBalance) =>
      calculateSnapshotDelta(currentBalance, row.snapshotBalance),
    )

    return {
      ...row,
      updatedAt,
      inputValue,
      liveDelta,
    }
  })

  if (data.rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">No accounts available.</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border bg-card p-4"
    >
      <div>
        <h3 className="text-xl">Current Balances</h3>
        <p className="text-sm text-muted-foreground">
          {lastSnapshotDate
            ? `Snapshot date: ${format(lastSnapshotDate, "yyyy-MM-dd")}`
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
                  name={`balance:${row.id}`}
                  type="text"
                  inputMode="decimal"
                  value={row.inputValue}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    setInputState((prev) => ({
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
                  onLeft: (error) => error,
                  onRight: (delta) => formatDelta(delta),
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      {formatLastUpdatedRelative(row.updatedAt)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {formatLastUpdatedAbsolute(row.updatedAt)}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {actionState && !actionState.success ? (
        <div className="space-y-1 text-sm text-red-600">
          <p>{actionState.error ?? "Failed to save current balances."}</p>
          {actionState.data?.fieldErrors?.updates ? (
            <p>{actionState.data.fieldErrors.updates.join(" ")}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
