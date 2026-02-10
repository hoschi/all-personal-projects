import { useUser } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { isSignedIn, user } = useUser()

  return (
    <div className="mt-4">
      <p>This is the last storage system you need.</p>
      {isSignedIn ? (
        <p> Hello {user.fullName || user.username}!</p>
      ) : (
        <p>You are not signed in and can't interact with the system!</p>
      )}
    </div>
  )
}
