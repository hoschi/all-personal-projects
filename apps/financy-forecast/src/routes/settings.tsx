import { createFileRoute, useRouter } from "@tanstack/react-router"
import Debug from "debug"
import { SettingsScenariosTable } from "@/components/SettingsScenariosTable"
import { getScenarioItemsFn } from "@/server/actions"
import { SidebarTrigger } from "@/components/ui/sidebar"

const debugSettingsLoader = Debug("app:client:settingsLoader")
const debugSettingsInvalidate = Debug("app:client:settingsInvalidate")

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: async () => {
    debugSettingsLoader("request:start")
    try {
      const result = await getScenarioItemsFn()
      debugSettingsLoader("request:done count=%d", result.length)
      return result
    } catch (error) {
      debugSettingsLoader("request:error %O", error)
      throw error
    }
  },
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
            debugSettingsInvalidate("router:invalidate:start")
            await router.invalidate()
            debugSettingsInvalidate("router:invalidate:done")
          }}
        />
      </main>
    </div>
  )
}
