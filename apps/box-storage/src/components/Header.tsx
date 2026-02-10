import { Link, useRouterState } from "@tanstack/react-router"
import { Spinner } from "./ui/spinner"

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
          className={`text-3xl duration-300 delay-0 opacity-0 ${
            isFetching ? ` duration-1000 opacity-40` : ""
          }`}
        >
          <Spinner />
        </span>
      </span>
      <div className="flex gap-2">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/table-view" search={{ onlyMine: false }}>
          Items
        </Link>
      </div>
    </div>
  )
}
