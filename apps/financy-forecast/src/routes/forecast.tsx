import { createFileRoute } from "@tanstack/react-router"
import { ForecastEditor } from "@/components/ForecastEditor"
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
      <ForecastEditor data={data} />
    </section>
  )
}
