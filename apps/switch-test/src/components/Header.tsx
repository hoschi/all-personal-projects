import { useRouterState } from "@tanstack/react-router"
import { Spinner } from "./ui/spinner"

export default function Header() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <div>
      hello
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
    </div>
  )
}
