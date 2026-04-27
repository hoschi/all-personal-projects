import { Link, useRouterState } from "@tanstack/react-router"

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/current/edit", label: "Current Edit" },
  { to: "/forecast", label: "Forecast" },
  { to: "/settings", label: "Settings" },
] as const

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/40 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Financy Forecast</h1>
        <p className="text-sm text-muted-foreground">TanStack Migration</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.to ||
            (item.to !== "/dashboard" && pathname.startsWith(item.to))

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
