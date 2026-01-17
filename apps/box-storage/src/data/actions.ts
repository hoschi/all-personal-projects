import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  getItems,
  getHierarchicalData,
  getDashboardData,
  toggleItemInMotion,
} from "./data"

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
    return await getItems({ currentUserId: "user1", ...filters })
  })

export const getHierarchicalViewData = createServerFn().handler(
  async () => await getHierarchicalData(),
)

export const getDashboardDataFn = createServerFn().handler(
  async () => await getDashboardData("user1"),
)

export const toggleItemInMotionFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ itemId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const { itemId } = data
    await toggleItemInMotion(itemId, "user1")
  })
