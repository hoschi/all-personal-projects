import { z } from "zod"

export const inventoryAllStatusFilter = "all" as const
const inventoryStatusFilterValues = [
  "in-motion",
  "mine",
  "free",
  "others",
] as const
const inventoryStatusFilterWithAllValues = [
  inventoryAllStatusFilter,
  ...inventoryStatusFilterValues,
] as const

const inventorySortByValues = ["name", "location", "status"] as const
const inventorySortDirectionValues = ["asc", "desc"] as const

export type InventorySortBy = (typeof inventorySortByValues)[number]
export type InventorySortDirection =
  (typeof inventorySortDirectionValues)[number]

export const inventoryStatusFilterSchema = z.enum(inventoryStatusFilterValues)
export const inventoryStatusFilterWithAllSchema = z.enum(
  inventoryStatusFilterWithAllValues,
)
export const inventorySortBySchema = z.enum(inventorySortByValues)
export const inventorySortDirectionSchema = z.enum(inventorySortDirectionValues)

export const defaultInventorySortBy: InventorySortBy = "name"
export const defaultInventorySortDirection: InventorySortDirection = "asc"
