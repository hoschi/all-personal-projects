import { createFileRoute } from "@tanstack/react-router"
import Debug from "debug"
import { Matrix } from "@/components/Matrix"
import { getMatrixDataFn } from "@/server/actions"
import { SidebarTrigger } from "@/components/ui/sidebar"

const debugDashboardLoader = Debug("app:client:dashboardLoader")

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => {
    debugDashboardLoader("request:start")
    try {
      const result = await getMatrixDataFn()
      debugDashboardLoader("request:done hasData=%s", result !== null)
      return result
    } catch (error) {
      debugDashboardLoader("request:error %O", error)
      throw error
    }
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="p-4 text-muted-foreground">
        No matrix data available yet.
      </div>
    )
  }

  return (
    <>
      <header className="m-3 ml-8 flex items-center gap-2">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex flex-col">
          <h1 className="text-3xl">Financial Matrix</h1>
          <h2 className="text-muted-foreground">
            Historical snapshot and asset distribution.
          </h2>
        </div>
      </header>
      <div className="p-4">
        <Matrix data={data} />
      </div>
    </>
  )
}
