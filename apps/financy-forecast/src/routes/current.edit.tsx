import { createFileRoute } from "@tanstack/react-router"
import { CurrentEdit } from "@/components/CurrentEdit"
import { getCurrentEditDataFn } from "@/server/actions"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const Route = createFileRoute("/current/edit")({
  component: RouteComponent,
  loader: async () => getCurrentEditDataFn(),
})

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
