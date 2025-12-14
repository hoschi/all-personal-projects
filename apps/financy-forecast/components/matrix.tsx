import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getAssetSnapshots } from "@/lib/db"

export async function Matrix() {
    const snapshots = await getAssetSnapshots()
    console.log(snapshots)
    return (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Konten -- {snapshots.length}</TableHead>
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
