import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="space-y-6">
      <header className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          SST v0
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Speech-To-Structured-Text Workspace
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Scaffold state with two synchronized text areas and placeholder
          controls.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Active Tab</p>
            <p className="text-sm text-muted-foreground">Tab 1</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Record
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Improve Text
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Debug
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Top Textbox</span>
            <textarea
              className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
              placeholder="Live transcription output..."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Bottom Textbox</span>
            <textarea
              className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
              placeholder="Context and corrected terms..."
            />
          </label>
        </div>
      </section>
    </main>
  )
}
