import { createFileRoute, useRouter } from "@tanstack/react-router"
import { SettingsScenariosTable } from "@/components/SettingsScenariosTable"
import { getScenarioItemsFn } from "@/server/actions"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: async () => getScenarioItemsFn(),
})

function RouteComponent() {
  const scenarios = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="flex h-dvh flex-col">
      <header className="m-3 ml-8 flex items-center gap-2">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex grow flex-col">
          <h1 className="text-3xl">Settings</h1>
          <h2 className="text-muted-foreground">Data Management</h2>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <SettingsScenariosTable
          scenarios={scenarios}
          onScenarioUpdated={async () => {
            await router.invalidate()
          }}
        />
      </main>
    </div>
  )
}
