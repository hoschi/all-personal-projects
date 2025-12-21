import { getForecastData } from "@/lib/data"
import { Option } from 'effect';
import { eurFormatter } from "./format";
import { cacheTag } from "next/cache";
import { ForecastTimelineData } from "@/lib/types";
import {
    SidebarTrigger,
} from "./ui/sidebar";
// Import domain functions from new domain layer
// import { calculateTimeline } from "../domain/forecast"; // Not currently used
import { VariableCosts, ForecastDataInitializer, Timeline } from "./forecastState";

export async function Forecast() {
    'use cache'
    cacheTag('snapshots')

    // TODO `forecastDataResult` soll der name sein wenn es vom Typ Option ist, sonst in den forecastXY files mit den React Kopmonenten muss es forecastData heißen wenn es "ausgepackt" wurde, hier habe ich oft nur `data` geschrieben
    const forecastDataResult = await getForecastData()
    const forecastData = Option.getOrUndefined(forecastDataResult)

    return (
        <>
            {forecastData && <ForecastDataInitializer data={forecastData} />}
            <header className="flex items-center gap-2 m-3 ml-8">
                <SidebarTrigger className="-ml-1 mr-3" />
                <div className="flex flex-col grow">
                    <h1 className="text-3xl">Forecast</h1>
                    <h2 className="text-muted-foreground">Where the Future starts</h2>
                    {Option.match(forecastDataResult, {
                        onNone: () => <div>no data</div>,
                        onSome: (data) => <ForecastHeader data={data} />
                    })}
                </div>
            </header>
            <div className="p-4">
                {Option.match(forecastDataResult, {
                    onNone: () => <div>no data</div>,
                    onSome: (data) => <Timeline data={data} />
                })}
            </div>
        </>
    )
}

export function ForecastHeader({ data }: { data: ForecastTimelineData; }) {
    const startAmount = data.startAmount

    return <div className="flex flex-col">
        <div>start:{eurFormatter.format(startAmount)}</div>
        <VariableCosts recurringItems={data.recurringItems} />
    </div>
}