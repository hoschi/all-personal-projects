import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
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
  })
  .optional()
export type ListItemFilters = z.infer<typeof filtersSchema>

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
    await authStateFn()
    console.log("list items server - AUTHED", userId)
    const { filters = {} } = data || {}
    const { searchText = "", locationFilter = "", statusFilter = "" } = filters

    const andConditions = []

    // Add search filter
    if (searchText) {
      andConditions.push({
        OR: [
          { name: { contains: searchText, mode: "insensitive" as const } },
          {
            description: { contains: searchText, mode: "insensitive" as const },
          },
        ],
      })
    }

    // Add location filter
    if (locationFilter) {
      andConditions.push({
        OR: [
          {
            box: {
              name: { contains: locationFilter, mode: "insensitive" as const },
            },
          },
          {
            furniture: {
              name: { contains: locationFilter, mode: "insensitive" as const },
            },
          },
          {
            room: {
              name: { contains: locationFilter, mode: "insensitive" as const },
            },
          },
          {
            room: {
              floor: {
                name: {
                  contains: locationFilter,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      })
    }

    // Add status filter
    if (statusFilter) {
      if (statusFilter === "free") {
        andConditions.push({ inMotionUserId: null })
      } else if (statusFilter === "in-motion") {
        andConditions.push({ inMotionUserId: { not: null } })
      } else if (statusFilter === "mine") {
        andConditions.push({ inMotionUserId: userId })
      } else if (statusFilter === "others") {
        andConditions.push(
          { inMotionUserId: { not: null } },
          { inMotionUserId: { not: userId } },
        )
      }
    }

    const result = await prisma.item.findMany({
      where: {
        OR: [{ isPrivate: false }, { ownerId: userId }],
        AND: andConditions,
      },
      orderBy: { name: "asc" },
    })

    return result
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

    if (!item) throw new Error(`Item not found: ${itemId}`)

    if (!item.inMotionUserId) {
      // Set to in motion
      const inMotionUsername = await getClerkUsername(userId)
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: userId, inMotionUsername },
      })
    } else if (item.inMotionUserId === userId) {
      // Remove from motion (same user)
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: null, inMotionUsername: null },
      })
    } else {
      // Different user - remove from motion
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: null, inMotionUsername: null },
      })
    }
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

    if (!item) {
      throw new Error(`Item not found: ${itemId}`)
    }

    if (item.ownerId !== userId) {
      throw new Error("Not authorized to update this item")
    }

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
