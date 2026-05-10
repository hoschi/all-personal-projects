import {
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import Debug from "debug"
import { CurrentEdit } from "@/components/CurrentEdit"
import { RouteErrorState, RoutePendingState } from "@/components/RouteStatus"
import { getCurrentEditDataFn } from "@/server/actions"
import { currentEditDataSchema } from "@/server/schemas"
import { SidebarTrigger } from "@/components/ui/sidebar"

const debugCurrentEditLoader = Debug("app:client:currentEditLoader")

export const Route = createFileRoute("/current/edit")({
  component: RouteComponent,
  pendingComponent: CurrentEditPendingComponent,
  errorComponent: CurrentEditErrorComponent,
  loader: async () => {
    debugCurrentEditLoader("request:start")
    try {
      const result = await getCurrentEditDataFn()
      const parsedResult = currentEditDataSchema.parse(result)
      debugCurrentEditLoader("request:done rows=%d", parsedResult.rows.length)
      return parsedResult
    } catch (error) {
      debugCurrentEditLoader("request:error %O", error)
      throw error
    }
  },
})

function CurrentEditPendingComponent() {
  return (
    <RoutePendingState
      title="Loading current balances"
      description="Preparing latest snapshot comparison data."
    />
  )
}

function CurrentEditErrorComponent(props: ErrorComponentProps) {
  return <RouteErrorState {...props} />
}

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <div className="flex h-dvh flex-col">
      <header className="m-3 ml-8 flex items-center gap-2">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex grow flex-col">
          <h1 className="text-3xl">Edit Current Balances</h1>
          <h2 className="text-muted-foreground">
            Compare latest snapshot and current balances.
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <CurrentEdit data={data} />
      </main>
    </div>
  )
}
