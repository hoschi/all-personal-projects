import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(authed)/table-view")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authed)/table-view"!</div>
}
