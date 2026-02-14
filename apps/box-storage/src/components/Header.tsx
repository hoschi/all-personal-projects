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
import { cn } from "@/lib/utils"

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
          className={cn(
            "text-3xl delay-0",
            match(isFetching)
              .with(true, () => cn("duration-1000", "opacity-40"))
              .otherwise(() => cn("duration-300", "opacity-0")),
          )}
        >
          <Spinner />
        </span>
      </span>
      <div className="flex gap-2 h-10 items-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link
          to="/table-view"
          search={{
            searchText: "",
            locationFilter: "",
            statusFilter: "all",
            sortBy: "name",
            sortDirection: "asc",
          }}
        >
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
