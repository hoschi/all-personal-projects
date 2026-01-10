import { Switch } from '@/components/ui/switch'
import { getListItems, setDiscount } from '@/data/actions'
import { Item } from '@/data/schema'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/list')({
    component: RouteComponent,
    loader: async () => {
        const listItems = await getListItems()
        return { items: listItems }
    }
})

function RouteComponent() {
    const router = useRouter()
    const { items } = Route.useLoaderData()
    const toggleDiscount = async (item: Item) => {
        await setDiscount({ data: { hasDiscount: !item.hasDiscount, id: item.id } })
        router.invalidate()
    }

    return <div>
        {items.map(item => (<div className='bg-gray-400 p-2 m-2' key={item.id}><Switch defaultChecked={item.hasDiscount} className='mr-2' onCheckedChange={() => toggleDiscount(item)} />{item.title} - <span className='text-muted'>{item.category}</span></div>))}
    </div>
}
