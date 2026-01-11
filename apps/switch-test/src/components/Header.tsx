import { Link, useRouterState } from "@tanstack/react-router"
import { Spinner } from "./ui/spinner"

export default function Header() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <div>
      <span className="text-2xl">Switch Test</span>
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
        <Link to="/list">List</Link>
        <Link to="/categories">Categories</Link>
      </div>
    </div>
  )
}
