import { getScenarioItems } from "@/lib/db"
import { cacheTag } from "next/cache"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScenariosTable } from "@/components/settings/scenarios-table"

export default async function SettingsPage() {
    'use cache'
    cacheTag('snapshots')

    const scenarios = await getScenarioItems()

    return (
        <div className="flex flex-col h-dvh">
            <header className="flex items-center gap-2 m-3 ml-8">
                <SidebarTrigger className="-ml-1 mr-3" />
                <div className="flex flex-col grow">
                    <h1 className="text-3xl">Settings</h1>
                    <h2 className="text-muted-foreground">Scenario Management</h2>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-4">
                <ScenariosTable scenarios={scenarios} />
            </main>
        </div>
    )
}
