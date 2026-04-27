import { createFileRoute } from "@tanstack/react-router"
import { eurFormatter } from "@/components/format"
import { getForecastDataFn } from "@/server/actions"

export const Route = createFileRoute("/forecast")({
  component: RouteComponent,
  loader: async () => getForecastDataFn(),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="text-muted-foreground">
        No forecast data available yet.
      </div>
    )
  }

  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Forecast</h2>
      <p className="text-muted-foreground">
        Scenario planning and timeline view.
      </p>
      <div className="rounded-lg border border-border p-4 text-sm">
        <p>Start amount: {eurFormatter.format(data.startAmount / 100)}</p>
        <p>Recurring items: {data.recurringItems.length}</p>
        <p>Scenarios: {data.scenarios.length}</p>
        <p>
          Last snapshot date:{" "}
          {new Date(data.lastSnapshotDate).toISOString().slice(0, 10)}
        </p>
      </div>
    </section>
  )
}
