import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-2">
      <h2 className="text-3xl font-semibold">Settings</h2>
      <p className="text-muted-foreground">Data management and scenario toggles.</p>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Settings migration skeleton.
      </div>
    </section>
  )
}
