import { useState, useTransition } from "react"
import { useRouter } from "@tanstack/react-router"
import { Either } from "effect"
import { format } from "date-fns"
import type { ForecastTimelineData } from "@/server/types"
import { saveForecastFn } from "@/server/actions"
import { parseCurrentBalanceValue } from "@/domain/currentBalances"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { eurFormatter, toInputValue } from "./format"

type ForecastEditorProps = {
  data: ForecastTimelineData
}

export function ForecastEditor({ data }: ForecastEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [variableCostsInput, setVariableCostsInput] = useState<string>(() =>
    toInputValue(data.estimatedMonthlyVariableCosts),
  )
  const [scenarioStates, setScenarioStates] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        data.scenarios.map((scenario) => [scenario.id, scenario.isActive]),
      ),
  )

  const handleSave = () => {
    startTransition(async () => {
      setError(null)

      const parsedVariableCosts = parseCurrentBalanceValue(variableCostsInput)
      if (Either.isLeft(parsedVariableCosts)) {
        setError(parsedVariableCosts.left)
        return
      }

      try {
        await saveForecastFn({
          data: {
            variableCosts: parsedVariableCosts.right,
            scenarios: data.scenarios.map((scenario) => ({
              id: scenario.id,
              isActive: scenarioStates[scenario.id] ?? scenario.isActive,
            })),
          },
        })

        await router.invalidate()
      } catch (saveError) {
        if (saveError instanceof Error) {
          setError(saveError.message)
          return
        }

        setError("Failed to save forecast changes.")
      }
    })
  }

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Start amount</p>
          <p className="text-lg font-medium">
            {eurFormatter.format(data.startAmount / 100)}
          </p>
        </div>
        <div>
          <Label
            className="text-sm text-muted-foreground"
            htmlFor="variable-costs"
          >
            Estimated monthly variable costs (EUR)
          </Label>
          <Input
            id="variable-costs"
            className="mt-1"
            value={variableCostsInput}
            onChange={(event) =>
              setVariableCostsInput(event.currentTarget.value)
            }
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scenario</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.scenarios.map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell>{scenario.name}</TableCell>
                <TableCell>
                  {format(new Date(scenario.date), "dd.MM.yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  {eurFormatter.format(scenario.amount / 100)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Switch
                      checked={scenarioStates[scenario.id] ?? scenario.isActive}
                      onCheckedChange={(isActive) => {
                        setScenarioStates((prev) => ({
                          ...prev,
                          [scenario.id]: isActive,
                        }))
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Forecast"}
        </Button>
      </div>
    </section>
  )
}
