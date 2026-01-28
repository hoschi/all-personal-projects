import { login } from "@/lib/auth"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="mt-4">
      Unauthenticated space to login.
      <button onClick={() => login(() => navigate({ to: "/dashboard" }))}>
        Login
      </button>
    </div>
  )
}
