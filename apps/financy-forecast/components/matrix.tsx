import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getSnapshotDetails } from "@/lib/db"
import { Option } from 'effect';
import { isNone } from "effect/Option";

export async function Matrix() {
    const snapshots = await getSnapshotDetails(5)

    if (isNone(snapshots)) {
        return <div>no data</div>
    }

    console.log(snapshots)
    return (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Konten -- </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>

    )
}
