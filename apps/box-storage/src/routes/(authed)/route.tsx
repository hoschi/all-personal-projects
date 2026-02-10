import { hasToken } from "@/lib/auth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(authed)")({
  ssr: false,
  beforeLoad: () => {
    if (!hasToken()) {
      throw redirect({ to: "/" })
    }
  },
})
