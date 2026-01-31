import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { prisma } from "./prisma"
import { Item } from "@/generated/prisma/client"

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
        andConditions.push({ inMotionUserId: 4 })
      } else if (statusFilter === "others") {
        andConditions.push(
          { inMotionUserId: { not: null } },
          { inMotionUserId: { not: 4 } },
        )
      }
    }

    const result: Item[] = await prisma.item.findMany({
      where: {
        OR: [{ isPrivate: false }, { ownerId: 4 }],
        AND: andConditions,
      },
      orderBy: { name: "asc" },
    })

    return result
  })

export const getHierarchicalViewData = createServerFn().handler(async () => {
  return await prisma.floor.findMany({
    include: {
      rooms: {
        include: {
          furniture: {
            include: {
              boxes: {
                include: {
                  items: {
                    include: {
                      owner: { select: { username: true } },
                      inMotionUser: { select: { username: true } },
                    },
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
                include: {
                  owner: { select: { username: true } },
                  inMotionUser: { select: { username: true } },
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
            include: {
              owner: { select: { username: true } },
              inMotionUser: { select: { username: true } },
            },
            orderBy: [{ inMotionUserId: "desc" }, { name: "asc" }],
          },
        },
      },
    },
  })
})

export const getDashboardDataFn = createServerFn().handler(async () => {
  // Personal items
  const personalItems: Item[] = await prisma.item.findMany({
    where: { ownerId: 4 },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Others items (public or owned by current user)
  const othersItems: Item[] = await prisma.item.findMany({
    take: 5,
    where: {
      ownerId: { not: 4 },
      OR: [{ isPrivate: false }, { ownerId: 4 }],
    },
    include: {
      owner: { select: { username: true } },
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Recently modified items (visible to user)
  const recentlyModified: Item[] = await prisma.item.findMany({
    where: {
      OR: [{ isPrivate: false }, { ownerId: 4 }],
    },
    include: {
      owner: { select: { username: true } },
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
  .inputValidator(z.object({ itemId: z.coerce.number() }).parse)
  .handler(async ({ data }) => {
    const { itemId } = data
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { inMotionUserId: true },
    })

    if (!item) throw new Error(`Item not found: ${itemId}`)

    if (!item.inMotionUserId) {
      // Set to in motion
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: 4 },
      })
    } else if (item.inMotionUserId === 4) {
      // Remove from motion (same user)
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: null },
      })
    } else {
      // Different user - remove from motion
      await prisma.item.update({
        where: { id: itemId },
        data: { inMotionUserId: null },
      })
    }
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
    return await prisma.item.create({
      data: {
        name,
        description,
        isPrivate,
        ownerId: 4,
        boxId,
        furnitureId,
        roomId,
        inMotionUserId: null,
      },
    })
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
