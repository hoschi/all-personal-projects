import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  getItems,
  getHierarchicalData,
  getDashboardData,
  toggleItemInMotion,
  createItem,
  updateItem,
} from "./data"

// Hilfsfunktion zur Validierung der Location Constraints
function validateLocationConstraints(
  boxId: string | null,
  furnitureId: string | null,
  roomId: string | null,
): void {
  const locations = [boxId, furnitureId, roomId].filter((id) => id !== null)
  if (locations.length !== 1) {
    throw new Error(
      "Ein Item muss genau eine Location haben: boxId, furnitureId oder roomId",
    )
  }
}

const filtersSchema = z
  .object({
    searchText: z.string().optional(),
    locationFilter: z.string().optional(),
    statusFilter: z.string().optional(),
  })
  .optional()

export const getListItems = createServerFn()
  .inputValidator(z.object({ filters: filtersSchema }).optional().parse)
  .handler(async ({ data }) => {
    const { filters = {} } = data || {}
    return await getItems({
      currentUserId: "550e8400-e29b-41d4-a716-446655440001",
      ...filters,
    })
  })

export const getHierarchicalViewData = createServerFn().handler(
  async () => await getHierarchicalData(),
)

export const getDashboardDataFn = createServerFn().handler(
  async () => await getDashboardData("550e8400-e29b-41d4-a716-446655440001"),
)

export const toggleItemInMotionFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ itemId: z.uuid() }).parse)
  .handler(async ({ data }) => {
    const { itemId } = data
    await toggleItemInMotion(itemId, "550e8400-e29b-41d4-a716-446655440001")
  })

export const createItemFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      description: z.string(),
      isPrivate: z.boolean(),
      boxId: z.string().uuid().nullable(),
      furnitureId: z.string().uuid().nullable(),
      roomId: z.string().uuid().nullable(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { name, description, isPrivate, boxId, furnitureId, roomId } = data
    validateLocationConstraints(boxId, furnitureId, roomId)
    return await createItem(
      name,
      description,
      isPrivate,
      "550e8400-e29b-41d4-a716-446655440001",
      boxId,
      furnitureId,
      roomId,
    )
  })

export const updateItemFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      itemId: z.string().uuid(),
      name: z.string().min(1),
      description: z.string(),
      isPrivate: z.boolean(),
      boxId: z.string().uuid().nullable(),
      furnitureId: z.string().uuid().nullable(),
      roomId: z.string().uuid().nullable(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { itemId, name, description, isPrivate, boxId, furnitureId, roomId } =
      data
    validateLocationConstraints(boxId, furnitureId, roomId)
    return await updateItem(
      itemId,
      name,
      description,
      isPrivate,
      boxId,
      furnitureId,
      roomId,
    )
  })
