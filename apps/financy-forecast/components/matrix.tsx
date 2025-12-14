import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getMatrixData } from "@/lib/data"
import { Option } from 'effect';
import { isNone } from "effect/Option";

export async function Matrix() {
    const matrixDataResult = await getMatrixData(4)

    if (isNone(matrixDataResult)) {
        return <div>no data</div>
    }

    const { rows, header } = Option.getOrThrow(matrixDataResult)
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Konten</TableHead>
                    {header.map(dateStr => <TableHead key={dateStr}>{dateStr}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        {row.cells.map(cell => (
                            <TableCell key={cell.id}>{(cell.amount / 100).toFixed(2)}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
