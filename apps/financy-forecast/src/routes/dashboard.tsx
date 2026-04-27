import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Financial Matrix</h2>
      <p className="text-muted-foreground">
        Historical snapshot and asset distribution.
      </p>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Dashboard migration skeleton.
      </div>
    </section>
  )
}
