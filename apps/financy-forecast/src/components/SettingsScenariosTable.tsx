import { useState } from "react"
import { format } from "date-fns"
import Debug from "debug"
import type { ScenarioItem } from "@/server/schemas"
import { updateScenarioIsActiveFn } from "@/server/actions"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { eurFormatter } from "./format"

type SettingsScenariosTableProps = {
  scenarios: ScenarioItem[]
  onScenarioUpdated: () => Promise<void>
}

type SortField = "name" | "amount" | "date" | "isActive"
type SortDirection = "asc" | "desc"

const debugSettingsScenarioToggle = Debug("app:client:settingsScenarioToggle")

export function SettingsScenariosTable({
  scenarios,
  onScenarioUpdated,
}: SettingsScenariosTableProps) {
  const [error, setError] = useState<string | null>(null)
  const [pendingScenarioIds, setPendingScenarioIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const isScenarioPending = (scenarioId: string) =>
    pendingScenarioIds.includes(scenarioId)

  const sortedScenarios = [...scenarios].sort((a, b) => {
    let aValue: string | number | boolean
    let bValue: string | number | boolean

    if (sortField === "name") {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    } else if (sortField === "amount") {
      aValue = a.amount
      bValue = b.amount
    } else if (sortField === "date") {
      aValue = new Date(a.date).getTime()
      bValue = new Date(b.date).getTime()
    } else {
      aValue = a.isActive
      bValue = b.isActive
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }

    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      return
    }

    setSortField(field)
    setSortDirection("asc")
  }

  const handleScenarioToggle = async (
    scenarioId: string,
    isActive: boolean,
  ) => {
    setPendingScenarioIds((prev) =>
      prev.includes(scenarioId) ? prev : [...prev, scenarioId],
    )
    setError(null)
    debugSettingsScenarioToggle(
      "request:start scenarioId=%s isActive=%s",
      scenarioId,
      isActive,
    )

    try {
      const result = await updateScenarioIsActiveFn({
        data: {
          scenarioId,
          isActive,
        },
      })
      if (!result.success) {
        debugSettingsScenarioToggle(
          "request:businessError scenarioId=%s message=%s",
          scenarioId,
          result.error,
        )
        setError(result.error)
        return
      }
      debugSettingsScenarioToggle("request:done scenarioId=%s", scenarioId)
      debugSettingsScenarioToggle("afterRequest:onScenarioUpdated:start")
      await onScenarioUpdated()
      debugSettingsScenarioToggle("afterRequest:onScenarioUpdated:done")
    } catch (updateError) {
      debugSettingsScenarioToggle("request:error %O", updateError)
      throw updateError
    } finally {
      setPendingScenarioIds((prev) => prev.filter((id) => id !== scenarioId))
    }
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  {sortField === "name" ? (
                    <span className="text-xs text-muted-foreground">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right hover:bg-muted"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Amount</span>
                  {sortField === "amount" ? (
                    <span className="text-xs text-muted-foreground">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-2">
                  <span>Date</span>
                  {sortField === "date" ? (
                    <span className="text-xs text-muted-foreground">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-center hover:bg-muted"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Status</span>
                  {sortField === "isActive" ? (
                    <span className="text-xs text-muted-foreground">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedScenarios.map((scenario) => (
              <TableRow key={scenario.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{scenario.name}</TableCell>
                <TableCell className="text-right font-mono">
                  {eurFormatter.format(scenario.amount / 100)}
                </TableCell>
                <TableCell>
                  {format(new Date(scenario.date), "dd.MM.yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      id={`switch-${scenario.id}`}
                      checked={scenario.isActive}
                      disabled={isScenarioPending(scenario.id)}
                      onCheckedChange={(isActive) => {
                        void handleScenarioToggle(scenario.id, isActive)
                      }}
                    />
                    <Label
                      htmlFor={`switch-${scenario.id}`}
                      className="sr-only"
                    >
                      Toggle {scenario.name}
                    </Label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-800"
        >
          {error}
        </div>
      ) : null}
    </section>
  )
}
