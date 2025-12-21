'use client'
import { ForecastTimelineData } from "@/lib/types";
import { ScenarioItem } from "@/lib/schemas";
import { atom, useAtom, useSetAtom } from "jotai";

import { Input } from "./ui/input";
import { calculateMonthlyBurn } from "@/domain/forecast";
import { RecurringItemInterval } from "@/lib/schemas";
import { eurFormatter } from "./format";

// Jotai atoms for state management
export const variableCostsAtom = atom<number>(0)
export const scenariosAtom = atom<ScenarioItem[]>([])

// Hook to initialize atoms with data
export function useInitializeForecastAtoms(data: ForecastTimelineData | undefined) {
    const setVariableCosts = useSetAtom(variableCostsAtom);
    const setScenarios = useSetAtom(scenariosAtom);

    // Only set initial values if data is provided
    if (data) {
        setVariableCosts(data.estimatedMonthlyVariableCosts ?? 0);
        setScenarios(data?.scenarios ?? []);
    }
}

export function VariableCosts({ recurringItems }: { recurringItems: ForecastTimelineData['recurringItems'] }) {
    const [variableCosts, setVariableCosts] = useAtom(variableCostsAtom);

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
            value={variableCosts}
            onChange={e => setVariableCosts(Number(e.target.value))}
        />

    </div>
}

// Component to initialize Jotai atoms with server data
export function ForecastDataInitializer({ data }: { data: ForecastTimelineData }) {
    useInitializeForecastAtoms(data);
    return null;
}