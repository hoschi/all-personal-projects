import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getMatrixData } from "@/lib/data"
import { Option } from 'effect';
import { isNone } from "effect/Option";

const eurFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
})

export async function Matrix() {
    const matrixDataResult = await getMatrixData(4)

    if (isNone(matrixDataResult)) {
        return <div>No data</div>
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
                            <TableCell key={cell.id}>{eurFormatter.format(cell.amount / 100)}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
