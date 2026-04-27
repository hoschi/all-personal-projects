import { useState, useTransition } from "react"
import { useRouter } from "@tanstack/react-router"
import { Either } from "effect"
import type { ForecastTimelineData } from "@/server/types"
import { saveForecastFn } from "@/server/actions"
import { parseCurrentBalanceValue } from "@/domain/currentBalances"
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
  const [scenarioStates, setScenarioStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.scenarios.map((scenario) => [scenario.id, scenario.isActive])),
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
          <p className="text-lg font-medium">{eurFormatter.format(data.startAmount / 100)}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="variable-costs">
            Estimated monthly variable costs (EUR)
          </label>
          <input
            id="variable-costs"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={variableCostsInput}
            onChange={(event) => setVariableCostsInput(event.currentTarget.value)}
          />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-left">Scenario</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {data.scenarios.map((scenario) => (
              <tr key={scenario.id} className="border-t border-border">
                <td className="px-3 py-2">{scenario.name}</td>
                <td className="px-3 py-2">
                  {new Date(scenario.date).toISOString().slice(0, 10)}
                </td>
                <td className="px-3 py-2">{eurFormatter.format(scenario.amount / 100)}</td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={scenarioStates[scenario.id] ?? scenario.isActive}
                    onChange={(event) => {
                      const isActive = event.currentTarget.checked
                      setScenarioStates((prev) => ({
                        ...prev,
                        [scenario.id]: isActive,
                      }))
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded border border-border px-3 py-1"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Forecast"}
        </button>
      </div>
    </section>
  )
}
