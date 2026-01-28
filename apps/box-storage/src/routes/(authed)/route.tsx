import { hasToken } from "@/lib/auth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(authed)")({
  beforeLoad: () => {
    if (!hasToken()) {
      throw redirect({ href: "/" })
    }
  },
})
