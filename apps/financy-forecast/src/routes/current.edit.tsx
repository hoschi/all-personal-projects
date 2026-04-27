import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/current/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Edit Current Balances</h2>
      <p className="text-muted-foreground">
        Compare latest snapshot and current balances.
      </p>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Current Edit migration skeleton.
      </div>
    </section>
  )
}
