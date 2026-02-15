import { P, match } from "ts-pattern"
import type { InventorySortBy, InventorySortDirection } from "./inventory-query"
import type { ListItemWithLocationRelations } from "./item-location-include"

export type ListItemStatusKey = "free" | "mine" | "others"
export type { InventorySortBy, InventorySortDirection } from "./inventory-query"
export type InventoryComputedSortBy = Exclude<InventorySortBy, "name">

export type SortableInventoryItem = {
  id: number
  name: string
  locationDisplay: string
  statusKey: ListItemStatusKey
}

type FloorLocationNode = NonNullable<
  NonNullable<ListItemWithLocationRelations["room"]>["floor"]
>
type RoomLocationNode = NonNullable<ListItemWithLocationRelations["room"]>
type FurnitureLocationNode = NonNullable<
  ListItemWithLocationRelations["furniture"]
>
type BoxLocationNode = NonNullable<ListItemWithLocationRelations["box"]>
type LocationNode =
  | FloorLocationNode
  | RoomLocationNode
  | FurnitureLocationNode
  | BoxLocationNode

function collectLocationSegments(node: LocationNode | null): string[] {
  if (!node) {
    return []
  }

  const childSegments = collectLocationSegments(
    match(node)
      .with({ furniture: P.nonNullable }, (item) => item.furniture)
      .with({ room: P.nonNullable }, (item) => item.room)
      .with({ floor: P.nonNullable }, (item) => item.floor)
      .otherwise(() => null),
  )
  return [...childSegments, node.name]
}

export function getLocationDisplay(
  item: ListItemWithLocationRelations,
): string {
  const rootLocation = item.box ?? item.furniture ?? item.room
  const segments = collectLocationSegments(rootLocation)

  return segments.join(" > ") || "Unknown"
}

export function getStatusKey(
  inMotionUserId: string | null,
  userId: string,
): ListItemStatusKey {
  return match(inMotionUserId)
    .with(P.nullish, () => "free" as const)
    .with(userId, () => "mine" as const)
    .otherwise(() => "others" as const)
}

export function getStatusLabel(statusKey: ListItemStatusKey): string {
  return match(statusKey)
    .with("free", () => "Free")
    .with("mine", () => "In Motion (you)")
    .with("others", () => "In Motion (others)")
    .exhaustive()
}

export function sortInventoryItems<T extends SortableInventoryItem>(
  items: T[],
  sortBy: InventoryComputedSortBy,
  sortDirection: InventorySortDirection,
): T[] {
  const statusRank: Record<ListItemStatusKey, number> = {
    free: 0,
    mine: 1,
    others: 2,
  }
  const textSortOptions = { sensitivity: "base" as const }
  const directionFactor = sortDirection === "desc" ? -1 : 1

  return [...items].sort((left, right) => {
    const compareByName = left.name.localeCompare(
      right.name,
      undefined,
      textSortOptions,
    )
    const compareById = left.id - right.id

    return match(sortBy)
      .with("location", () => {
        const locationCompare = left.locationDisplay.localeCompare(
          right.locationDisplay,
          undefined,
          textSortOptions,
        )
        if (locationCompare !== 0) {
          return locationCompare * directionFactor
        }
        // Tie-breakers in the "location" branch must keep sortDirection.
        if (compareByName !== 0) {
          return compareByName * directionFactor
        }
        return compareById * directionFactor
      })
      .with("status", () => {
        const statusCompare =
          statusRank[left.statusKey] - statusRank[right.statusKey]
        if (statusCompare !== 0) {
          return statusCompare * directionFactor
        }
        // Tie-breakers in the "status" branch must keep sortDirection.
        if (compareByName !== 0) {
          return compareByName * directionFactor
        }
        return compareById * directionFactor
      })
      .exhaustive()
  })
}
