"use server"

import { z } from "zod"
import Debug from "debug"
import { updateTag } from "next/cache"
import { Option } from "effect"
import {
  approveCurrentBalancesAsSnapshot,
  changeSettings,
  getLatestAssetSnapshot,
  updateAccountCurrentBalances,
  updateForcastScenario,
} from "./db"
import { saveForecastSchema, SaveForecastSchema } from "./schemas"
import {
  calculateApprovable,
  calculateEarliestApprovalDate,
  calculateInitialSnapshotDate,
  calculateNextSnapshotDate,
} from "../domain/snapshots"
import { SnapshotNotApprovableError } from "../domain/approveErrors"

// =============================================================================
// TypeScript Interfaces
// =============================================================================

export interface ServerActionResult {
  success: boolean
  error?: string
  message?: string
  data?: {
    fieldErrors?: Record<string, string[]>
    updatedScenarios?: number
    variableCostsUpdated?: boolean
  }
}

const currentBalanceUpdateEntrySchema = z.object({
  accountId: z.uuid(),
  currentBalance: z.number().int(),
})

const saveCurrentBalancesSchema = z.object({
  updates: z.array(currentBalanceUpdateEntrySchema).min(1),
})

function parseCurrentBalanceValue(rawValue: string): number {
  const normalized = rawValue.trim().replace(",", ".")
  if (normalized.length === 0) {
    throw new Error("Balance value is required")
  }
  const amount = Number(normalized)

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid balance value: ${rawValue}`)
  }

  return Math.round(amount * 100)
}

export async function handleApproveSnapshot(): Promise<void> {
  const debug = Debug("app:action:handleApproveSnapshot")
  debug("Received approve snapshot request")

  const latestSnapshotResult = await getLatestAssetSnapshot()

  let snapshotDate: Date
  if (Option.isNone(latestSnapshotResult)) {
    snapshotDate = calculateInitialSnapshotDate()
    debug(
      "No previous snapshot found. Using initial snapshot date=%s",
      snapshotDate,
    )
  } else {
    const lastSnapshot = Option.getOrThrow(latestSnapshotResult)
    const isApprovable = calculateApprovable(lastSnapshot.date)

    if (!isApprovable) {
      throw new SnapshotNotApprovableError(
        calculateEarliestApprovalDate(lastSnapshot.date),
      )
    }

    snapshotDate = calculateNextSnapshotDate(lastSnapshot.date)
    debug("Existing snapshot found. Next snapshot date=%s", snapshotDate)
  }

  await approveCurrentBalancesAsSnapshot(snapshotDate)

  updateTag("snapshots")
  updateTag("accounts")
}

// =============================================================================
// Core Update Logic
// =============================================================================

/**
 * Updates forecast data atomically (all or nothing)
 */
async function updateForecastData(data: SaveForecastSchema): Promise<void> {
  const debug = Debug("app:action:updateForecastData")
  debug("Starting forecast data update: %O", data)
  const operations: Promise<unknown>[] = []

  // 1. Update variable costs
  operations.push(
    changeSettings({ estimatedMonthlyVariableCosts: data.variableCosts }),
  )
  operations.push(...data.scenarios.map((s) => updateForcastScenario(s)))

  // Execute all operations atomically
  await Promise.all(operations)
}

// =============================================================================
// Server Actions
// =============================================================================

export async function handleSaveForecastDirect(
  input: SaveForecastSchema,
): Promise<ServerActionResult> {
  const debug = Debug("app:action:handleSaveForecastDirect")
  debug("Received save forecast direct request: %O", input)
  // 1. Validate input data
  const inputData = saveForecastSchema.parse(input)
  debug("Input data validated successfully")
  try {
    // 5. Execute atomic update
    debug("Executing atomic forecast update")
    await updateForecastData(inputData)
    debug("Atomic forecast update completed successfully")

    // 6. Invalidate cache to refresh UI with immediate effect
    // Using updateTag for read-your-own-writes scenario
    updateTag("scenarios")

    return {
      success: true,
      message: "Forecast saved successfully",
    }
  } catch (error) {
    console.error("Direct save forecast failed:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      return {
        success: false,
        error: "Validation failed",
        data: { fieldErrors },
      }
    }

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes("Scenario item not found")) {
        return {
          success: false,
          error:
            "One or more scenarios could not be found. Please refresh the page and try again.",
        }
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("connection")
      ) {
        return {
          success: false,
          error:
            "Database connection failed. Please check your connection and try again.",
        }
      }
    }

    // Generic error fallback
    return {
      success: false,
      error: "Failed to save forecast. Please try again later.",
    }
  }
}

/**
 * Updates only the isActive status of a single scenario item
 */
export async function handleUpdateScenarioIsActive(
  scenarioId: string,
  isActive: boolean,
): Promise<ServerActionResult> {
  const debug = Debug("app:action:handleUpdateScenarioIsActive")
  debug("Updating scenario isActive: id=%s, isActive=%s", scenarioId, isActive)
  try {
    // 1. Update scenario item using existing function
    debug("Calling updateForcastScenario function")
    await updateForcastScenario({ id: scenarioId, isActive })
    debug("updateForcastScenario completed successfully")

    // 2. Invalidate cache to refresh UI with immediate effect
    updateTag("scenarios")

    return {
      success: true,
      message: "Scenario status updated successfully",
    }
  } catch (error) {
    console.error("Update scenario isActive failed:", error)

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes("Scenario item not found")) {
        return {
          success: false,
          error:
            "Scenario could not be found. Please refresh the page and try again.",
        }
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("connection")
      ) {
        return {
          success: false,
          error:
            "Database connection failed. Please check your connection and try again.",
        }
      }
    }

    // Generic error fallback
    return {
      success: false,
      error: "Failed to update scenario status. Please try again later.",
    }
  }
}

/**
 * Saves current balances from form data where fields are submitted as `balance:<accountId>` in EUR.
 */
export async function handleSaveCurrentBalances(
  formData: FormData,
): Promise<void> {
  const debug = Debug("app:action:handleSaveCurrentBalances")
  debug("Received save current balances request")

  const updates = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("balance:"))
    .map(([key, value]) => {
      if (typeof value !== "string") {
        throw new Error("Invalid form payload: expected text values")
      }

      return {
        accountId: key.replace("balance:", ""),
        currentBalance: parseCurrentBalanceValue(value),
      }
    })

  const parsed = saveCurrentBalancesSchema.parse({ updates })
  debug("Validated %d account balance updates", parsed.updates.length)

  await updateAccountCurrentBalances(parsed.updates)
  updateTag("accounts")
}
