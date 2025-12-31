"use client"

import { useState, useCallback } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ScenarioItem } from "@/lib/schemas"
import { eurFormatter } from "@/components/format"
import { handleUpdateScenarioIsActive } from "@/lib/actions"

type SortField = 'name' | 'amount' | 'date' | 'isActive'
type SortDirection = 'asc' | 'desc'

interface ScenariosTableProps {
    scenarios: ScenarioItem[]
}

export function ScenariosTable({ scenarios }: ScenariosTableProps) {
    const [sortField, setSortField] = useState<SortField>('date')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const [error, setError] = useState<string | null>(null)

    // Sortierungsfunktion
    const sortedAndFilteredScenarios = useCallback(() => {
        // Sortierung
        return [...scenarios].sort((a, b) => {
            let aValue: string | number | boolean | Date
            let bValue: string | number | boolean | Date

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
                case 'amount':
                    aValue = a.amount
                    bValue = b.amount
                    break
                case 'date':
                    aValue = a.date
                    bValue = b.date
                    break
                case 'isActive':
                    aValue = a.isActive
                    bValue = b.isActive
                    break
                default:
                    return 0
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [scenarios, sortField, sortDirection])

    // Sortierfunktion für Header
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    // Switch-Handler für isActive
    const handleIsActiveToggle = async (scenario: ScenarioItem) => {
        console.log('button click')
        setError(null)

        try {
            const result = await handleUpdateScenarioIsActive(scenario.id, !scenario.isActive)

            if (!result.success) {
                throw new Error(result.error || 'Failed to update scenario')
            }
        } catch (err) {
            console.error('Error updating scenario:', err)
            setError(err instanceof Error ? err.message : 'Failed to update scenario')
        }
    }

    const currentScenarios = sortedAndFilteredScenarios()

    return (
        <div className="space-y-4">
            {/* Tabelle */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Name</span>
                                    {sortField === 'name' && (
                                        <span className="text-xs text-muted-foreground">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted text-right"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="flex items-center justify-end space-x-2">
                                    <span>Amount</span>
                                    {sortField === 'amount' && (
                                        <span className="text-xs text-muted-foreground">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Date</span>
                                    {sortField === 'date' && (
                                        <span className="text-xs text-muted-foreground">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted text-center"
                                onClick={() => handleSort('isActive')}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span>Status</span>
                                    {sortField === 'isActive' && (
                                        <span className="text-xs text-muted-foreground">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentScenarios.map((scenario) => (
                            <TableRow key={scenario.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">
                                    {scenario.name}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {eurFormatter.format(scenario.amount / 100)}
                                </TableCell>
                                <TableCell>
                                    {format(scenario.date, 'dd.MM.yyyy')}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Switch
                                            id={`switch-${scenario.id}`}
                                            checked={scenario.isActive}
                                            onCheckedChange={() => handleIsActiveToggle(scenario)}
                                        />
                                        <Label htmlFor={`switch-${scenario.id}`} className="sr-only">
                                            Toggle {scenario.name}
                                        </Label>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {/* Fehlermeldung */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}