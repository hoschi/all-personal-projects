import { CurrentEdit } from "@/components/current-edit"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getCurrentEditData } from "@/lib/data"
import { Suspense } from "react"

async function CurrentEditPageContent() {
  const data = await getCurrentEditData()
  return <CurrentEdit data={data} />
}

export default function CurrentEditPage() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex items-center gap-2 m-3 ml-8">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex flex-col grow">
          <h1 className="text-3xl">Edit Current Balances</h1>
          <h2 className="text-muted-foreground">
            Compare latest snapshot and current balances.
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Suspense fallback={<div>Loading current balances...</div>}>
          <CurrentEditPageContent />
        </Suspense>
      </main>
    </div>
  )
}
