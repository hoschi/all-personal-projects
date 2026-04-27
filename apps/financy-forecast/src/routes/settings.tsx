import { createFileRoute, useRouter } from "@tanstack/react-router"
import { SettingsScenariosTable } from "@/components/SettingsScenariosTable"
import { getScenarioItemsFn } from "@/server/actions"

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: async () => getScenarioItemsFn(),
})

function RouteComponent() {
  const scenarios = Route.useLoaderData()
  const router = useRouter()

  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Settings</h2>
      <p className="text-muted-foreground">
        Data management and scenario toggles.
      </p>
      <SettingsScenariosTable
        scenarios={scenarios}
        onScenarioUpdated={async () => {
          await router.invalidate()
        }}
      />
    </section>
  )
}
