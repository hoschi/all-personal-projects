import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="text-muted-foreground">
      Open a section from the sidebar.
    </div>
  )
}
