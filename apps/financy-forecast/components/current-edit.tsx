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
import { eurFormatter } from "./format"
import { format, formatDistanceToNow } from "date-fns"
import { handleSaveCurrentBalances } from "@/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"

function formatDelta(delta: number | null): string {
  if (delta === null) {
    return "—"
  }

  const formatted = eurFormatter.format(delta / 100)
  return delta > 0 ? `+${formatted}` : formatted
}

function getDeltaColorClass(delta: number | null): string {
  if (delta === null || delta === 0) {
    return "text-muted-foreground"
  }

  return delta > 0 ? "text-emerald-700" : "text-red-600"
}

function toInputValue(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2)
}

function formatLastUpdatedRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

function formatLastUpdatedAbsolute(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss")
}

export async function CurrentEdit({ data }: { data: CurrentEditData }) {
  async function saveAction(formData: FormData) {
    "use server"

    await handleSaveCurrentBalances(formData)
    redirect("/dashboard")
  }

  if (data.rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">No accounts available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3 rounded-lg border bg-card p-4">
          <div>
            <h3 className="text-xl">Latest Snapshot</h3>
            <p className="text-sm text-muted-foreground">
              {data.lastSnapshotDate
                ? `Date: ${format(data.lastSnapshotDate, "yyyy-MM-dd")}`
                : "No snapshot available yet."}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Snapshot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row) => (
                <TableRow key={`snapshot-${row.id}`}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    {row.snapshotBalance === null
                      ? "—"
                      : eurFormatter.format(row.snapshotBalance / 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <form
          action={saveAction}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <div>
            <h3 className="text-xl">Current</h3>
            <p className="text-sm text-muted-foreground">
              Enter current balances in EUR and save.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Current (EUR)</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row) => (
                <TableRow key={`current-${row.id}`}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Input
                      name={`balance:${row.id}`}
                      type="number"
                      step="0.01"
                      defaultValue={toInputValue(row.currentBalance)}
                      aria-label={`Current balance for ${row.name}`}
                      required
                    />
                  </TableCell>
                  <TableCell className={getDeltaColorClass(row.delta)}>
                    {formatDelta(row.delta)}
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

          <div className="flex items-center justify-end gap-2">
            <Button asChild variant="outline" type="button">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
