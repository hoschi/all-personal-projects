import { Item, Floor } from "./schema"
import { prisma } from "./prisma"

export async function getItems({
  currentUserId,
  searchText = "",
  locationFilter = "",
  statusFilter = "",
}: {
  currentUserId: number
  searchText?: string
  locationFilter?: string
  statusFilter?: string
}): Promise<Item[]> {
  // Base query with visibility filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    OR: [{ isPrivate: false }, { ownerId: currentUserId }],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const andConditions: any[] = []

  // Add search filter
  if (searchText) {
    andConditions.push({
      OR: [
        { name: { contains: searchText, mode: "insensitive" as const } },
        { description: { contains: searchText, mode: "insensitive" as const } },
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
              name: { contains: locationFilter, mode: "insensitive" as const },
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
      andConditions.push({ inMotionUserId: currentUserId })
    } else if (statusFilter === "others") {
      andConditions.push(
        { inMotionUserId: { not: null } },
        { inMotionUserId: { not: currentUserId } },
      )
    }
  }

  if (andConditions.length > 0) {
    where.AND = andConditions
  }

  return await prisma.item.findMany({
    where,
    orderBy: { name: "asc" },
  })
}

export async function getHierarchicalData(): Promise<Floor[]> {
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
}

export async function getDashboardData(currentUserId: number): Promise<{
  personalItems: Item[]
  othersItems: Item[]
  recentlyModified: Item[]
}> {
  // Personal items
  const personalItems = await prisma.item.findMany({
    where: { ownerId: currentUserId },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { lastModifiedAt: "desc" },
  })

  // Others items (public or owned by current user)
  const othersItems = await prisma.item.findMany({
    where: {
      ownerId: { not: currentUserId },
      OR: [{ isPrivate: false }, { ownerId: currentUserId }],
    },
    include: {
      owner: { select: { username: true } },
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { lastModifiedAt: "desc" },
  })

  // Recently modified items (visible to user)
  const recentlyModified = await prisma.item.findMany({
    where: {
      OR: [{ isPrivate: false }, { ownerId: currentUserId }],
    },
    include: {
      owner: { select: { username: true } },
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { lastModifiedAt: "desc" },
    take: 5,
  })

  return { personalItems, othersItems, recentlyModified }
}

export async function toggleItemInMotion(
  itemId: number,
  currentUserId: number,
): Promise<void> {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { inMotionUserId: true },
  })

  if (!item) throw new Error(`Item not found: ${itemId}`)

  if (!item.inMotionUserId) {
    // Set to in motion
    await prisma.item.update({
      where: { id: itemId },
      data: { inMotionUserId: currentUserId },
    })
  } else if (item.inMotionUserId === currentUserId) {
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
}

export async function createItem(
  name: string,
  description: string,
  isPrivate: boolean,
  ownerId: number,
  boxId: number | null,
  furnitureId: number | null,
  roomId: number | null,
): Promise<Item> {
  return await prisma.item.create({
    data: {
      name,
      description,
      lastModifiedAt: new Date(),
      isPrivate,
      ownerId,
      boxId,
      furnitureId,
      roomId,
      inMotionUserId: null,
    },
  })
}

export async function updateItem(
  itemId: number,
  name: string,
  description: string,
  isPrivate: boolean,
  boxId: number | null,
  furnitureId: number | null,
  roomId: number | null,
): Promise<Item> {
  return await prisma.item.update({
    where: { id: itemId },
    data: {
      name,
      description,
      isPrivate,
      boxId,
      furnitureId,
      roomId,
      lastModifiedAt: new Date(),
    },
  })
}
