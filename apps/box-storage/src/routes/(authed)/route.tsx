import { createFileRoute } from "@tanstack/react-router"
import { authStateFn } from "@/lib/auth"

export const Route = createFileRoute("/(authed)")({
  ssr: false,
  beforeLoad: async () => {
    await authStateFn()
  },
})
