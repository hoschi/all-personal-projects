import { Link, useRouterState } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/forecast", label: "Forecast" },
  { to: "/settings", label: "Settings / Fixkosten" },
] as const

export function AppSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <Sidebar>
      <SidebarHeader className="text-center">Financy Forecast</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to !== "/dashboard" && pathname.startsWith(item.to))

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.to}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
