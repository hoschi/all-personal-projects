'use client'
import { ForecastTimelineData } from "@/lib/types";
import { createContext, useContext, useState } from "react";
import { identity, Option } from 'effect';
import { Input } from "./ui/input";
import { calculateMonthlyBurn } from "@/domain/forecast";
import { RecurringItemInterval } from "@/lib/schemas";
import { eurFormatter } from "./format";

// TODO add type, use existing ones
const CurrentState = createContext({
    variableCosts: 0,
    scenarios: [],
    setCurrentData: () => { }
})

export function ForecastState({ data, children }: { data: ForecastTimelineData | undefined }) {
    const [currentData, setCurrentData] = useState({
        variableCosts: data?.estimatedMonthlyVariableCosts,
        scenarios: data?.scenarios,
        setCurrentData: () => { }
    })

    return <CurrentState value={data ? { ...currentData, setCurrentData } : {
        // TODO reuse with above
        variableCosts: 0,
        scenarios: [],
        setCurrentData: () => { }

    }}>{children}</CurrentState>
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
        <Input type="number" defaultValue={state.variableCosts} onChange={e => state.setCurrentData({ ...state, variableCosts: Number(e.target.value) })} />

    </div>
}