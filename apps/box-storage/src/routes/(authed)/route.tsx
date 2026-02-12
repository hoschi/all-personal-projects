import { SignIn } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"
import { P, match } from "ts-pattern"

const getForceRedirectUrl = () =>
  match(typeof window)
    .with("undefined", () => "/")
    .otherwise(() => window.location.href)

export const Route = createFileRoute("/(authed)")({
  beforeLoad: ({ context }) => {
    return match(context.userId)
      .with(P.string, () => undefined)
      .otherwise(() => {
        throw new Error("Not authenticated")
      })
  },
  errorComponent: ({ error }) => {
    return match(error.message)
      .with("Not authenticated", () => (
        <div className="flex items-center justify-center p-12">
          <SignIn routing="hash" forceRedirectUrl={getForceRedirectUrl()} />
        </div>
      ))
      .otherwise(() => {
        throw error
      })
  },
})
