'use client'
import { ForecastTimelineData } from "@/lib/types";
import { ScenarioItem } from "@/lib/schemas";
import { createContext, useContext, useState, useCallback } from "react";

import { Input } from "./ui/input";
import { calculateMonthlyBurn } from "@/domain/forecast";
import { RecurringItemInterval } from "@/lib/schemas";
import { eurFormatter } from "./format";

// Type for the forecast state context
type ForecastStateType = {
    variableCosts: number;
    scenarios: ScenarioItem[];
}

const CurrentState = createContext<ForecastStateType & { setCurrentData: (data: Partial<ForecastStateType>) => void }>({
    variableCosts: 0,
    scenarios: [],
    setCurrentData: () => { }
})

export function ForecastState({ data, children }: { data: ForecastTimelineData | undefined, children: React.ReactNode }) {
    const [currentData, setCurrentData] = useState<ForecastStateType>({
        variableCosts: data?.estimatedMonthlyVariableCosts ?? 0,
        scenarios: data?.scenarios ?? []
    })

    const updateCurrentData = useCallback((newData: Partial<ForecastStateType>) => {
        setCurrentData(prev => ({ ...prev, ...newData }))
    }, [])

    const contextValue = {
        ...currentData,
        setCurrentData: updateCurrentData
    }

    return <CurrentState value={contextValue}>{children}</CurrentState>
}

export function VariableCosts({ recurringItems }: { recurringItems: ForecastTimelineData['recurringItems'] }) {
    const state = useContext(CurrentState)
    const monthlyBurn = calculateMonthlyBurn(recurringItems, state.variableCosts)
    const recurringCosts = Math.abs(
        recurringItems
            .filter(item => item.interval === RecurringItemInterval.MONTHLY && item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    )

    return <div className="flex text-nowrap items-center">
        <div>monthly burn: {eurFormatter.format(monthlyBurn)}&nbsp;=&nbsp;</div>
        <div>recurring: {recurringCosts}&nbsp;+&nbsp;</div>
        <Input type="number" defaultValue={state.variableCosts} onChange={e => state.setCurrentData({ variableCosts: Number(e.target.value) })} />

    </div>
}