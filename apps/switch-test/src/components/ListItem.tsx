import { setDiscount } from "@/data/actions"
import { Item } from "@/data/schema"
import { useRouter } from "@tanstack/react-router"
import { Switch } from "./ui/switch"
import { Spinner } from "./ui/spinner"
import { useTransition } from "react"

export function ListItem({ item }: { item: Item }) {
  const router = useRouter()
  // NOTICE: This shows a spinner ONLY till the request to the server is pending. After this the page reloads the data which does NOT show a pending state!
  const [isPending, startTransition] = useTransition()
  const toggleDiscount = (item: Item) => {
    startTransition(async () => {
      await setDiscount({
        data: { hasDiscount: !item.hasDiscount, id: item.id },
      })
      router.invalidate()
    })
  }
  return (
    <div className="bg-gray-300 p-2 m-2">
      <Switch
        checked={item.hasDiscount}
        className="mr-2 inline-block"
        onCheckedChange={() => toggleDiscount(item)}
      />
      {isPending && <Spinner />}
      {item.title}
      <span className="ml-3 text-muted">{item.category}</span>
    </div>
  )
}
