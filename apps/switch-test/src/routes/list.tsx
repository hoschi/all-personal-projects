import { Switch } from '@/components/ui/switch'
import { getListItems } from '@/data/actions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/list')({
    component: RouteComponent,
    loader: async () => {
        const listItems = await getListItems()
        return { items: listItems }
    }
})

function RouteComponent() {
    const { items } = Route.useLoaderData()
    return <div>
        {items.map(item => (<div className='bg-gray-400 p-2 m-2' key={item.id}><Switch defaultChecked={item.hasDiscount} className='mr-2' />{item.title} - <span className='text-muted'>{item.category}</span></div>))}
    </div>
}
