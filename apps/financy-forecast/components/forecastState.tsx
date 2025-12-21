'use client'
import { ForecastTimelineData } from "@/lib/types";
import { ScenarioItem } from "@/lib/schemas";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Array } from "effect";
import { match, P } from 'ts-pattern';

import { Input } from "./ui/input";
import { calculateMonthlyBurn, calculateTimeline } from "@/domain/forecast";
import { RecurringItemInterval } from "@/lib/schemas";
import { eurFormatter } from "./format";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const INITIAL_STATE = {
    variableCosts: 0
} as const

// Jotai atoms for state management (values stored in cents)
export const variableCostsAtom = atom<number>(INITIAL_STATE.variableCosts)

/**
 * This Atom tracks only changed scenario items!
 */
export const scenariosAtom = atom<ScenarioItem[]>([])

// Hook to initialize atoms with data
export function useInitializeForecastAtoms(forecastData: ForecastTimelineData | undefined) {
    const setVariableCosts = useSetAtom(variableCostsAtom);

    if (forecastData) {
        setVariableCosts(forecastData.estimatedMonthlyVariableCosts ?? INITIAL_STATE.variableCosts);
    }
}

// Component to initialize Jotai atoms with server data
export function ForecastDataInitializer({ forecastData }: { forecastData: ForecastTimelineData }) {
    useInitializeForecastAtoms(forecastData);
    return null;
}

export function VariableCosts({ recurringItems }: { recurringItems: ForecastTimelineData['recurringItems'] }) {
    const [variableCosts, setVariableCosts] = useAtom(variableCostsAtom);

    // Convert cents to euros for display
    const variableCostsEuros = variableCosts / 100;
    const monthlyBurn = calculateMonthlyBurn(recurringItems, variableCosts)
    const recurringCosts = Math.abs(
        recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    )

    return <div className="flex text-nowrap items-center">
        <div>monthly burn: {eurFormatter.format(monthlyBurn)}&nbsp;=&nbsp;</div>
        <div>recurring: {recurringCosts}&nbsp;+&nbsp;</div>
        <Input
            type="number"
            step="0.01"
            value={variableCostsEuros.toFixed(2)}
            onChange={e => setVariableCosts(Math.round(Number(e.target.value) * 100))}
        />

    </div>
}

export function Timeline({ forecastData }: { forecastData: ForecastTimelineData; }) {
    const variableCosts = useAtomValue(variableCostsAtom);
    const changedScenarios = useAtomValue(scenariosAtom);

    // Merge server data with changed scenarios from Jotai atom
    const mergedScenarios = forecastData.scenarios.map(serverScenario => {
        const changedScenario = changedScenarios.find(s => s.id === serverScenario.id);
        return changedScenario || serverScenario;
    });

    const months = calculateTimeline(
        24, // 24 Monate für den Forecast
        variableCosts,
        forecastData.startAmount,
        forecastData.recurringItems,
        mergedScenarios,
        forecastData.lastSnapshotDate
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
                                                <ScenarioSwitch scenario={sc} />
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
function ScenarioSwitch({ scenario }: { scenario: ScenarioItem }) {
    const [scenarios, setScenarios] = useAtom(scenariosAtom);

    // Check if this scenario is in the jotai state (means it has been changed)
    const changedScenario = scenarios.find(s => s.id === scenario.id);

    // If scenario is changed, use the jotai value, otherwise use server value
    const currentValue = changedScenario ? changedScenario.isActive : scenario.isActive;

    const handleToggle = () => {
        const newValue = !currentValue;

        const updatedScenario = { ...scenario, isActive: newValue };

        setScenarios(prev => {
            const existingIndexOption = Array.findFirstIndex<ScenarioItem>(
                (item: ScenarioItem) => item.id === scenario.id
            )(prev);

            const shouldRemove = newValue === scenario.isActive;

            return match([existingIndexOption, shouldRemove])
                .with([{ _tag: 'Some', value: P.number }, true], () =>
                    Array.filter<ScenarioItem>((item: ScenarioItem) => item.id !== scenario.id)(prev)
                )
                .with([{ _tag: 'Some', value: P.number }, false], ([option]) =>
                    Array.replace<ScenarioItem>(option.value, updatedScenario)(prev)
                )
                .with([{ _tag: 'None' }, true], () => prev)
                .with([{ _tag: 'None' }, false], () =>
                    Array.append<ScenarioItem>(updatedScenario)(prev)
                )
                .exhaustive();
        });
    };

    return <div className="flex items-center space-x-2">
        <Switch
            id={scenario.id}
            checked={currentValue}
            onCheckedChange={handleToggle}
        />
        <Label htmlFor={scenario.id}>{scenario.name}   {eurFormatter.format(scenario.amount / 100)}</Label>
    </div>;
}

export function SaveForecast({ forecastData }: { forecastData: ForecastTimelineData }) {
    const variableCosts = useAtomValue(variableCostsAtom);
    const scenarios = useAtomValue(scenariosAtom);

    // Check if there are changes compared to server data
    const hasVariableCostsChanged = variableCosts !== (forecastData.estimatedMonthlyVariableCosts ?? 0);
    const hasScenariosChanged = scenarios.length > 0;
    const hasChanges = hasVariableCostsChanged || hasScenariosChanged;

    const handleSave = () => {
        console.log('Current Jotai State:');
        console.log('Variable Costs (cents):', variableCosts);
        console.log('Scenarios:', scenarios);
    };

    return <Button disabled={!hasChanges} onClick={handleSave}>save</Button>
}