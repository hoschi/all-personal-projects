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
    cacheTag('scenarios')

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

export function ForecastHeader({ forecastData }: { forecastData: ForecastTimelineData; }) {
    const startAmount = forecastData.startAmount

    return <div className="flex flex-col">
        <div>start:{eurFormatter.format(startAmount / 100)}</div>
        <VariableCosts recurringItems={forecastData.recurringItems} />
        <SaveForecast forecastData={forecastData} />
    </div>
}