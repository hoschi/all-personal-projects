import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <>
      <header className="flex items-center gap-2 m-3 ml-8">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex flex-col">
          <h1 className="text-3xl">Financial Matrix</h1>
          <h2 className="text-muted-foreground">Historical snapshot and asset distribution.</h2>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          content1
        </div>
      </div>
    </>
  )
}
