import { setDiscount } from "@/data/actions"
import { Item } from "@/data/schema"
import { useRouter } from "@tanstack/react-router"
import { Switch } from "./ui/switch"
import { Spinner } from "./ui/spinner"
import { useTransition } from "react"

export function ListItem({ item }: { item: Item }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const toggleDiscount = (item: Item) => {
    console.log(`## upaditng item: ${item.id}`)
    startTransition(async () => {
      await setDiscount({
        data: { hasDiscount: !item.hasDiscount, id: item.id },
      })
      router.invalidate()
      console.log(`## item: ${item.id} updated`)
    })
  }
  return (
    <div className="bg-gray-300 p-2 m-2 flex">
      <Switch
        checked={item.hasDiscount}
        className="mr-2 inline-block"
        onCheckedChange={() => toggleDiscount(item)}
      />
      {isPending && <Spinner className="mr-1" />}
      {item.title}
      <span className="ml-3 text-muted">{item.category}</span>
    </div>
  )
}
