import { prisma } from "@/data/prisma"

// Prisma versions of the business functions
async function getItemsPrisma({
  currentUserId,
  searchText = "",
  locationFilter = "",
  statusFilter = "",
}: {
  currentUserId: number
  searchText?: string
  locationFilter?: string
  statusFilter?: string
}) {
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
    include: {
      owner: { select: { username: true } },
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: {
        select: {
          name: true,
          floor: { select: { name: true } },
        },
      },
      inMotionUser: { select: { username: true } },
    },
    orderBy: { name: "asc" },
  })
}

async function getDashboardDataPrisma(currentUserId: number) {
  // Personal items
  const personalItems = await prisma.item.findMany({
    where: { ownerId: currentUserId },
    include: {
      box: { select: { name: true } },
      furniture: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
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
    orderBy: { updatedAt: "desc" },
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
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return { personalItems, othersItems, recentlyModified }
}

async function toggleItemInMotionPrisma(itemId: number, currentUserId: number) {
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

async function getHierarchicalDataPrisma() {
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

async function main() {
  console.log("🧪 Testing Prisma queries...\n")

  // Get first user for testing
  const users = await prisma.user.findMany({ take: 1 })
  if (users.length === 0) {
    console.log("❌ No users found. Run seed-dev.ts first?")
    return
  }
  const currentUserId = users[0].id
  console.log(`👤 Using user ID: ${currentUserId} (${users[0].username})\n`)

  // Test 1: Items for Inventory View with filters
  console.log("📋 Test 1: Items for Inventory View")
  console.log("--- All items ---")
  const allItems = await getItemsPrisma({ currentUserId })
  console.log(`Found ${allItems.length} items`)

  console.log("\n--- Items with 'kaffee' search ---")
  const searchItems = await getItemsPrisma({
    currentUserId,
    searchText: "kaffee",
  })
  console.log(
    `Found ${searchItems.length} items:`,
    searchItems.map((i) => i.name),
  )

  console.log("\n--- Items in 'küche' location ---")
  const locationItems = await getItemsPrisma({
    currentUserId,
    locationFilter: "küche",
  })
  console.log(
    `Found ${locationItems.length} items:`,
    locationItems.map((i) => i.name),
  )

  console.log("\n--- Free items ---")
  const freeItems = await getItemsPrisma({
    currentUserId,
    statusFilter: "free",
  })
  console.log(
    `Found ${freeItems.length} items:`,
    freeItems.map((i) => i.name),
  )

  console.log("\n--- Items in motion ---")
  const inMotionItems = await getItemsPrisma({
    currentUserId,
    statusFilter: "in-motion",
  })
  console.log(
    `Found ${inMotionItems.length} items:`,
    inMotionItems.map((i) => i.name),
  )

  // Test 2: Dashboard data
  console.log("\n📊 Test 2: Dashboard Data")
  const dashboard = await getDashboardDataPrisma(currentUserId)
  console.log(`Personal items: ${dashboard.personalItems.length}`)
  console.log(`Others items: ${dashboard.othersItems.length}`)
  console.log(`Recently modified: ${dashboard.recentlyModified.length}`)

  // Test 3: Toggle in motion
  console.log("\n🔄 Test 3: Toggle In Motion")
  const itemForToggle = allItems[0]
  console.log(`Toggling item: ${itemForToggle.name} (ID: ${itemForToggle.id})`)
  console.log(`Before: inMotionUserId = ${itemForToggle.inMotionUserId}`)

  await toggleItemInMotionPrisma(itemForToggle.id, currentUserId)
  const afterToggle1 = await prisma.item.findUnique({
    where: { id: itemForToggle.id },
    select: { inMotionUserId: true },
  })
  console.log(
    `After toggle 1: inMotionUserId = ${afterToggle1?.inMotionUserId}`,
  )

  await toggleItemInMotionPrisma(itemForToggle.id, currentUserId)
  const afterToggle2 = await prisma.item.findUnique({
    where: { id: itemForToggle.id },
    select: { inMotionUserId: true },
  })
  console.log(
    `After toggle 2: inMotionUserId = ${afterToggle2?.inMotionUserId}`,
  )

  // Test 4: Hierarchical data
  console.log("\n🏗️ Test 4: Hierarchical Structure")
  const hierarchical = await getHierarchicalDataPrisma()
  console.log(`Found ${hierarchical.length} floors`)
  hierarchical.forEach((floor) => {
    console.log(`Floor: ${floor.name}`)
    floor.rooms.forEach((room) => {
      console.log(`  Room: ${room.name}`)
      console.log(`    Items: ${room.items.length}`)
      room.furniture.forEach((furniture) => {
        console.log(`    Furniture: ${furniture.name}`)
        console.log(`      Items: ${furniture.items.length}`)
        furniture.boxes.forEach((box) => {
          console.log(`      Box: ${box.name}`)
          console.log(`        Items: ${box.items.length}`)
        })
      })
    })
  })

  console.log("\n✅ All tests completed successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
