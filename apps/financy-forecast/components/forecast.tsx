import { getForecastData } from "@/lib/data"
import { Option } from 'effect';
import { isNone } from "effect/Option";
import { eurFormatter } from "./format";
import { addMonths, isAfter, isEqual, format, startOfMonth } from "date-fns";
import { now } from "./utils";
import { cacheTag } from "next/cache";
import { RecurringItem, ScenarioItem, RecurringItemInterval } from "@/lib/schemas";
import { ForecastTimelineData, TimelineMonth } from "@/lib/types";
import { cn } from "@/lib/utils";

export function formatMonthNumericYYMM(monthOffset: number): string {
    const today = now();
    const targetMonth = addMonths(startOfMonth(today), monthOffset);
    return format(targetMonth, "yy-MM");
}

export function calculateTimeline(
    monthCount: number,
    variableCosts: number,
    startBalance: number,
    recurringItems: RecurringItem[],
    scenarios: ScenarioItem[]
): TimelineMonth[] {
    console.log({
        monthCount,
        variableCosts,
        startBalance,
    })
    const months: TimelineMonth[] = [];
    let runningBalance = startBalance;

    // Alle positiven monatlichen Einnahmen
    const baseIncome = recurringItems
        .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount > 0)
        .reduce((sum, item) => sum + item.amount, 0);

    // Alle negativen monatlichen Ausgaben + variable Kosten
    const monthlyBurn = variableCosts + Math.abs(
        recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    );

    for (let i = 0; i < monthCount; i++) {
        // 1. Regular Cashflow
        runningBalance += baseIncome;
        runningBalance -= monthlyBurn;

        // 2. Quarterly & Yearly Fixed Costs
        const irregularCosts = recurringItems.filter(fc => {
            if (fc.interval === RecurringItemInterval.MONTHLY) return false;
            if (fc.interval === RecurringItemInterval.YEARLY) return (i) % 12 === 0;
            if (fc.interval === RecurringItemInterval.QUARTERLY) return (i) % 3 === 0;
            return false;
        });

        // Apply Irregular Costs
        const costsTotal = irregularCosts.reduce((sum, c) => sum + c.amount, 0);
        runningBalance -= costsTotal;

        // 3. Scenarios - Filter für aktuellen Monat
        const targetMonth = addMonths(startOfMonth(now()), i);
        const monthScenarios = scenarios.filter(scenario => {
            const scenarioMonth = startOfMonth(scenario.date);
            return isEqual(scenarioMonth, targetMonth) && scenario.isActive;
        });

        const scenariosTotal = monthScenarios.reduce((sum, s) => sum + s.amount, 0);
        runningBalance += scenariosTotal;

        months.push({
            index: i,
            name: formatMonthNumericYYMM(i),
            balance: runningBalance,
            scenarios: monthScenarios,
            irregularCosts: irregularCosts,
            isCritical: runningBalance < 0
        });
    }
    return months;
}

export async function Forecast({ variableCosts }: { variableCosts: number }) {
    'use cache'
    cacheTag('snapshots')

    const forecastDataResult = await getForecastData()

    if (isNone(forecastDataResult)) {
        return <div>No data</div>
    }

    const forecastData = Option.getOrThrow(forecastDataResult);
    return <Timeline data={forecastData} variableCosts={variableCosts} />
}

async function Timeline({ data, variableCosts }: { data: ForecastTimelineData; variableCosts: number }) {
    const months = calculateTimeline(
        24, // 24 Monate für den Forecast
        variableCosts,
        data.startAmount,
        data.recurringItems,
        data.scenarios
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
                                        {eurFormatter.format(month.balance)}                                    </span>
                                    {month.isCritical && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                            ALERT
                                        </span>
                                    )}
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
                                                {sc.name}
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
                                                            <span className="text-[10px] opacity-70 font-mono">-{eurFormatter.format(fc.amount)}</span>
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

export function calculateApprovable(lastDate: Date): boolean {
    const approvableDate = addMonths(lastDate, 2)
    const today = now()
    return isAfter(today, approvableDate) || isEqual(today, approvableDate)
}
