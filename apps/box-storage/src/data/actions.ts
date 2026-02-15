import { createServerFn } from "@tanstack/react-start"
import { P, match } from "ts-pattern"
import { z } from "zod"
import { Prisma } from "@/generated/prisma/client"
import { prisma } from "./prisma"
import { authStateFn, getClerkUsername } from "@/lib/auth"
import {
  getLocationDisplay,
  getStatusKey,
  getStatusLabel,
  sortInventoryItems,
} from "./list-items-utils"
import {
  defaultInventorySortBy,
  defaultInventorySortDirection,
  type InventorySortBy,
  type InventorySortDirection,
  inventorySortBySchema,
  inventorySortDirectionSchema,
  inventoryStatusFilterSchema,
} from "./inventory-query"

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
    statusFilter: inventoryStatusFilterSchema.optional(),
    sortBy: inventorySortBySchema.optional(),
    sortDirection: inventorySortDirectionSchema.optional(),
  })
  .optional()
export type ListItemFilters = z.infer<typeof filtersSchema>
export type { ListItemStatusKey } from "./list-items-utils"

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

function getItemOrderByForSort(
  sortBy: InventorySortBy,
  sortDirection: InventorySortDirection,
): Prisma.ItemOrderByWithRelationInput[] | undefined {
  // "name" is a persisted column and can be sorted directly in the database.
  if (sortBy !== "name") {
    return undefined
  }

  return [{ name: sortDirection }, { id: "asc" }]
}

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
      sortBy = defaultInventorySortBy,
      sortDirection = defaultInventorySortDirection,
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
      orderBy: getItemOrderByForSort(sortBy, sortDirection),
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

    // Keep DB ordering for plain column sort; no second pass in memory.
    if (sortBy === "name") {
      return enrichedItems
    }

    // Computed sort keys (location/status) are derived after enrichment.
    return sortInventoryItems(enrichedItems, sortBy, sortDirection)
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
