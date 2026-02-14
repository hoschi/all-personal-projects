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
import {
  defaultInventorySortBy,
  defaultInventorySortDirection,
  inventoryAllStatusFilter,
  inventorySortBySchema,
  inventorySortDirectionSchema,
  inventoryStatusFilterWithAllSchema,
} from "@/data/inventory-query"
import { ArrowUp, RotateCcw } from "lucide-react"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { match } from "ts-pattern"
import { z } from "zod"

export const Search = z.object({
  searchText: z.string().catch(""),
  locationFilter: z.string().catch(""),
  statusFilter: inventoryStatusFilterWithAllSchema.catch(
    inventoryAllStatusFilter,
  ),
  sortBy: inventorySortBySchema.catch(defaultInventorySortBy),
  sortDirection: inventorySortDirectionSchema.catch(
    defaultInventorySortDirection,
  ),
})
export type Search = z.infer<typeof Search>
type InventoryListItem = Awaited<ReturnType<typeof getListItems>>[number]

export const defaultSearch: Search = {
  searchText: "",
  locationFilter: "",
  statusFilter: inventoryAllStatusFilter,
  sortBy: defaultInventorySortBy,
  sortDirection: defaultInventorySortDirection,
}

const INPUT_DEBOUNCE_MS = 300

type SelectOption<TValue extends string> = {
  value: TValue
  label: string
}

const statusOptions: ReadonlyArray<SelectOption<Search["statusFilter"]>> = [
  { value: inventoryAllStatusFilter, label: "Alle Stati" },
  { value: "free", label: "Frei" },
  { value: "mine", label: "In Bewegung (du)" },
  { value: "others", label: "In Bewegung (andere)" },
  { value: "in-motion", label: "In Bewegung (alle)" },
]

const sortByOptions: ReadonlyArray<SelectOption<Search["sortBy"]>> = [
  { value: "name", label: "Sortieren: Name" },
  { value: "location", label: "Sortieren: Ort" },
  { value: "status", label: "Sortieren: Status" },
]

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
      ...(statusFilter === inventoryAllStatusFilter ? {} : { statusFilter }),
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
  const [localSearchText, setLocalSearchText] = useState(search.searchText)
  const [localLocationFilter, setLocalLocationFilter] = useState(
    search.locationFilter,
  )

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

  useEffect(() => {
    setLocalSearchText(search.searchText)
  }, [search.searchText])

  useEffect(() => {
    setLocalLocationFilter(search.locationFilter)
  }, [search.locationFilter])

  useEffect(() => {
    if (localSearchText === search.searchText) {
      return
    }

    const timer = setTimeout(() => {
      navigate({
        replace: true,
        search: (prev) => ({
          ...prev,
          searchText: localSearchText,
        }),
      })
    }, INPUT_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [localSearchText, navigate, search.searchText])

  useEffect(() => {
    if (localLocationFilter === search.locationFilter) {
      return
    }

    const timer = setTimeout(() => {
      navigate({
        replace: true,
        search: (prev) => ({
          ...prev,
          locationFilter: localLocationFilter,
        }),
      })
    }, INPUT_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [localLocationFilter, navigate, search.locationFilter])

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
              value={localSearchText}
              onChange={(event) => {
                setLocalSearchText(event.target.value)
              }}
            />
            <input
              type="text"
              placeholder="Nach Ort suchen..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-300"
              value={localLocationFilter}
              onChange={(event) => {
                setLocalLocationFilter(event.target.value)
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={search.statusFilter}
              onChange={(event) => {
                const nextOption =
                  statusOptions[event.currentTarget.selectedIndex]
                if (!nextOption) {
                  return
                }
                updateSearch({ statusFilter: nextOption.value })
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={search.sortBy}
              onChange={(event) => {
                const nextOption =
                  sortByOptions[event.currentTarget.selectedIndex]
                if (!nextOption) {
                  return
                }
                updateSearch({ sortBy: nextOption.value })
              }}
            >
              {sortByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
              title={
                search.sortDirection === "asc"
                  ? "Sortierung: aufsteigend"
                  : "Sortierung: absteigend"
              }
              aria-label={
                search.sortDirection === "asc"
                  ? "Sortierung aufsteigend"
                  : "Sortierung absteigend"
              }
              onClick={() => {
                updateSearch({
                  sortDirection: match(search.sortDirection)
                    .returnType<Search["sortDirection"]>()
                    .with("asc", () => "desc")
                    .with("desc", () => "asc")
                    .exhaustive(),
                })
              }}
            >
              <ArrowUp
                size={16}
                className={match(search.sortDirection)
                  .with("asc", () => "rotate-0")
                  .with("desc", () => "rotate-180")
                  .exhaustive()
                  .concat(" transition-transform duration-200")}
              />
            </button>

            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
              type="button"
              title="Filter zurücksetzen"
              aria-label="Filter zurücksetzen"
              onClick={() => {
                setLocalSearchText(defaultSearch.searchText)
                setLocalLocationFilter(defaultSearch.locationFilter)
                navigate({
                  replace: true,
                  search: defaultSearch,
                })
              }}
            >
              <RotateCcw size={16} />
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
                <TableHead className="text-center">Status</TableHead>
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
