import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/forecast")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Forecast</h2>
      <p className="text-muted-foreground">Scenario planning and timeline view.</p>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Forecast migration skeleton.
      </div>
    </section>
  )
}
