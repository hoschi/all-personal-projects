import { P, match } from "ts-pattern"

export type ListItemStatusKey = "free" | "mine" | "others"
export type InventorySortBy = "name" | "location" | "status"
export type InventorySortDirection = "asc" | "desc"

export type ListItemWithLocationRelations = {
  box: {
    name: string
    furniture: {
      name: string
      room: {
        name: string
        floor: {
          name: string
        } | null
      } | null
    } | null
  } | null
  furniture: {
    name: string
    room: {
      name: string
      floor: {
        name: string
      } | null
    } | null
  } | null
  room: {
    name: string
    floor: {
      name: string
    } | null
  } | null
}

export type SortableInventoryItem = {
  id: number
  name: string
  locationDisplay: string
  statusKey: ListItemStatusKey
}

export function getLocationDisplay(
  item: ListItemWithLocationRelations,
): string {
  const segments = match(item)
    .with(
      {
        box: {
          name: P.string,
          furniture: P.union(
            {
              name: P.string,
              room: P.union(
                {
                  name: P.string,
                  floor: P.union({ name: P.string }, P.nullish),
                },
                P.nullish,
              ),
            },
            P.nullish,
          ),
        },
      },
      ({ box }) => [
        box.furniture?.room?.floor?.name,
        box.furniture?.room?.name,
        box.furniture?.name,
        box.name,
      ],
    )
    .with(
      {
        furniture: {
          name: P.string,
          room: P.union(
            {
              name: P.string,
              floor: P.union({ name: P.string }, P.nullish),
            },
            P.nullish,
          ),
        },
      },
      ({ furniture }) => [
        furniture.room?.floor?.name,
        furniture.room?.name,
        furniture.name,
      ],
    )
    .with(
      {
        room: {
          name: P.string,
          floor: P.union({ name: P.string }, P.nullish),
        },
      },
      ({ room }) => [room.floor?.name, room.name],
    )
    .otherwise(() => [])

  return segments.filter(Boolean).join(" > ") || "Unknown"
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
  sortBy: InventorySortBy,
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
      .with("name", () => {
        if (compareByName !== 0) {
          return compareByName * directionFactor
        }
        return compareById
      })
      .with("location", () => {
        const locationCompare = left.locationDisplay.localeCompare(
          right.locationDisplay,
          undefined,
          textSortOptions,
        )
        if (locationCompare !== 0) {
          return locationCompare * directionFactor
        }
        if (compareByName !== 0) {
          return compareByName
        }
        return compareById
      })
      .with("status", () => {
        const statusCompare =
          statusRank[left.statusKey] - statusRank[right.statusKey]
        if (statusCompare !== 0) {
          return statusCompare * directionFactor
        }
        if (compareByName !== 0) {
          return compareByName
        }
        return compareById
      })
      .exhaustive()
  })
}
