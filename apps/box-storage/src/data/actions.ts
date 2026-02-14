import { createServerFn } from "@tanstack/react-start"
import { P, match } from "ts-pattern"
import { z } from "zod"
import { Prisma } from "@/generated/prisma/client"
import { prisma } from "./prisma"
import { authStateFn, getClerkUsername } from "@/lib/auth"

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
    statusFilter: z.enum(["in-motion", "mine", "free", "others"]).optional(),
    sortBy: z.enum(["name", "location", "status"]).optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
  })
  .optional()
export type ListItemFilters = z.infer<typeof filtersSchema>
export type ListItemStatusKey = "free" | "mine" | "others"

type ListItemWithLocationRelations = {
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

const listItemsInclude = {
  box: {
    select: {
      name: true,
      furniture: {
        select: {
          name: true,
          room: {
            select: {
              name: true,
              floor: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  furniture: {
    select: {
      name: true,
      room: {
        select: {
          name: true,
          floor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  room: {
    select: {
      name: true,
      floor: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.ItemInclude

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

const listItemsInputSchema = z.object({ filters: filtersSchema }).optional()
const toggleItemSchema = z.object({ itemId: z.coerce.number() })
const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  isPrivate: z.boolean(),
  boxId: z.coerce.number().nullable(),
  furnitureId: z.coerce.number().nullable(),
  roomId: z.coerce.number().nullable(),
})
const updateItemSchema = z.object({
  itemId: z.coerce.number(),
  name: z.string().min(1),
  description: z.string(),
  isPrivate: z.boolean(),
  boxId: z.coerce.number().nullable(),
  furnitureId: z.coerce.number().nullable(),
  roomId: z.coerce.number().nullable(),
})

export const getListItems = createServerFn()
  .inputValidator((data) => listItemsInputSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("list items server - start")
    const { userId } = await authStateFn()
    console.log("list items server - AUTHED", userId)
    const { filters = {} } = data || {}
    const {
      searchText = "",
      locationFilter = "",
      statusFilter,
      sortBy = "name",
      sortDirection = "asc",
    } = filters
    const searchTerm = searchText.trim()
    const locationTerm = locationFilter.trim()

    const andConditions: Prisma.ItemWhereInput[] = []

    if (searchTerm) {
      andConditions.push({
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      })
    }

    if (locationTerm) {
      andConditions.push({
        OR: [
          {
            box: {
              name: {
                contains: locationTerm,
                mode: "insensitive",
              },
            },
          },
          {
            furniture: {
              name: {
                contains: locationTerm,
                mode: "insensitive",
              },
            },
          },
          {
            room: {
              name: {
                contains: locationTerm,
                mode: "insensitive",
              },
            },
          },
          {
            room: {
              floor: {
                name: {
                  contains: locationTerm,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      })
    }

    andConditions.push(
      ...match(statusFilter)
        .with("free", () => [{ inMotionUserId: null }])
        .with("in-motion", () => [{ inMotionUserId: { not: null } }])
        .with("mine", () => [{ inMotionUserId: userId }])
        .with("others", () => [
          { inMotionUserId: { not: null } },
          { inMotionUserId: { not: userId } },
        ])
        .otherwise(() => []),
    )

    const result = await prisma.item.findMany({
      where: {
        OR: [{ isPrivate: false }, { ownerId: userId }],
        AND: andConditions,
      },
      include: listItemsInclude,
    })

    const enrichedItems = result.map((item) => {
      const statusKey = getStatusKey(item.inMotionUserId, userId)
      const { box, furniture, room, ...rest } = item

      return {
        ...rest,
        locationDisplay: getLocationDisplay({ box, furniture, room }),
        statusKey,
        statusLabel: getStatusLabel(statusKey),
      }
    })

    const statusRank: Record<ListItemStatusKey, number> = {
      free: 0,
      mine: 1,
      others: 2,
    }

    const textSortOptions = { sensitivity: "base" as const }
    const directionFactor = sortDirection === "desc" ? -1 : 1
    const sortedItems = [...enrichedItems].sort((left, right) => {
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
        .otherwise(() => {
          if (compareByName !== 0) {
            return compareByName * directionFactor
          }
          return compareById
        })
    })

    return sortedItems
  })

export const getHierarchicalViewData = createServerFn().handler(async () => {
  await authStateFn()
  return await prisma.floor.findMany({
    include: {
      rooms: {
        include: {
          furniture: {
            include: {
              boxes: {
                include: {
                  items: {
                    orderBy: [
                      { inMotionUserId: "desc" }, // in-motion items last
                      { name: "asc" },
                    ],
                  },
                },
              },
              items: {
                where: {
                  boxId: null, // only items directly in furniture, not in boxes
                },
                orderBy: [{ inMotionUserId: "desc" }, { name: "asc" }],
              },
            },
          },
          items: {
            where: {
              furnitureId: null, // only items directly in room, not in furniture
              boxId: null,
            },
            orderBy: [{ inMotionUserId: "desc" }, { name: "asc" }],
          },
        },
      },
    },
  })
})

export const getDashboardDataFn = createServerFn().handler(async () => {
  console.log("dabo server - start")
  const { userId } = await authStateFn()
  console.log("dabo server - AUTHED", userId)

  // Personal items
  const personalItems = await prisma.item.findMany({
    where: { ownerId: userId },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Others items (public or owned by current user)
  const othersItems = await prisma.item.findMany({
    take: 5,
    where: {
      ownerId: { not: userId },
      OR: [{ isPrivate: false }, { ownerId: userId }],
    },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Recently modified items (visible to user)
  const recentlyModified = await prisma.item.findMany({
    where: {
      OR: [{ isPrivate: false }, { ownerId: userId }],
    },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return { personalItems, othersItems, recentlyModified }
})

export const toggleItemInMotionFn = createServerFn({ method: "POST" })
  .inputValidator((data) => toggleItemSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("toggle server - start")
    const { userId } = await authStateFn()
    console.log("toggle server - AUTHED", userId)
    const { itemId } = data
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { inMotionUserId: true },
    })

    await prisma.item.update({
      where: { id: itemId },
      data: await match(item)
        // is in motion, reset
        .with({ inMotionUserId: P.string }, async () => ({
          inMotionUserId: null,
          inMotionUsername: null,
        }))
        // not in motion, assign to us
        .with({ inMotionUserId: P.nullish }, async () => {
          const inMotionUsername = await getClerkUsername(userId)
          return {
            inMotionUserId: userId,
            inMotionUsername,
          }
        })
        .with(P.nullish, () => {
          throw new Error(`Item not found: ${itemId}`)
        })
        .exhaustive(),
    })
  })

export const createItemFn = createServerFn({ method: "POST" })
  .inputValidator((data) => createItemSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("create item server - start")
    const { userId } = await authStateFn()
    console.log("create item server - AUTHED", userId)
    const ownerUsername = await getClerkUsername(userId)
    const { name, description, isPrivate, boxId, furnitureId, roomId } = data
    validateLocationConstraints(boxId, furnitureId, roomId)
    return await prisma.item.create({
      data: {
        name,
        description,
        isPrivate,
        ownerId: userId,
        ownerUsername,
        boxId,
        furnitureId,
        roomId,
        inMotionUserId: null,
        inMotionUsername: null,
      },
    })
  })

export const updateItemFn = createServerFn({ method: "POST" })
  .inputValidator((data) => updateItemSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await authStateFn()
    const { itemId, name, description, isPrivate, boxId, furnitureId, roomId } =
      data
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { ownerId: true },
    })

    return await match(item)
      .with(P.nullish, () => {
        throw new Error(`Item not found: ${itemId}`)
      })
      .with({ ownerId: userId }, async () => {
        validateLocationConstraints(boxId, furnitureId, roomId)
        return await prisma.item.update({
          where: { id: itemId },
          data: {
            name,
            description,
            isPrivate,
            boxId,
            furnitureId,
            roomId,
          },
        })
      })
      .otherwise(() => {
        throw new Error("Not authorized to update this item")
      })
  })
