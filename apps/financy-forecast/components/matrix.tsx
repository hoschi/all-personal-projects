import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getMatrixData } from "@/lib/data"
import { Option, Array as EffectArray } from 'effect';
import { isNone } from "effect/Option";
import { eurFormatter } from "./format";
import { Button } from "./ui/button";
import { addMonths, isAfter, isEqual } from "date-fns";
import { now } from "@/lib/utils";
import { MatrixData } from "@/lib/types";
import { cacheTag } from "next/cache";

export async function Matrix() {
    'use cache'
    cacheTag('snapshots', 'accounts')

    const matrixDataResult = await getMatrixData(4)

    if (isNone(matrixDataResult)) {
        return <div>No data</div>
    }

    return <TableView data={Option.getOrThrow(matrixDataResult)} />
}

async function TableView({ data }: { data: MatrixData }) {
    const { rows, header, lastDate } = data

    const isApprovable = calculateApprovable(lastDate)
    return (
        <div>
            <Table className="table-layout-fixed text-md">
                <TableHeader>
                    <TableRow>
                        {header.map(dateStr => <TableHead key={dateStr} className="w-[150px]">{dateStr}</TableHead>)}
                        <TableHead className="w-auto">Konten</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            {row.cells.map((cell) => (<TableCell key={cell.id}>{eurFormatter.format(cell.amount / 100)}</TableCell>))}
                            <TableCell className="font-medium">{row.name}</TableCell>
                        </TableRow>
                    ))}
                    {isApprovable && (
                        <TableRow>
                            {EffectArray.makeBy(header.length - 1, i => (
                                <TableCell key={`empty-${i}`}></TableCell>
                            ))}
                            <TableCell>
                                <Button variant={'outline'}>approve</Button>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export function calculateApprovable(lastDate: Date) {
    const approvableDate = addMonths(lastDate, 2)
    const today = now()
    return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}
