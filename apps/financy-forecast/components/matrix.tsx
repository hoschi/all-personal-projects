import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getMatrixData } from "@/lib/data"
import { Option } from 'effect';
import { isNone } from "effect/Option";
import { eurFormatter } from "./format";

export async function Matrix() {
    const matrixDataResult = await getMatrixData(4)

    if (isNone(matrixDataResult)) {
        return <div>No data</div>
    }

    const { rows, header } = Option.getOrThrow(matrixDataResult)
    return (
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
                        {row.cells.map(cell => (
                            <TableCell key={cell.id}>{eurFormatter.format(cell.amount / 100)}</TableCell>
                        ))}
                        <TableCell className="font-medium">{row.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
