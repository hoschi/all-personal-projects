import { createFileRoute } from "@tanstack/react-router"
import { CurrentEdit } from "@/components/CurrentEdit"
import { getCurrentEditDataFn } from "@/server/actions"

export const Route = createFileRoute("/current/edit")({
  component: RouteComponent,
  loader: async () => getCurrentEditDataFn(),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Edit Current Balances</h2>
      <p className="text-muted-foreground">
        Compare latest snapshot and current balances.
      </p>
      <CurrentEdit data={data} />
    </section>
  )
}
