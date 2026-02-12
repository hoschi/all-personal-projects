import { Switch } from "@/components/ui/switch"
import {
  getListItems,
  ListItemFilters,
  toggleItemInMotionFn,
} from "@/data/actions"
import { Item } from "@/data/schema"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { z } from "zod"

export const Search = z.object({
  onlyMine: z.boolean().catch(false),
})
export type Search = z.infer<typeof Search>

export const Route = createFileRoute("/(authed)/table-view")({
  component: RouteComponent,
  ssr: false,
  validateSearch: Search.parse,
  loaderDeps: ({ search: { onlyMine } }) => ({ onlyMine }),
  loader: async ({ deps: { onlyMine }, context }) => {
    const filters: ListItemFilters = {}
    if (onlyMine) {
      filters.statusFilter = "mine"
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
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const toggleInMotion = async (item: Item) => {
    console.log(`## updating item: ${item.id}`)
    await toggleItemInMotionFn({ data: { itemId: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  return (
    <div>
      <div>
        <Switch
          checked={search.onlyMine}
          onCheckedChange={() => {
            navigate({
              search: { onlyMine: !search.onlyMine },
            })
          }}
        />
      </div>
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
