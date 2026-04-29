import { createFileRoute } from "@tanstack/react-router"
import { ForecastEditor } from "@/components/ForecastEditor"
import { getForecastDataFn } from "@/server/actions"
import { SidebarTrigger } from "@/components/ui/sidebar"

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

  return (
    <div className="flex h-dvh flex-col">
      <header className="m-3 ml-8 flex items-center gap-2">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex grow flex-col">
          <h1 className="text-3xl">Forecast</h1>
          <h2 className="text-muted-foreground">Where the Future starts</h2>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <ForecastEditor data={data} />
      </main>
    </div>
  )
}
