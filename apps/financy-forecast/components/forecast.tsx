import { getForecastData } from "@/lib/data"
import { Option } from 'effect';
import { eurFormatter } from "./format";
import { cacheTag } from "next/cache";
import { ForecastTimelineData } from "@/lib/types";
import {
    SidebarTrigger,
} from "./ui/sidebar";
import { VariableCosts, ForecastDataInitializer, Timeline, SaveForecast } from "./forecastState";

export async function Forecast() {
    'use cache'
    cacheTag('snapshots')

    const forecastDataResult = await getForecastData()
    const forecastData = Option.getOrUndefined(forecastDataResult)

    return (
        <div className="flex flex-col h-dvh">
            {forecastData && <ForecastDataInitializer forecastData={forecastData} />}
            <header className="flex items-center gap-2 m-3 ml-8">
                <SidebarTrigger className="-ml-1 mr-3" />
                <div className="flex flex-col grow">
                    <h1 className="text-3xl">Forecast</h1>
                    <h2 className="text-muted-foreground">Where the Future starts</h2>
                    {Option.match(forecastDataResult, {
                        onNone: () => <div>no data</div>,
                        onSome: (forecastData) => <ForecastHeader forecastData={forecastData} />
                    })}
                </div>
            </header>
            {Option.match(forecastDataResult, {
                onNone: () => <div>no data</div>,
                onSome: (forecastData) => <Timeline forecastData={forecastData} />
            })}
        </div>
    )
}


/*
export async function Forecast() {
                'use cache'
    cacheTag('snapshots')

            const forecastDataResult = await getForecastData()
            const forecastData = Option.getOrUndefined(forecastDataResult)

            return (
            <div className="bg-amber-300 flex flex-col p-4 overflow-hidden h-dvh overflow-x-auto overflow-y-hidden">
                <header>
                    header
                </header>
                <div className="bg-red-500 flex-1 flex flex-col p-4 flex-wrap h-full">
                    {data.map((_, i) => (
                        <div key={i} className="w-[340px] md:w-[360px] flex-shrink-0 relative rounded-sm border transition-all duration-200 group bg-slate-100 border-slate-200 opacity-90 hover:opacity-100 hover:border-slate-300 flex items-center h-[60px] px-4">test {i}</div>
                    ))}
                </div>
            </div>
            )
}
            */

export function ForecastHeader({ forecastData }: { forecastData: ForecastTimelineData; }) {
    const startAmount = forecastData.startAmount

    return <div className="flex flex-col">
        <div>start:{eurFormatter.format(startAmount)}</div>
        <VariableCosts recurringItems={forecastData.recurringItems} />
        <SaveForecast forecastData={forecastData} />
    </div>
}