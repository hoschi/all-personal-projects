import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { prisma } from "./prisma"
import { redirect } from "@tanstack/react-router"
import { getRequest } from "@tanstack/react-start/server"

const checkAuthOrRedirect = async (request: Request) => {
  console.log("check auth")
  const authHeader = request.headers.get("Authorization")
  const username = authHeader?.split(" ")[1] // 🙈
  if (username) {
    const user = await prisma.user.findFirst({
      where: { username },
    })
    if (user) {
      return user
    }
  }
  throw redirect({ to: "/" })
}

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

export const getListItems = createServerFn()
  .inputValidator(z.object({ filters: filtersSchema }).optional().parse)
  .handler(async ({ data }) => {
    const request = getRequest()
    console.log("list items server - start")
    const currentUser = await checkAuthOrRedirect(request)
    const userId = currentUser.id
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

    return await prisma.item.findMany({
      where: {
        OR: [{ isPrivate: false }, { ownerId: userId }],
        AND: andConditions,
      },
      orderBy: { name: "asc" },
    })
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
  const request = getRequest()
  console.log("dabo server - start")
  const currentUser = await checkAuthOrRedirect(request)
  const userId = currentUser.id
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
      owner: { select: { username: true } },
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
    const request = getRequest()
    console.log("toggle server - start")
    const currentUser = await checkAuthOrRedirect(request)
    const userId = currentUser.id
    console.log("toggle server - AUTHED", userId)
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
        data: { inMotionUserId: userId },
      })
    } else if (item.inMotionUserId === userId) {
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
    const request = getRequest()
    console.log("create item server - start")
    const currentUser = await checkAuthOrRedirect(request)
    const userId = currentUser.id
    console.log("create item server - AUTHED", userId)
    const { name, description, isPrivate, boxId, furnitureId, roomId } = data
    validateLocationConstraints(boxId, furnitureId, roomId)
    return await prisma.item.create({
      data: {
        name,
        description,
        isPrivate,
        ownerId: userId,
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

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      password: z.string(),
      // TODO get username from UserSchema. extract this object into own schema files with the others specific schemas for frontend. use this schema for form validation as well!
      username: z.string(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { username } = data
    const user = await prisma.user.findFirst({ where: { username } })
    console.log("login fn:", { username, found: !!user })

    if (!user) throw redirect({ to: "/" })

    return { username, id: user.id }
  })
