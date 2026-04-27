import { useState, useTransition } from "react"
import type { ScenarioItem } from "@/server/schemas"
import { updateScenarioIsActiveFn } from "@/server/actions"
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
    <section className="space-y-3 rounded-lg border bg-card p-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr key={scenario.id} className="border-t border-border">
                <td className="px-3 py-2">{scenario.name}</td>
                <td className="px-3 py-2">{new Date(scenario.date).toISOString().slice(0, 10)}</td>
                <td className="px-3 py-2">{eurFormatter.format(scenario.amount / 100)}</td>
                <td className="px-3 py-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scenario.isActive}
                      disabled={isPending}
                      onChange={(event) => {
                        const isActive = event.currentTarget.checked

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
                    <span>{scenario.isActive ? "On" : "Off"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
