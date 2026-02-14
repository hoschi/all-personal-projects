import { SignIn } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"
import { P, match } from "ts-pattern"

class NotAuthenticatedError extends Error {
  constructor() {
    super("Not authenticated")
    this.name = "NotAuthenticatedError"
  }
}

const getForceRedirectUrl = () =>
  match(typeof window)
    .with("undefined", () => "/")
    .otherwise(() => window.location.href)

export const Route = createFileRoute("/(authed)")({
  beforeLoad: ({ context }) => {
    return match(context.userId)
      .with(P.string, () => undefined)
      .otherwise(() => {
        throw new NotAuthenticatedError()
      })
  },
  errorComponent: ({ error }) => {
    return match(error)
      .with(P.instanceOf(NotAuthenticatedError), () => (
        <div className="flex items-center justify-center p-12">
          <SignIn routing="hash" forceRedirectUrl={getForceRedirectUrl()} />
        </div>
      ))
      .otherwise(() => {
        throw error
      })
  },
})
