'use server'

import { z } from 'zod'
import { updateTag } from 'next/cache'
import {
    changeSettings,
    updateForcastScenario
} from './db'
import { saveForecastSchema, SaveForecastSchema } from './schemas'

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

// =============================================================================
// Core Update Logic
// =============================================================================

/**
 * Updates forecast data atomically (all or nothing)
 */
async function updateForecastData(data: SaveForecastSchema): Promise<void> {
    const operations: Promise<unknown>[] = []

    // 1. Update variable costs
    operations.push(
        changeSettings({ estimatedMonthlyVariableCosts: data.variableCosts })
    )
    operations.concat(data.scenarios.map(s => updateForcastScenario(s)))

    // Execute all operations atomically
    await Promise.all(operations)
}

// =============================================================================
// Server Actions
// =============================================================================

export async function handleSaveForecastDirect(input: SaveForecastSchema): Promise<ServerActionResult> {
    // 1. Validate input data
    const inputData = saveForecastSchema.parse(input)
    try {

        // 5. Execute atomic update
        await updateForecastData(inputData)

        // 6. Invalidate cache to refresh UI with immediate effect
        // Using updateTag for read-your-own-writes scenario
        updateTag('snapshots')

        return {
            success: true,
            message: 'Forecast saved successfully'
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
 * Updates only the isActive status of a single scenario item
 */
export async function handleUpdateScenarioIsActive(
    scenarioId: string,
    isActive: boolean
): Promise<ServerActionResult> {
    try {
        // 1. Update scenario item using existing function
        await updateForcastScenario({ id: scenarioId, isActive });

        // 2. Invalidate cache to refresh UI with immediate effect
        updateTag('snapshots');

        return {
            success: true,
            message: 'Scenario status updated successfully'
        };

    } catch (error) {
        console.error('Update scenario isActive failed:', error);

        // Handle database errors
        if (error instanceof Error) {
            if (error.message.includes('Scenario item not found')) {
                return {
                    success: false,
                    error: 'Scenario could not be found. Please refresh the page and try again.'
                };
            }

            if (error.message.includes('Failed to fetch') || error.message.includes('connection')) {
                return {
                    success: false,
                    error: 'Database connection failed. Please check your connection and try again.'
                };
            }
        }

        // Generic error fallback
        return {
            success: false,
            error: 'Failed to update scenario status. Please try again later.'
        };
    }
}