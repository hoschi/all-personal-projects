"use client"

import { useState, useCallback } from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Sortierungsfunktion
    const sortedAndFilteredScenarios = useCallback(() => {
        let filtered = scenarios

        // Filter nach Suchbegriff
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase()
            filtered = scenarios.filter(scenario =>
                scenario.name.toLowerCase().includes(searchLower) ||
                eurFormatter.format(scenario.amount / 100).toLowerCase().includes(searchLower) ||
                format(scenario.date, 'dd.MM.yyyy').includes(searchLower)
            )
        }

        // Sortierung
        return [...filtered].sort((a, b) => {
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
    }, [scenarios, searchTerm, sortField, sortDirection])

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
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const result = await handleUpdateScenarioIsActive(scenario.id, !scenario.isActive)

            if (result.success) {
                setSuccessMessage(`Scenario "${scenario.name}" ${!scenario.isActive ? 'activated' : 'deactivated'}`)
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                throw new Error(result.error || 'Failed to update scenario')
            }
        } catch (err) {
            console.error('Error updating scenario:', err)
            setError(err instanceof Error ? err.message : 'Failed to update scenario')
        } finally {
            setIsLoading(false)
        }
    }

    const currentScenarios = sortedAndFilteredScenarios()

    return (
        <div className="space-y-4">
            {/* Header mit Suchfeld und Nachrichten */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search scenarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                    <span className="text-sm text-muted-foreground">
                        {currentScenarios.length} of {scenarios.length} scenarios
                    </span>
                </div>

                <div className="text-sm text-muted-foreground">
                    Direct save: Switch changes are saved immediately
                </div>
            </div>

            {/* Erfolgsmeldung */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded">
                    {successMessage}
                </div>
            )}

            {/* Fehlermeldung */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded">
                    {error}
                </div>
            )}

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
                                            disabled={isLoading}
                                        />
                                        <Label htmlFor={`switch-${scenario.id}`} className="sr-only">
                                            Toggle {scenario.name}
                                        </Label>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>
                        Scenario management: Toggle the switch to activate/deactivate scenarios.
                        Changes are saved immediately. Only the isActive status can be modified.
                    </TableCaption>
                </Table>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Saving changes...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}