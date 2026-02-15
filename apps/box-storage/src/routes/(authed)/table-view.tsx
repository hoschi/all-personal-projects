import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  createUseDebouncedSearchParam,
  createUseUpdateSearch,
} from "@/hooks/use-debounced-search-param"
import { SelectOption } from "@/types"
import { ArrowUp, CircleOff, RotateCcw, Users } from "lucide-react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { type ComponentType } from "react"
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

type StatusOption = SelectOption<Search["statusFilter"]> & {
  icon?: ComponentType<{ className?: string }>
}

const statusOptions: ReadonlyArray<StatusOption> = [
  { value: "free", label: "nicht", icon: CircleOff },
  { value: "mine", label: "ich" },
  { value: "others", label: "andere" },
  { value: "in-motion", label: "alle", icon: Users },
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
const useDebouncedSearchParam = createUseDebouncedSearchParam(Route)
const useUpdateSearch = createUseUpdateSearch(Route)

function RouteComponent() {
  const router = useRouter()
  const { items, userId } = Route.useLoaderData()
  const search = Route.useSearch()
  const { updateSearch } = useUpdateSearch()

  const toggleInMotion = async (item: Pick<InventoryListItem, "id">) => {
    console.log(`## updating item: ${item.id}`)
    await toggleItemInMotionFn({ data: { itemId: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  const [localSearchText, setLocalSearchText] =
    useDebouncedSearchParam<typeof search>("searchText")
  const [localLocationFilter, setLocalLocationFilter] =
    useDebouncedSearchParam<typeof search>("locationFilter")

  return (
    <div className="space-y-6 mt-2">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="text"
              placeholder="Nach Name oder Beschreibung suchen..."
              className="w-full flex-1 basis-64 sm:w-auto"
              value={localSearchText}
              onChange={(event) => {
                setLocalSearchText(event.target.value)
              }}
            />
            <Input
              type="text"
              placeholder="Nach Ort suchen..."
              className="w-full flex-1 basis-56 sm:w-auto"
              value={localLocationFilter}
              onChange={(event) => {
                setLocalLocationFilter(event.target.value)
              }}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">In Bewegung:</span>
              <ButtonGroup>
                {statusOptions.map((option) => {
                  const Icon = option.icon

                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        search.statusFilter === option.value
                          ? "default"
                          : "outline"
                      }
                      aria-pressed={search.statusFilter === option.value}
                      onClick={() => {
                        if (search.statusFilter === option.value) {
                          updateSearch({
                            statusFilter: defaultSearch.statusFilter,
                          })
                        } else {
                          updateSearch({ statusFilter: option.value })
                        }
                      }}
                    >
                      {Icon ? <Icon className="size-4" /> : option.label}
                    </Button>
                  )
                })}
              </ButtonGroup>
            </div>

            <Select
              value={search.sortBy}
              onValueChange={(value) =>
                updateSearch({
                  sortBy: inventorySortBySchema.parse(value),
                })
              }
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-slate-700"
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
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-slate-700"
              title="Filter zurücksetzen"
              aria-label="Filter zurücksetzen"
              onClick={() => {
                setLocalSearchText(defaultSearch.searchText)
                setLocalLocationFilter(defaultSearch.locationFilter)
                updateSearch(defaultSearch)
              }}
            >
              <RotateCcw size={16} />
            </Button>
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
