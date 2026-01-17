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
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    username: "alice",
    passwordHash: "hash1",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    username: "bob",
    passwordHash: "hash2",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    username: "charlie",
    passwordHash: "hash3",
  },
]

const floors: Floor[] = [
  { id: "550e8400-e29b-41d4-a716-446655440010", name: "Erdgeschoss" },
  { id: "550e8400-e29b-41d4-a716-446655440011", name: "1. Stock" },
]

const rooms: Room[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440020",
    name: "Küche",
    floorId: "550e8400-e29b-41d4-a716-446655440010",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440021",
    name: "Wohnzimmer",
    floorId: "550e8400-e29b-41d4-a716-446655440010",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440022",
    name: "Schlafzimmer",
    floorId: "550e8400-e29b-41d4-a716-446655440011",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440023",
    name: "Büro",
    floorId: "550e8400-e29b-41d4-a716-446655440011",
  },
]

const furnitures: Furniture[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440030",
    name: "Küchenschrank",
    roomId: "550e8400-e29b-41d4-a716-446655440020",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440031",
    name: "Regal",
    roomId: "550e8400-e29b-41d4-a716-446655440021",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440032",
    name: "Kommode",
    roomId: "550e8400-e29b-41d4-a716-446655440022",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440033",
    name: "Schreibtisch",
    roomId: "550e8400-e29b-41d4-a716-446655440023",
  },
]

const boxes: Box[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440040",
    name: "Obere Ablage",
    furnitureId: "550e8400-e29b-41d4-a716-446655440030",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440041",
    name: "Untere Ablage",
    furnitureId: "550e8400-e29b-41d4-a716-446655440030",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440042",
    name: "Fach 1",
    furnitureId: "550e8400-e29b-41d4-a716-446655440031",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440043",
    name: "Fach 2",
    furnitureId: "550e8400-e29b-41d4-a716-446655440031",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440044",
    name: "Schublade links",
    furnitureId: "550e8400-e29b-41d4-a716-446655440032",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440045",
    name: "Schublade rechts",
    furnitureId: "550e8400-e29b-41d4-a716-446655440032",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440046",
    name: "Schublade unter Schreibtisch",
    furnitureId: "550e8400-e29b-41d4-a716-446655440033",
  },
]

const items: Item[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440100",
    name: "Toaster",
    description: "Elektrischer Toaster",
    lastModifiedAt: new Date("2023-01-01"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    boxId: "550e8400-e29b-41d4-a716-446655440040",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Kaffeebecher",
    description: "Blauer Kaffeebecher",
    lastModifiedAt: new Date("2023-01-02"),
    isPrivate: true,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    boxId: "550e8400-e29b-41d4-a716-446655440041",
    furnitureId: null,
    roomId: null,
    inMotionUserId: "550e8400-e29b-41d4-a716-446655440002",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    name: "Buch",
    description: "Roman",
    lastModifiedAt: new Date("2023-01-03"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440002",
    boxId: "550e8400-e29b-41d4-a716-446655440042",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    name: "Fernbedienung",
    description: "TV Fernbedienung",
    lastModifiedAt: new Date("2023-01-04"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    furnitureId: "550e8400-e29b-41d4-a716-446655440031",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    name: "Kissen",
    description: "Dekoratives Kissen",
    lastModifiedAt: new Date("2023-01-05"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440002",
    roomId: "550e8400-e29b-41d4-a716-446655440021",
    boxId: null,
    furnitureId: null,
    inMotionUserId: "550e8400-e29b-41d4-a716-446655440001",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440105",
    name: "Laptop",
    description: "Arbeitslaptop",
    lastModifiedAt: new Date("2023-01-06"),
    isPrivate: true,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    roomId: "550e8400-e29b-41d4-a716-446655440023",
    boxId: null,
    furnitureId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440106",
    name: "Schere",
    description: "Haushaltsschere",
    lastModifiedAt: new Date("2023-01-07"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440003",
    furnitureId: "550e8400-e29b-41d4-a716-446655440030",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440107",
    name: "Lampe",
    description: "Stehlampe",
    lastModifiedAt: new Date("2023-01-08"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440002",
    boxId: "550e8400-e29b-41d4-a716-446655440044",
    furnitureId: null,
    roomId: null,
    inMotionUserId: "550e8400-e29b-41d4-a716-446655440003",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440108",
    name: "Notizblock",
    description: "Gelbe Notizblöcke",
    lastModifiedAt: new Date("2023-01-09"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    boxId: "550e8400-e29b-41d4-a716-446655440046",
    furnitureId: null,
    roomId: null,
    inMotionUserId: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440109",
    name: "Wasserkocher",
    description: "Elektrischer Wasserkocher",
    lastModifiedAt: new Date("2023-01-10"),
    isPrivate: false,
    ownerId: "550e8400-e29b-41d4-a716-446655440003",
    furnitureId: "550e8400-e29b-41d4-a716-446655440033",
    boxId: null,
    roomId: null,
    inMotionUserId: null,
  },
]

export const userItemInteractions: UserItemInteraction[] = [
  {
    userId: "550e8400-e29b-41d4-a716-446655440001",
    itemId: "550e8400-e29b-41d4-a716-446655440100",
    isFavorite: true,
    lastUsedAt: new Date("2023-01-15"),
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440001",
    itemId: "550e8400-e29b-41d4-a716-446655440102",
    isFavorite: false,
    lastUsedAt: new Date("2023-01-16"),
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002",
    itemId: "550e8400-e29b-41d4-a716-446655440104",
    isFavorite: true,
    lastUsedAt: new Date("2023-01-17"),
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440003",
    itemId: "550e8400-e29b-41d4-a716-446655440106",
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
