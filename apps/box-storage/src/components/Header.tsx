import { Link, useRouterState } from "@tanstack/react-router"
import { Spinner } from "./ui/spinner"
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/tanstack-react-start"
import { match } from "ts-pattern"

export default function Header() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <div>
      <Link to="/">
        <span className="text-2xl">Box Storage</span>
      </Link>
      <span>
        {/* Show a global spinner when the router is transitioning */}
        <span
          className={match(isFetching)
            .with(
              true,
              () =>
                "text-3xl duration-300 delay-0 opacity-0 duration-1000 opacity-40",
            )
            .otherwise(() => "text-3xl duration-300 delay-0 opacity-0")}
        >
          <Spinner />
        </span>
      </span>
      <div className="flex gap-2 h-10 items-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/table-view" search={{ onlyMine: false }}>
          Items
        </Link>
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}
