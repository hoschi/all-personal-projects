import { getForecastData } from "@/lib/data"
import { Option } from 'effect';
import { eurFormatter } from "./format";
import { cacheTag } from "next/cache";
import { ForecastTimelineData } from "@/lib/types";
import { RecurringItemInterval } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
    SidebarTrigger,
} from "./ui/sidebar";
// Import domain functions from new domain layer
import { calculateTimeline, calculateMonthlyBurn } from "../domain/forecast";


export async function Forecast() {
    'use cache'
    cacheTag('snapshots')

    const forecastDataResult = await getForecastData()
    // WARNING: variableCosts sind fix für jetzt, kommen später aus input field
    const variableCosts = 1000

    return (
        <>
            <header className="flex items-center gap-2 m-3 ml-8">
                <SidebarTrigger className="-ml-1 mr-3" />
                <div className="flex flex-col">
                    <h1 className="text-3xl">Forecast</h1>
                    <h2 className="text-muted-foreground">Where the Future starts</h2>
                    {Option.match(forecastDataResult, {
                        onNone: () => <div>no data</div>,
                        onSome: (data) => <ForecastHeader data={data} variableCosts={variableCosts} />
                    })}
                </div>
            </header>
            <div className="p-4">
                {Option.match(forecastDataResult, {
                    onNone: () => <div>no data</div>,
                    onSome: (data) => <Timeline data={data} variableCosts={variableCosts} />
                })}
            </div>
        </>
    )
}


export function ForecastHeader({ data, variableCosts }: { data: ForecastTimelineData; variableCosts: number }) {
    const startAmount = data.startAmount
    const monthlyBurn = calculateMonthlyBurn(data.recurringItems, variableCosts)
    const recurringCosts = Math.abs(
        data.recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    )
    return <div className="flex flex-col">
        <h1 className="text-3xl">Forecast</h1>
        <h2 className="text-muted-foreground">Where the Future starts</h2>
        <div>start:{startAmount}</div>
        <div>monthly burn:{monthlyBurn}</div>
        <div>recurring: {recurringCosts} + variable:{variableCosts}</div>
    </div>
}

async function Timeline({ data, variableCosts }: { data: ForecastTimelineData; variableCosts: number }) {
    const months = calculateTimeline(
        24, // 24 Monate für den Forecast
        variableCosts,
        data.startAmount,
        data.recurringItems,
        data.scenarios,
        data.lastSnapshotDate
    );

    return (
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex flex-col flex-wrap content-start h-full gap-4 pr-4">
                {months.map((month) => {
                    const hasEvents = month.scenarios.length > 0 || month.irregularCosts.length > 0;

                    return (
                        <div
                            key={month.index}
                            className={cn(
                                "w-[340px] md:w-[360px] flex-shrink-0 relative rounded-sm border transition-all duration-200 group",
                                // Conditional styling for "Flat/Compact" vs "Card/Expanded" feel
                                hasEvents
                                    ? "bg-white border-slate-300 shadow-sm"
                                    : "bg-slate-100 border-slate-200 opacity-90 hover:opacity-100 hover:border-slate-300",
                                month.isCritical && "border-red-300 bg-red-50/50",
                                hasEvents ? "flex flex-col" : "flex items-center h-[60px] px-4"
                            )}
                        >
                            {/* Header Area */}
                            <div className={cn(
                                "flex-shrink-0 flex items-center justify-between transition-all",
                                hasEvents
                                    ? "bg-slate-50/50 border-b border-slate-100 p-3 w-full rounded-t-sm"
                                    : "w-full bg-transparent"
                            )}>
                                <div className="flex items-center gap-3">
                                    <span className={cn("font-bold font-mono tracking-tight text-slate-700", hasEvents ? "text-base" : "text-sm text-slate-500")}>
                                        {month.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "font-mono font-bold tracking-tight transition-colors",
                                        hasEvents ? "text-lg" : "text-sm",
                                        month.balance < 0 ? "text-red-600" : "text-emerald-700"
                                    )}>
                                        {eurFormatter.format(month.balance / 100)}                                    </span>
                                </div>
                            </div>

                            {/* Content Area (Only if hasEvents) */}
                            {hasEvents && (
                                <div className="flex-1 p-3">
                                    <div className="flex flex-col gap-2">

                                        {/* Scenarios */}
                                        {month.scenarios.map(sc => (
                                            <div
                                                key={sc.id}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2.5 rounded-sm border shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md select-none bg-white group/item",
                                                    sc.isActive ? "border-slate-200" : "opacity-60 grayscale border-dashed bg-slate-50",
                                                )}
                                            >
                                                {sc.name}   {eurFormatter.format(sc.amount / 100)}
                                            </div>
                                        ))}

                                        {/* Fixed Costs */}
                                        {month.irregularCosts.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1 mt-auto">
                                                {month.irregularCosts.map((fc, idx) => (
                                                    <div
                                                        key={`fc-${month.index}-${idx}`}
                                                        className="flex items-center gap-2 px-2 py-1.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-500 w-full"
                                                    >
                                                        <div className="flex items-center justify-between w-full leading-none">
                                                            <span className="text-[10px] font-medium truncate">{fc.name}</span>
                                                            <span className="text-[10px] opacity-70 font-mono">{eurFormatter.format(fc.amount / 100)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}