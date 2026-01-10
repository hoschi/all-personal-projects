import { ListItem } from "@/components/ListItem"
import { getListItems } from "@/data/actions"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/list")({
  component: RouteComponent,
  loader: async () => {
    const listItems = await getListItems()
    return { items: listItems }
  },
})

function RouteComponent() {
  const { items } = Route.useLoaderData()

  return (
    <div>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}
