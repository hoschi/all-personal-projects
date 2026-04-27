import { Matrix } from "@/components/matrix"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <>
      <header className="flex items-center gap-2 m-3 ml-8">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex flex-col">
          <h1 className="text-3xl">Financial Matrix</h1>
          <h2 className="text-muted-foreground">
            Historical snapshot and asset distribution.
          </h2>
        </div>
      </header>
      <div className="p-4">
        <Matrix />
      </div>
    </>
  )
}
