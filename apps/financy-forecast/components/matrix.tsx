import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { getMatrixData } from "@/lib/data"
import { Option, Array as EffectArray } from "effect"
import { isNone } from "effect/Option"
import { format } from "date-fns"
import { eurFormatter } from "./format"
import { Button } from "./ui/button"
import { MatrixData } from "@/lib/types"
import { cacheTag } from "next/cache"
import { handleApproveSnapshot } from "@/lib/actions"
import Link from "next/link"
import {
  NoAccountsAvailableError,
  SnapshotNotApprovableError,
} from "@/domain/approveErrors"

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

export async function Matrix() {
  "use cache"
  cacheTag("snapshots", "accounts")

  const matrixDataResult = await getMatrixData(4)

  if (isNone(matrixDataResult)) {
    return <div>No data</div>
  }

  return <TableView data={Option.getOrThrow(matrixDataResult)} />
}

async function TableView({ data }: { data: MatrixData }) {
  const { rows, header, changes, totalChange, isApprovable } = data

  async function approveAction() {
    "use server"

    try {
      await handleApproveSnapshot()
    } catch (error) {
      if (error instanceof SnapshotNotApprovableError) {
        const earliestApprovalDate = format(
          error.earliestApprovalDate,
          "yyyy-MM-dd",
        )
        throw new Error(
          `Snapshot ist noch nicht freigebbar. Frühestes Freigabedatum: ${earliestApprovalDate}.`,
        )
      }

      if (error instanceof NoAccountsAvailableError) {
        throw new Error(
          "Keine Kontodaten vorhanden. Bitte zuerst Konten und aktuelle Werte erfassen.",
        )
      }

      throw error
    }
  }

  return (
    <div>
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
                        href="/current/edit"
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
            {EffectArray.makeBy(header.length - 1, (i) => (
              <TableCell key={`empty-${i}`}></TableCell>
            ))}
            <TableCell>
              {isApprovable ? (
                <form action={approveAction}>
                  <Button
                    type="submit"
                    variant={"outline"}
                    aria-label="approve"
                  >
                    ✅
                  </Button>
                </form>
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
