import { Switch } from "@/components/ui/switch"
import { getListItems, toggleItemInMotionFn } from "@/data/actions"
import { Item } from "@/data/schema"
import { createFileRoute, useRouter } from "@tanstack/react-router"

export const Route = createFileRoute("/(authed)/table-view")({
  component: RouteComponent,
  ssr: false,
  loader: async () => {
    const items = await getListItems()
    return { items, userId: 4 }
  },
})

function RouteComponent() {
  const router = useRouter()
  const { items, userId } = Route.useLoaderData()
  const toggleInMotion = async (item: Item) => {
    console.log(`## upaditng item: ${item.id}`)
    await toggleItemInMotionFn({ data: { itemId: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  return (
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
  )
}
