import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return <div className="mt-4">Unauthenticated space to login.</div>
}
