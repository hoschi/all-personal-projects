import { createServerFn } from "@tanstack/react-start"
import { format } from "date-fns"
import Debug from "debug"
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

const debugGetMatrixDataFn = Debug("app:actions:getMatrixDataFn")
const debugGetForecastDataFn = Debug("app:actions:getForecastDataFn")
const debugGetCurrentEditDataFn = Debug("app:actions:getCurrentEditDataFn")
const debugGetScenarioItemsFn = Debug("app:actions:getScenarioItemsFn")
const debugUpdateScenarioIsActiveFn = Debug(
  "app:actions:updateScenarioIsActiveFn",
)
const debugSaveForecastFn = Debug("app:actions:saveForecastFn")
const debugApproveSnapshotFn = Debug("app:actions:approveSnapshotFn")
const debugExtractCurrentBalanceUpdates = Debug(
  "app:actions:extractCurrentBalanceUpdates",
)
const debugSaveCurrentBalancesFn = Debug("app:actions:saveCurrentBalancesFn")

export const getMatrixDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    debugGetMatrixDataFn("start")
    try {
      const result = await getMatrixData(4)
      const payload = Option.match(result, {
        onNone: () => null,
        onSome: (value) => value,
      })
      debugGetMatrixDataFn("success hasData=%s", payload !== null)
      return payload
    } catch (error) {
      debugGetMatrixDataFn("error %O", error)
      throw error
    }
  },
)

export const getForecastDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    debugGetForecastDataFn("start")
    try {
      const result = await getForecastData()
      const payload = Option.match(result, {
        onNone: () => null,
        onSome: (value) => value,
      })
      debugGetForecastDataFn("success hasData=%s", payload !== null)
      return payload
    } catch (error) {
      debugGetForecastDataFn("error %O", error)
      throw error
    }
  },
)

export const getCurrentEditDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    debugGetCurrentEditDataFn("start")
    try {
      const result = await getCurrentEditData()
      debugGetCurrentEditDataFn("success rows=%d", result.rows.length)
      return result
    } catch (error) {
      debugGetCurrentEditDataFn("error %O", error)
      throw error
    }
  },
)

export const getScenarioItemsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    debugGetScenarioItemsFn("start")
    try {
      const result = await getScenarioItems()
      debugGetScenarioItemsFn("success count=%d", result.length)
      return result
    } catch (error) {
      debugGetScenarioItemsFn("error %O", error)
      throw error
    }
  },
)

export const updateScenarioIsActiveFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      scenarioId: z.uuid(),
      isActive: z.boolean(),
    }).parse,
  )
  .handler(async ({ data }) => {
    debugUpdateScenarioIsActiveFn(
      "start scenarioId=%s isActive=%s",
      data.scenarioId,
      data.isActive,
    )
    try {
      await updateForcastScenario({
        id: data.scenarioId,
        isActive: data.isActive,
      })
      debugUpdateScenarioIsActiveFn("success scenarioId=%s", data.scenarioId)
      return {
        success: true as const,
      }
    } catch (error) {
      debugUpdateScenarioIsActiveFn("error %O", error)
      throw error
    }
  })

export const saveForecastFn = createServerFn({ method: "POST" })
  .inputValidator(saveForecastSchema.parse)
  .handler(async ({ data }) => {
    debugSaveForecastFn(
      "start variableCosts=%d changedScenarios=%d",
      data.variableCosts,
      data.scenarios.length,
    )
    try {
      await changeSettings({
        estimatedMonthlyVariableCosts: data.variableCosts,
      })

      await Promise.all(
        data.scenarios.map((scenario) => updateForcastScenario(scenario)),
      )

      debugSaveForecastFn("success")
      return {
        success: true as const,
      }
    } catch (error) {
      debugSaveForecastFn("error %O", error)
      throw error
    }
  })

export const approveSnapshotFn = createServerFn({ method: "POST" }).handler(
  async () => {
    debugApproveSnapshotFn("start")
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
      debugApproveSnapshotFn("success snapshotDate=%s", snapshotDate)
      return { success: true as const }
    } catch (error) {
      if (error instanceof SnapshotNotApprovableError) {
        debugApproveSnapshotFn(
          "notApprovable earliestApprovalDate=%s",
          error.earliestApprovalDate,
        )
        return {
          success: false as const,
          error: `Snapshot is not approvable yet. Earliest approval date: ${format(
            error.earliestApprovalDate,
            "yyyy-MM-dd",
          )}.`,
        }
      }

      debugApproveSnapshotFn("error %O", error)
      throw error
    }
  },
)

function extractCurrentBalanceUpdates(
  valuesByAccountId: Record<string, string>,
): { accountId: string; currentBalance: number }[] {
  debugExtractCurrentBalanceUpdates(
    "start accountCount=%d",
    Object.keys(valuesByAccountId).length,
  )
  return Object.entries(valuesByAccountId).map(([accountId, value]) => {
    const parsedBalance = parseCurrentBalanceValue(value)

    if (Either.isLeft(parsedBalance)) {
      debugExtractCurrentBalanceUpdates(
        "parseError accountId=%s message=%s",
        accountId,
        parsedBalance.left,
      )
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
    debugSaveCurrentBalancesFn("start")
    try {
      const updates = extractCurrentBalanceUpdates(data.valuesByAccountId)
      const validatedUpdates = saveCurrentBalancesSchema.parse({ updates })
      const changedRows = await updateAccountCurrentBalances(
        validatedUpdates.updates,
      )

      debugSaveCurrentBalancesFn("success changedRows=%d", changedRows)
      return {
        success: true as const,
        changedRows,
      }
    } catch (error) {
      debugSaveCurrentBalancesFn("error %O", error)
      throw error
    }
  })
