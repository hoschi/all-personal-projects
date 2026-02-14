import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getListItems,
  ListItemFilters,
  toggleItemInMotionFn,
} from "@/data/actions"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { z } from "zod"

export const Search = z.object({
  searchText: z.string().catch(""),
  locationFilter: z.string().catch(""),
  statusFilter: z
    .enum(["all", "in-motion", "mine", "free", "others"])
    .catch("all"),
  sortBy: z.enum(["name", "location", "status"]).catch("name"),
  sortDirection: z.enum(["asc", "desc"]).catch("asc"),
})
export type Search = z.infer<typeof Search>
type InventoryListItem = Awaited<ReturnType<typeof getListItems>>[number]

const defaultSearch: Search = {
  searchText: "",
  locationFilter: "",
  statusFilter: "all",
  sortBy: "name",
  sortDirection: "asc",
}

function isStatusFilter(value: string): value is Search["statusFilter"] {
  switch (value) {
    case "all":
    case "in-motion":
    case "mine":
    case "free":
    case "others":
      return true
    default:
      return false
  }
}

function isSortBy(value: string): value is Search["sortBy"] {
  switch (value) {
    case "name":
    case "location":
    case "status":
      return true
    default:
      return false
  }
}

function isSortDirection(value: string): value is Search["sortDirection"] {
  switch (value) {
    case "asc":
    case "desc":
      return true
    default:
      return false
  }
}

export const Route = createFileRoute("/(authed)/table-view")({
  component: RouteComponent,
  ssr: false,
  validateSearch: Search.parse,
  loaderDeps: ({
    search: { searchText, locationFilter, statusFilter, sortBy, sortDirection },
  }) => ({
    searchText,
    locationFilter,
    statusFilter,
    sortBy,
    sortDirection,
  }),
  loader: async ({
    deps: { searchText, locationFilter, statusFilter, sortBy, sortDirection },
    context,
  }) => {
    const filters: ListItemFilters = {
      searchText,
      locationFilter,
      sortBy,
      sortDirection,
      ...(statusFilter === "all" ? {} : { statusFilter }),
    }

    const items = await getListItems({
      data: { filters },
    })
    return { items, userId: context.userId }
  },
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate({ from: Route.fullPath })
  const { items, userId } = Route.useLoaderData()
  const search = Route.useSearch()

  const toggleInMotion = async (item: Pick<InventoryListItem, "id">) => {
    console.log(`## updating item: ${item.id}`)
    await toggleItemInMotionFn({ data: { itemId: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  const updateSearch = (partial: Partial<Search>) => {
    navigate({
      replace: true,
      search: (prev) => ({
        ...prev,
        ...partial,
      }),
    })
  }

  return (
    <div className="space-y-6 mt-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Inventar</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <CardTitle>Gegenstände</CardTitle>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              type="text"
              placeholder="Nach Name oder Beschreibung suchen..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-300"
              value={search.searchText}
              onChange={(event) => {
                updateSearch({ searchText: event.target.value })
              }}
            />
            <input
              type="text"
              placeholder="Nach Ort suchen..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-300"
              value={search.locationFilter}
              onChange={(event) => {
                updateSearch({ locationFilter: event.target.value })
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={search.statusFilter}
              onChange={(event) => {
                const value = event.target.value
                if (!isStatusFilter(value)) {
                  return
                }
                updateSearch({ statusFilter: value })
              }}
            >
              <option value="all">Alle Stati</option>
              <option value="free">Frei</option>
              <option value="mine">In Bewegung (du)</option>
              <option value="others">In Bewegung (andere)</option>
              <option value="in-motion">In Bewegung (alle)</option>
            </select>

            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={search.sortBy}
              onChange={(event) => {
                const value = event.target.value
                if (!isSortBy(value)) {
                  return
                }
                updateSearch({ sortBy: value })
              }}
            >
              <option value="name">Sortieren: Name</option>
              <option value="location">Sortieren: Ort</option>
              <option value="status">Sortieren: Status</option>
            </select>

            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={search.sortDirection}
              onChange={(event) => {
                const value = event.target.value
                if (!isSortDirection(value)) {
                  return
                }
                updateSearch({ sortDirection: value })
              }}
            >
              <option value="asc">Aufsteigend</option>
              <option value="desc">Absteigend</option>
            </select>

            <button
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              type="button"
              onClick={() => {
                navigate({
                  replace: true,
                  search: defaultSearch,
                })
              }}
            >
              Zurücksetzen
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gegenstand</TableHead>
                <TableHead>Lagerort</TableHead>
                <TableHead>Besitzer</TableHead>
                <TableHead className="text-center">In Bewegung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400">ID: {item.id}</div>
                  </TableCell>
                  <TableCell className="max-w-96 truncate">
                    {item.locationDisplay}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.ownerId === userId ? "blue" : "outline"}
                    >
                      {item.ownerUsername}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Switch
                        checked={item.inMotionUserId === userId}
                        onCheckedChange={() => toggleInMotion(item)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-slate-500"
                  >
                    Keine Treffer für die aktuellen Filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
