import { useState, useTransition } from "react"
import { format } from "date-fns"
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

export function SettingsScenariosTable({
  scenarios,
  onScenarioUpdated,
}: SettingsScenariosTableProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => (
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
                      disabled={isPending}
                      onCheckedChange={(isActive) => {
                        startTransition(async () => {
                          setError(null)
                          try {
                            await updateScenarioIsActiveFn({
                              data: {
                                scenarioId: scenario.id,
                                isActive,
                              },
                            })
                            await onScenarioUpdated()
                          } catch (updateError) {
                            if (updateError instanceof Error) {
                              setError(updateError.message)
                              return
                            }

                            setError("Failed to update scenario state.")
                          }
                        })
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-800">
          {error}
        </div>
      ) : null}
    </section>
  )
}
