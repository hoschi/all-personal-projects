import { Switch } from "@/components/ui/switch"
import {
  getListItems,
  ListItemFilters,
  toggleItemInMotionFn,
} from "@/data/actions"
import { Item } from "@/data/schema"
import { createFileRoute, useRouter } from "@tanstack/react-router"
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
  const { items, userId } = Route.useLoaderData()

  const toggleInMotion = async (item: Item) => {
    console.log(`## updating item: ${item.id}`)
    await toggleItemInMotionFn({ data: { itemId: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  return (
    <div>
      <div>
        {items.map((item) => (
          <div key={item.id} className="my-2 p-2 outline-amber-300 outline-1">
            <div>{item.name}</div>
            <div>{item.id}</div>
            <Switch
              checked={item.inMotionUserId === userId}
              className="mr-2"
              onCheckedChange={() => toggleInMotion(item)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
