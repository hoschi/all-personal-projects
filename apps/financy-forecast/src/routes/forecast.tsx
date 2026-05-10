import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import Debug from "debug"
import { Forecast } from "@/components/Forecast"
import { RouteErrorState, RoutePendingState } from "@/components/RouteStatus"
import { getForecastDataFn } from "@/server/actions"

const debugForecastLoader = Debug("app:client:forecastLoader")

export const Route = createFileRoute("/forecast")({
  component: RouteComponent,
  pendingComponent: ForecastPendingComponent,
  errorComponent: ForecastErrorComponent,
  loader: async () => {
    debugForecastLoader("request:start")
    try {
      const result = await getForecastDataFn()
      debugForecastLoader("request:done hasData=%s", result !== null)
      return result
    } catch (error) {
      debugForecastLoader("request:error %O", error)
      throw error
    }
  },
})

function ForecastPendingComponent() {
  return (
    <RoutePendingState
      title="Loading forecast"
      description="Fetching recurring items, scenarios, and settings."
    />
  )
}

function ForecastErrorComponent(props: ErrorComponentProps) {
  return <RouteErrorState {...props} />
}

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
