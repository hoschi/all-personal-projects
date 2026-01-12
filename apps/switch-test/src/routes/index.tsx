import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="mt-4">Hello World!</div>
}
