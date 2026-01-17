import {
  Item,
  User,
  Floor,
  Room,
  Furniture,
  Box,
  UserItemInteraction,
} from "./schema"

export const users: User[] = [
  { id: "user-1", username: "alice", passwordHash: "hash1" },
  { id: "user-2", username: "bob", passwordHash: "hash2" },
  { id: "user-3", username: "charlie", passwordHash: "hash3" },
]

const floors: Floor[] = [
  { id: "floor-1", name: "Erdgeschoss" },
  { id: "floor-2", name: "1. Stock" },
]

const rooms: Room[] = [
  { id: "room-1", name: "Küche", floorId: "floor-1" },
  { id: "room-2", name: "Wohnzimmer", floorId: "floor-1" },
  { id: "room-3", name: "Schlafzimmer", floorId: "floor-2" },
  { id: "room-4", name: "Büro", floorId: "floor-2" },
]

const furnitures: Furniture[] = [
  { id: "furn-1", name: "Küchenschrank", roomId: "room-1" },
  { id: "furn-2", name: "Regal", roomId: "room-2" },
  { id: "furn-3", name: "Kommode", roomId: "room-3" },
  { id: "furn-4", name: "Schreibtisch", roomId: "room-4" },
]

const boxes: Box[] = [
  { id: "box-1", name: "Obere Ablage", furnitureId: "furn-1" },
  { id: "box-2", name: "Untere Ablage", furnitureId: "furn-1" },
  { id: "box-3", name: "Fach 1", furnitureId: "furn-2" },
  { id: "box-4", name: "Fach 2", furnitureId: "furn-2" },
  { id: "box-5", name: "Schublade links", furnitureId: "furn-3" },
  { id: "box-6", name: "Schublade rechts", furnitureId: "furn-3" },
  { id: "box-7", name: "Schublade unter Schreibtisch", furnitureId: "furn-4" },
]

const items: Item[] = [
  {
    id: "item-1",
    name: "Toaster",
    description: "Elektrischer Toaster",
    lastModifiedAt: new Date("2023-01-01"),
    isPrivate: false,
    ownerId: "user-1",
    boxId: "box-1",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "item-2",
    name: "Kaffeebecher",
    description: "Blauer Kaffeebecher",
    lastModifiedAt: new Date("2023-01-02"),
    isPrivate: true,
    ownerId: "user-1",
    boxId: "box-2",
    furnitureId: null,
    roomId: null,
    inMotionUserId: "user-2",
  },
  {
    id: "item-3",
    name: "Buch",
    description: "Roman",
    lastModifiedAt: new Date("2023-01-03"),
    isPrivate: false,
    ownerId: "user-2",
    boxId: "box-3",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "item-4",
    name: "Fernbedienung",
    description: "TV Fernbedienung",
    lastModifiedAt: new Date("2023-01-04"),
    isPrivate: false,
    ownerId: "user-1",
    furnitureId: "furn-2",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "item-5",
    name: "Kissen",
    description: "Dekoratives Kissen",
    lastModifiedAt: new Date("2023-01-05"),
    isPrivate: false,
    ownerId: "user-2",
    roomId: "room-2",
    boxId: null,
    furnitureId: null,
    inMotionUserId: "user-1",
  },
  {
    id: "item-6",
    name: "Laptop",
    description: "Arbeitslaptop",
    lastModifiedAt: new Date("2023-01-06"),
    isPrivate: true,
    ownerId: "user-1",
    roomId: "room-4",
    boxId: null,
    furnitureId: null,
    inMotionUserId: null,
  },
  {
    id: "item-7",
    name: "Schere",
    description: "Haushaltsschere",
    lastModifiedAt: new Date("2023-01-07"),
    isPrivate: false,
    ownerId: "user-3",
    furnitureId: "furn-1",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "item-8",
    name: "Lampe",
    description: "Stehlampe",
    lastModifiedAt: new Date("2023-01-08"),
    isPrivate: false,
    ownerId: "user-2",
    boxId: "box-5",
    furnitureId: null,
    roomId: null,
    inMotionUserId: "user-3",
  },
  {
    id: "item-9",
    name: "Notizblock",
    description: "Gelbe Notizblöcke",
    lastModifiedAt: new Date("2023-01-09"),
    isPrivate: false,
    ownerId: "user-1",
    boxId: "box-7",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "item-10",
    name: "Wasserkocher",
    description: "Elektrischer Wasserkocher",
    lastModifiedAt: new Date("2023-01-10"),
    isPrivate: false,
    ownerId: "user-3",
    furnitureId: "furn-4",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
]

export const userItemInteractions: UserItemInteraction[] = [
  {
    userId: "user-1",
    itemId: "item-1",
    isFavorite: true,
    lastUsedAt: new Date("2023-01-15"),
  },
  {
    userId: "user-1",
    itemId: "item-3",
    isFavorite: false,
    lastUsedAt: new Date("2023-01-16"),
  },
  {
    userId: "user-2",
    itemId: "item-5",
    isFavorite: true,
    lastUsedAt: new Date("2023-01-17"),
  },
  {
    userId: "user-3",
    itemId: "item-7",
    isFavorite: false,
    lastUsedAt: new Date("2023-01-18"),
  },
]

export async function getItems({
  currentUserId,
  searchText = "",
  locationFilter = "",
  statusFilter = "",
}: {
  currentUserId: string
  searchText?: string
  locationFilter?: string
  statusFilter?: string
}): Promise<Item[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredItems = items.filter(
    (item) => !item.isPrivate || item.ownerId === currentUserId,
  )

  if (searchText) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()),
    )
  }

  if (locationFilter) {
    filteredItems = filteredItems.filter((item) => {
      const box = item.boxId ? boxes.find((b) => b.id === item.boxId) : null
      const furniture = item.furnitureId
        ? furnitures.find((f) => f.id === item.furnitureId)
        : null
      const room = item.roomId ? rooms.find((r) => r.id === item.roomId) : null
      const floor = room ? floors.find((f) => f.id === room.floorId) : null
      const location =
        floor?.name || room?.name || furniture?.name || box?.name || ""
      return location.toLowerCase().includes(locationFilter.toLowerCase())
    })
  }

  if (statusFilter) {
    if (statusFilter === "free") {
      filteredItems = filteredItems.filter((item) => !item.inMotionUserId)
    } else if (statusFilter === "in-motion") {
      filteredItems = filteredItems.filter((item) => !!item.inMotionUserId)
    } else if (statusFilter === "mine") {
      filteredItems = filteredItems.filter(
        (item) => item.inMotionUserId === currentUserId,
      )
    } else if (statusFilter === "others") {
      filteredItems = filteredItems.filter(
        (item) => item.inMotionUserId && item.inMotionUserId !== currentUserId,
      )
    }
  }

  return filteredItems.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getHierarchicalData(): Promise<Floor[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return floors.map((floor) => ({
    ...floor,
    rooms: rooms
      .filter((room) => room.floorId === floor.id)
      .map((room) => ({
        ...room,
        furnitures: furnitures
          .filter((furniture) => furniture.roomId === room.id)
          .map((furniture) => ({
            ...furniture,
            boxes: boxes
              .filter((box) => box.furnitureId === furniture.id)
              .map((box) => ({
                ...box,
                items: items
                  .filter((item) => item.boxId === box.id)
                  .sort((a, b) => {
                    const aInMotion = !!a.inMotionUserId
                    const bInMotion = !!b.inMotionUserId
                    if (aInMotion !== bInMotion) return aInMotion ? 1 : -1
                    return a.name.localeCompare(b.name)
                  }),
              })),
            items: items
              .filter((item) => item.furnitureId === furniture.id)
              .sort((a, b) => {
                const aInMotion = !!a.inMotionUserId
                const bInMotion = !!b.inMotionUserId
                if (aInMotion !== bInMotion) return aInMotion ? 1 : -1
                return a.name.localeCompare(b.name)
              }),
          })),
        items: items
          .filter((item) => item.roomId === room.id)
          .sort((a, b) => {
            const aInMotion = !!a.inMotionUserId
            const bInMotion = !!b.inMotionUserId
            if (aInMotion !== bInMotion) return aInMotion ? 1 : -1
            return a.name.localeCompare(b.name)
          }),
      })),
  }))
}

export async function getDashboardData(currentUserId: string): Promise<{
  personalItems: Item[]
  othersItems: Item[]
  recentlyModified: Item[]
}> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const personalItems = items.filter((item) => item.ownerId === currentUserId)
  const othersItems = items.filter(
    (item) =>
      item.ownerId !== currentUserId &&
      (!item.isPrivate || item.ownerId === currentUserId),
  )
  const recentlyModified = items
    .filter((item) => !item.isPrivate || item.ownerId === currentUserId)
    .sort((a, b) => b.lastModifiedAt.getTime() - a.lastModifiedAt.getTime())
    .slice(0, 5)

  return { personalItems, othersItems, recentlyModified }
}

export async function toggleItemInMotion(
  itemId: string,
  currentUserId: string,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const itemIndex = items.findIndex((item) => item.id === itemId)
  if (itemIndex === -1) throw new Error(`Item not found: ${itemId}`)

  const item = items[itemIndex]
  if (!item.inMotionUserId) {
    items[itemIndex] = { ...item, inMotionUserId: currentUserId }
  } else if (item.inMotionUserId === currentUserId) {
    items[itemIndex] = { ...item, inMotionUserId: null }
  } else {
    items[itemIndex] = { ...item, inMotionUserId: null }
  }
}
