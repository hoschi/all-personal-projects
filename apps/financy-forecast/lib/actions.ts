'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import {
    updateAccount,
    upsertSettings,
    updateScenarioItem,
    getScenarioItems
} from './db'

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

export interface SaveForecastData {
    variableCosts: number // in cents
    scenarios: Array<{
        id: string
        name?: string
        amount?: number
        date?: Date
        isActive?: boolean
    }>
}

// =============================================================================
// Zod Validation Schema
// =============================================================================

const saveForecastSchema = z.object({
    variableCosts: z.number().int().min(0, 'Variable costs must be positive'),
    scenarios: z.array(z.object({
        id: z.string().uuid('Invalid scenario ID'),
        name: z.string().min(1, 'Scenario name cannot be empty').optional(),
        amount: z.number().int('Amount must be an integer').optional(),
        date: z.coerce.date().optional(),
        isActive: z.boolean().optional()
    })).default([])
})

// =============================================================================
// Core Update Logic
// =============================================================================

/**
 * Updates forecast data atomically (all or nothing)
 */
async function updateForecastData(data: SaveForecastData): Promise<void> {
    // Transaction-like behavior: all operations must succeed
    const operations = []

    // 1. Update variable costs
    operations.push(
        upsertSettings(data.variableCosts)
    )

    // 2. Update scenario items (batch update for performance)
    for (const scenario of data.scenarios) {
        const updateData: {
            name?: string
            amount?: number
            date?: Date
            isActive?: boolean
        } = {}

        if (scenario.name !== undefined) updateData.name = scenario.name
        if (scenario.amount !== undefined) updateData.amount = scenario.amount
        if (scenario.date !== undefined) updateData.date = scenario.date
        if (scenario.isActive !== undefined) updateData.isActive = scenario.isActive

        // Only update if there are actual changes
        if (Object.keys(updateData).length > 0) {
            operations.push(
                updateScenarioItem(
                    scenario.id,
                    updateData.name,
                    updateData.amount,
                    updateData.date,
                    updateData.isActive
                )
            )
        }
    }

    // Execute all operations atomically
    await Promise.all(operations)
}

// =============================================================================
// Server Actions
// =============================================================================

/**
 * Server Action: Save Forecast Data
 * Simplified version - only handles isActive updates
 */

/**
 * Direct server action call (for programmatic usage)
 * Bypasses FormData and works directly with typed parameters
 * Simplified version - only handles isActive updates
 */
export async function handleSaveForecastDirect(
    variableCosts: number,
    scenarios: Array<{
        id: string
        name?: string
        amount?: number
        date?: Date
        isActive?: boolean
    }>
): Promise<ServerActionResult> {
    try {
        // Only process scenarios with isActive changes
        const activeScenarios = scenarios.filter(s => s.isActive !== undefined)

        // 1. Validate input data
        const validatedData = saveForecastSchema.parse({
            variableCosts,
            scenarios
        })

        // 2. Load current scenarios for comparison (all scenarios, not just active ones)
        const currentScenarios = await getScenarioItems()

        // 3. Filter scenarios that actually changed (optimization)
        const changedScenarios = activeScenarios.filter(scenario => {
            const currentScenario = currentScenarios.find(s => s.id === scenario.id)
            return !currentScenario || currentScenario.isActive !== scenario.isActive
        })

        // 4. Prepare final data with only changed scenarios
        const finalData: SaveForecastData = {
            variableCosts: validatedData.variableCosts,
            scenarios: changedScenarios
        }

        // 5. Execute atomic update
        await updateForecastData(finalData)

        // 6. Invalidate cache to refresh UI
        revalidateTag('snapshots', 'max')

        return {
            success: true,
            message: 'Forecast saved successfully',
            data: {
                updatedScenarios: changedScenarios.length,
                variableCostsUpdated: true
            }
        }

    } catch (error) {
        console.error('Direct save forecast failed:', error)

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return {
                success: false,
                error: 'Validation failed',
                data: { fieldErrors }
            }
        }

        // Handle database errors
        if (error instanceof Error) {
            if (error.message.includes('Scenario item not found')) {
                return {
                    success: false,
                    error: 'One or more scenarios could not be found. Please refresh the page and try again.'
                }
            }

            if (error.message.includes('Failed to fetch') || error.message.includes('connection')) {
                return {
                    success: false,
                    error: 'Database connection failed. Please check your connection and try again.'
                }
            }
        }

        // Generic error fallback
        return {
            success: false,
            error: 'Failed to save forecast. Please try again later.'
        }
    }
}

/**
 * Legacy function for backward compatibility
 */
export async function updateCurrentBalance(accountId: string, amount: number) {
    return await updateAccount(accountId, undefined, undefined, amount)
}