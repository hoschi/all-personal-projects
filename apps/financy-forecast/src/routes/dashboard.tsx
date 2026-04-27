import { createFileRoute } from "@tanstack/react-router"
import { Matrix } from "@/components/Matrix"
import { getMatrixDataFn } from "@/server/actions"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => getMatrixDataFn(),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="text-muted-foreground">No matrix data available yet.</div>
    )
  }

  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Financial Matrix</h2>
      <p className="text-muted-foreground">
        Historical snapshot and asset distribution.
      </p>
      <Matrix data={data} />
    </section>
  )
}
