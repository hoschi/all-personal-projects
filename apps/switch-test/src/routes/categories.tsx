import { Switch } from "@/components/ui/switch"
import { getCategoryViewData, setDiscount } from "@/data/actions"
import { Item } from "@/data/schema"
import { createFileRoute, useRouter } from "@tanstack/react-router"

export const Route = createFileRoute("/categories")({
  component: RouteComponent,
  loader: async () => {
    console.log("## loading CATEGORY data")
    const categoryItems = await getCategoryViewData()
    console.log("## CATEGORY data loaded")

    return { categoryItems }
  },
})

function RouteComponent() {
  const router = useRouter()
  const { categoryItems } = Route.useLoaderData()
  const toggleDiscount = async (item: Item) => {
    console.log(`## updating item: ${item.id}`)
    await setDiscount({ data: { hasDiscount: !item.hasDiscount, id: item.id } })
    router.invalidate()
    console.log(`## item: ${item.id} updated`)
  }

  return (
    <div>
      {Object.keys(categoryItems).map((category) => (
        <div key={category} className="bg-gray-600 p-1">
          <div className="text-muted m-1">{category}</div>
          {categoryItems[category].map((item) => (
            <div className="bg-gray-300 p-2 m-2" key={item.id}>
              <Switch
                checked={item.hasDiscount}
                className="mr-2"
                onCheckedChange={() => toggleDiscount(item)}
              />
              {item.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
