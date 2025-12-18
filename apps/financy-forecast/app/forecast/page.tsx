import { Forecast } from "@/components/forecast"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
    // WRANING variableCosts sind fix für jetzt, kommen später aus input field
    return (
        <>
            <header className="flex items-center gap-2 m-3 ml-8">
                <SidebarTrigger className="-ml-1 mr-3" />
                <div className="flex flex-col">
                    <h1 className="text-3xl">Forecast</h1>
                    <h2 className="text-muted-foreground">Where the Future starts</h2>

                </div>
            </header>
            <div className="p-4">
                <Forecast variableCosts={240000} />
            </div>
        </>
    )
}
