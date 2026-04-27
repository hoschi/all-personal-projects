import { createServerFn } from "@tanstack/react-start"
import { format } from "date-fns"
import { Either, Option } from "effect"
import { z } from "zod"
import {
  approveCurrentBalancesAsSnapshot,
  changeSettings,
  getLatestAssetSnapshot,
  getScenarioItems,
  updateAccountCurrentBalances,
  updateForcastScenario,
} from "./db"
import { getCurrentEditData, getForecastData, getMatrixData } from "./data"
import { saveForecastSchema } from "./schemas"
import {
  calculateApprovable,
  calculateEarliestApprovalDate,
  calculateInitialSnapshotDate,
  calculateNextSnapshotDate,
} from "@/domain/snapshots"
import { SnapshotNotApprovableError } from "@/domain/approveErrors"
import { parseCurrentBalanceValue } from "@/domain/currentBalances"

const currentBalanceUpdateEntrySchema = z.object({
  accountId: z.uuid(),
  currentBalance: z.number().int(),
})

const saveCurrentBalancesSchema = z.object({
  updates: z.array(currentBalanceUpdateEntrySchema).min(1),
})

const saveCurrentBalancesFormSchema = z.object({
  valuesByAccountId: z.record(z.string().trim().min(1), z.string()),
})

export const getMatrixDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await getMatrixData(4)
    return Option.match(result, {
      onNone: () => null,
      onSome: (value) => value,
    })
  },
)

export const getForecastDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await getForecastData()
    return Option.match(result, {
      onNone: () => null,
      onSome: (value) => value,
    })
  },
)

export const getCurrentEditDataFn = createServerFn({ method: "GET" }).handler(
  async () => getCurrentEditData(),
)

export const getScenarioItemsFn = createServerFn({ method: "GET" }).handler(
  async () => getScenarioItems(),
)

export const updateScenarioIsActiveFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      scenarioId: z.uuid(),
      isActive: z.boolean(),
    }).parse,
  )
  .handler(async ({ data }) => {
    await updateForcastScenario({
      id: data.scenarioId,
      isActive: data.isActive,
    })

    return {
      success: true as const,
    }
  })

export const saveForecastFn = createServerFn({ method: "POST" })
  .inputValidator(saveForecastSchema.parse)
  .handler(async ({ data }) => {
    await changeSettings({
      estimatedMonthlyVariableCosts: data.variableCosts,
    })

    await Promise.all(
      data.scenarios.map((scenario) => updateForcastScenario(scenario)),
    )

    return {
      success: true as const,
    }
  })

export const approveSnapshotFn = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const latestSnapshotResult = await getLatestAssetSnapshot()

      const snapshotDate = Option.match(latestSnapshotResult, {
        onNone: () => calculateInitialSnapshotDate(),
        onSome: (lastSnapshot) => {
          const isApprovable = calculateApprovable(lastSnapshot.date)
          if (!isApprovable) {
            throw new SnapshotNotApprovableError(
              calculateEarliestApprovalDate(lastSnapshot.date),
            )
          }

          return calculateNextSnapshotDate(lastSnapshot.date)
        },
      })

      await approveCurrentBalancesAsSnapshot(snapshotDate)
      return { success: true as const }
    } catch (error) {
      if (error instanceof SnapshotNotApprovableError) {
        return {
          success: false as const,
          error: `Snapshot is not approvable yet. Earliest approval date: ${format(
            error.earliestApprovalDate,
            "yyyy-MM-dd",
          )}.`,
        }
      }

      throw error
    }
  },
)

function extractCurrentBalanceUpdates(
  valuesByAccountId: Record<string, string>,
): { accountId: string; currentBalance: number }[] {
  return Object.entries(valuesByAccountId).map(([accountId, value]) => {
    const parsedBalance = parseCurrentBalanceValue(value)

    if (Either.isLeft(parsedBalance)) {
      throw new Error(parsedBalance.left)
    }

    return {
      accountId,
      currentBalance: parsedBalance.right,
    }
  })
}

export const saveCurrentBalancesFn = createServerFn({ method: "POST" })
  .inputValidator(saveCurrentBalancesFormSchema.parse)
  .handler(async ({ data }) => {
    const updates = extractCurrentBalanceUpdates(data.valuesByAccountId)
    const validatedUpdates = saveCurrentBalancesSchema.parse({ updates })
    const changedRows = await updateAccountCurrentBalances(
      validatedUpdates.updates,
    )

    return {
      success: true as const,
      changedRows,
    }
  })
