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
  boxId: number | null,
  furnitureId: number | null,
  roomId: number | null,
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
      currentUserId: 4,
      ...filters,
    })
  })

export const getHierarchicalViewData = createServerFn().handler(
  async () => await getHierarchicalData(),
)

export const getDashboardDataFn = createServerFn().handler(
  async () => await getDashboardData(4),
)

export const toggleItemInMotionFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ itemId: z.coerce.number() }).parse)
  .handler(async ({ data }) => {
    const { itemId } = data
    await toggleItemInMotion(itemId, 4)
  })

export const createItemFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      description: z.string(),
      isPrivate: z.boolean(),
      boxId: z.coerce.number().nullable(),
      furnitureId: z.coerce.number().nullable(),
      roomId: z.coerce.number().nullable(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { name, description, isPrivate, boxId, furnitureId, roomId } = data
    validateLocationConstraints(boxId, furnitureId, roomId)
    return await createItem(
      name,
      description,
      isPrivate,
      4,
      boxId,
      furnitureId,
      roomId,
    )
  })

export const updateItemFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      itemId: z.coerce.number(),
      name: z.string().min(1),
      description: z.string(),
      isPrivate: z.boolean(),
      boxId: z.coerce.number().nullable(),
      furnitureId: z.coerce.number().nullable(),
      roomId: z.coerce.number().nullable(),
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
