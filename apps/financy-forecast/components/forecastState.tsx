'use client'
import { ForecastTimelineData } from "@/lib/types";
import { ScenarioItem } from "@/lib/schemas";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import { Input } from "./ui/input";
import { calculateMonthlyBurn, calculateTimeline } from "@/domain/forecast";
import { RecurringItemInterval } from "@/lib/schemas";
import { eurFormatter } from "./format";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

// Jotai atoms for state management
export const variableCostsAtom = atom<number>(0)

/**
 * This Atom tracks only changed scenario items!
 */
export const scenariosAtom = atom<ScenarioItem[]>([])

// Hook to initialize atoms with data
export function useInitializeForecastAtoms(data: ForecastTimelineData | undefined) {
    const setVariableCosts = useSetAtom(variableCostsAtom);

    // TODO aktuell ist die Logik dupliziert hier und bei der erstellung der Atoms welche werte als initialisierung benutzt werden. Erstelle ein object mit den initialen werten und benutze dieses für die initalisierung an beiden stellen.
    if (data) {
        setVariableCosts(data.estimatedMonthlyVariableCosts ?? 0);
    }
}

// Component to initialize Jotai atoms with server data
export function ForecastDataInitializer({ data }: { data: ForecastTimelineData }) {
    useInitializeForecastAtoms(data);
    return null;
}

export function VariableCosts({ recurringItems }: { recurringItems: ForecastTimelineData['recurringItems'] }) {
    const [variableCosts, setVariableCosts] = useAtom(variableCostsAtom);

    const monthlyBurn = calculateMonthlyBurn(recurringItems, variableCosts)
    const recurringCosts = Math.abs(
        recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    )

    // TODO im onChange handler muss der euro wert in cents konvertiert werden, beim anzeigen über `value` muss der cent wert in euro konvertiert werden. 
    return <div className="flex text-nowrap items-center">
        <div>monthly burn: {eurFormatter.format(monthlyBurn)}&nbsp;=&nbsp;</div>
        <div>recurring: {recurringCosts}&nbsp;+&nbsp;</div>
        <Input
            type="number"
            value={variableCosts}
            onChange={e => setVariableCosts(Number(e.target.value))}
        />

    </div>
}

export function Timeline({ data }: { data: ForecastTimelineData; }) {
    const variableCosts = useAtomValue(variableCostsAtom);
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
                                                    sc.isActive ? "border-slate-200" : "opacity-60 grayscale border-dashed bg-slate-50"
                                                )}
                                            >
                                                <ScenarioSwtich sc={sc} />
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
    );
}


/**
 * Switch item for ScenarioItem.
 */
// TODO fix den typo
function ScenarioSwtich({ sc }: { sc: ScenarioItem }) {
    // TODO passe die beschreibung der Komponente an. Als initialien Wert (defaultValue) bekommt der Swtich den wert aus `data` vom server ob das Szenario aktiv ist oder nicht. Danach wird der state vom client verwaltet. Falls beim onChange event der Wert nicht derselbe ist wie vom server muss dieses scenario item im jotai state gespeichert werden. Ist das item schon im jotai state muss es da raus gelöscht werden. Der jotai state trackt welche Items nicht den wert der server daten haben. Daraus lässt sich dann auch der wert für die Switch komponente unten berechnen. 
    return <div className="flex items-center space-x-2">
        <Switch id={sc.id} />
        <Label htmlFor={sc.id}>{sc.name}   {eurFormatter.format(sc.amount / 100)}</Label>
    </div>;
}

export function SaveForecast() {
    // TODO dieser button ist nur clickbar, wenn die variablen costen im jotai state nicht dem vom server entsprechen oder es element in jotai szenario state gibt. on click wird aktuell über console.log ausgegeben was aktuell im jotai state für beide werte ist
    return <Button>save</Button>
}