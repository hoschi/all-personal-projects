import { createFileRoute } from "@tanstack/react-router"
import { Forecast } from "@/components/Forecast"
import { getForecastDataFn } from "@/server/actions"

export const Route = createFileRoute("/forecast")({
  component: RouteComponent,
  loader: async () => getForecastDataFn(),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="p-4 text-muted-foreground">
        No forecast data available yet.
      </div>
    )
  }

  return <Forecast forecastData={data} />
}
