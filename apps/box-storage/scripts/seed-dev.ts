/**
 * Box-Storage Development Seed Data Script
 *
 * This script populates the database with realistic sample data for development:
 * - 4 Clerk user IDs for ownership and interactions
 * - 2 Floors (EG, OG)
 * - Per Floor 2 Rooms (Wohnzimmer, Küche, etc.)
 * - Per Room 2 Furnitures
 * - Per Furniture 2 Boxes
 * - 20-30 Items with various locations (some in Boxes, some direct in Furniture/Room)
 * - UserItemInteractions for favorites and lastUsedAt
 */

import { prisma } from "@/data/prisma"
import { match } from "ts-pattern"

/**
 * Clear all development data
 */
async function clearSeedData(): Promise<void> {
  console.log("🧹 Clearing development seed data...")

  try {
    // First delete all data
    await prisma.userItemInteraction.deleteMany()
    console.log("  ✅ UserItemInteractions deleted")

    await prisma.item.deleteMany()
    console.log("  ✅ Items deleted")

    await prisma.box.deleteMany()
    console.log("  ✅ Boxes deleted")

    await prisma.furniture.deleteMany()
    console.log("  ✅ Furnitures deleted")

    await prisma.room.deleteMany()
    console.log("  ✅ Rooms deleted")

    await prisma.floor.deleteMany()
    console.log("  ✅ Floors deleted")

    // Reset auto-increment counters using raw SQL with schema
    await prisma.$executeRaw`TRUNCATE TABLE "box_storage"."items" RESTART IDENTITY CASCADE`
    await prisma.$executeRaw`TRUNCATE TABLE "box_storage"."boxes" RESTART IDENTITY CASCADE`
    await prisma.$executeRaw`TRUNCATE TABLE "box_storage"."furniture" RESTART IDENTITY CASCADE`
    await prisma.$executeRaw`TRUNCATE TABLE "box_storage"."rooms" RESTART IDENTITY CASCADE`
    await prisma.$executeRaw`TRUNCATE TABLE "box_storage"."floors" RESTART IDENTITY CASCADE`
    console.log("  ✅ Auto-increment counters reset")

    console.log("✅ Development data cleared")
  } catch (error) {
    console.error("❌ Failed to clear data:", error)
    throw error
  }
}

/**
 * Create sample data
 */
async function seedDatabase(): Promise<void> {
  console.log("🌱 Starting Box-Storage development seed...")
  console.log("==============================================")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connection successful\n")

    // Clear existing data first
    await clearSeedData()
    console.log("")

    // Clerk user IDs and usernames for ownership and interactions
    const users = {
      alice: {
        id: "user_39U97yqxnMF3KaDTJP4kkN2owE6!",
        username: "alice",
      },
      bob: {
        id: "user_2fJ9aR1kT8pQmL7xX0yZ3vW5nN4!",
        username: "bob",
      },
      charlie: {
        id: "user_7kLmN2pQrS4tUvWxYzA1bC3dE5!",
        username: "charlie",
      },
      david: {
        id: "user_9mNoP6qRsT2uVwXyZ4aB7cD1eF!",
        username: "david",
      },
    }
    console.log("👥 Using Clerk user IDs...")
    console.log(`  ✅ alice: ${users.alice.id} (${users.alice.username})`)
    console.log(`  ✅ bob: ${users.bob.id} (${users.bob.username})`)
    console.log(`  ✅ charlie: ${users.charlie.id} (${users.charlie.username})`)
    console.log(`  ✅ david: ${users.david.id} (${users.david.username})`)
    console.log("✅ Clerk user IDs ready\n")

    // Create floors
    console.log("🏢 Creating floors...")
    const floor1 = await prisma.floor.create({
      data: {
        name: "Erdgeschoss",
      },
    })
    console.log(`  ✅ Floor created: ${floor1.name} (ID: ${floor1.id})`)

    const floor2 = await prisma.floor.create({
      data: {
        name: "1. Stock",
      },
    })
    console.log(`  ✅ Floor created: ${floor2.name} (ID: ${floor2.id})`)
    console.log("✅ Floors created\n")

    // Create rooms
    console.log("🏠 Creating rooms...")
    const rooms = [
      { name: "Küche", floorId: floor1.id },
      { name: "Wohnzimmer", floorId: floor1.id },
      { name: "Schlafzimmer", floorId: floor2.id },
      { name: "Büro", floorId: floor2.id },
    ]

    const createdRooms = []
    for (const roomData of rooms) {
      const room = await prisma.room.create({
        data: roomData,
      })
      createdRooms.push(room)
      const floorName =
        roomData.floorId === floor1.id ? floor1.name : floor2.name
      console.log(
        `  ✅ Room created: ${room.name} in ${floorName} (ID: ${room.id})`,
      )
    }
    console.log("✅ Rooms created\n")

    // Create furnitures
    console.log("🪑 Creating furnitures...")
    const furnitures = [
      { name: "Küchenschrank", roomId: createdRooms[0].id },
      { name: "Regal", roomId: createdRooms[1].id },
      { name: "Kommode", roomId: createdRooms[2].id },
      { name: "Schreibtisch", roomId: createdRooms[3].id },
    ]

    const createdFurnitures = []
    for (const furnitureData of furnitures) {
      const furniture = await prisma.furniture.create({
        data: furnitureData,
      })
      createdFurnitures.push(furniture)
      console.log(
        `  ✅ Furniture created: ${furniture.name} in ${createdRooms.find((r) => r.id === furnitureData.roomId)?.name} (ID: ${furniture.id})`,
      )
    }
    console.log("✅ Furnitures created\n")

    // Create boxes
    console.log("📦 Creating boxes...")
    const boxes = [
      { name: "Obere Ablage", furnitureId: createdFurnitures[0].id },
      { name: "Untere Ablage", furnitureId: createdFurnitures[0].id },
      { name: "Fach 1", furnitureId: createdFurnitures[1].id },
      { name: "Fach 2", furnitureId: createdFurnitures[1].id },
      { name: "Schublade links", furnitureId: createdFurnitures[2].id },
      { name: "Schublade rechts", furnitureId: createdFurnitures[2].id },
      {
        name: "Schublade unter Schreibtisch",
        furnitureId: createdFurnitures[3].id,
      },
      { name: "Obere Schublade", furnitureId: createdFurnitures[3].id },
    ]

    const createdBoxes = []
    for (const boxData of boxes) {
      const box = await prisma.box.create({
        data: boxData,
      })
      createdBoxes.push(box)
      console.log(
        `  ✅ Box created: ${box.name} in ${createdFurnitures.find((f) => f.id === boxData.furnitureId)?.name} (ID: ${box.id})`,
      )
    }
    console.log("✅ Boxes created\n")

    // Create items
    console.log("📋 Creating items...")
    const items = [
      // Items in boxes
      {
        name: "Toaster",
        description: "Elektrischer Toaster",
        isPrivate: false,
        ownerId: users.alice.id,
        ownerUsername: users.alice.username,
        boxId: createdBoxes[0].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Kaffeebecher",
        description: "Blauer Kaffeebecher",
        isPrivate: true,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: createdBoxes[1].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Buch",
        description: "Roman",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: createdBoxes[2].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Fernbedienung",
        description: "TV Fernbedienung",
        isPrivate: false,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: createdBoxes[3].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Kissen",
        description: "Dekoratives Kissen",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: createdBoxes[4].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Laptop",
        description: "Arbeitslaptop",
        isPrivate: true,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: createdBoxes[5].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Schere",
        description: "Haushaltsschere",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: createdBoxes[6].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Lampe",
        description: "Stehlampe",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: createdBoxes[7].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Notizblock",
        description: "Gelbe Notizblöcke",
        isPrivate: false,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: createdBoxes[0].id,
        furnitureId: null,
        roomId: null,
      },
      {
        name: "Wasserkocher",
        description: "Elektrischer Wasserkocher",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: createdBoxes[1].id,
        furnitureId: null,
        roomId: null,
      },

      // Items in furnitures
      {
        name: "DVD-Player",
        description: "Alter DVD-Player",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: null,
        furnitureId: createdFurnitures[1].id,
        roomId: null,
      },
      {
        name: "Bilderrahmen",
        description: "Familienfoto",
        isPrivate: true,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: createdFurnitures[2].id,
        roomId: null,
      },
      {
        name: "Taschenlampe",
        description: "LED-Taschenlampe",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: null,
        furnitureId: createdFurnitures[3].id,
        roomId: null,
      },
      {
        name: "Schlüsselbund",
        description: "Haustürschlüssel",
        isPrivate: false,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: createdFurnitures[0].id,
        roomId: null,
      },
      {
        name: "Bilderbuch",
        description: "Kinderbuch",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: null,
        furnitureId: createdFurnitures[1].id,
        roomId: null,
      },

      // Items in rooms
      {
        name: "Sofa",
        description: "Wohnzimmersofa",
        isPrivate: false,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[1].id,
      },
      {
        name: "Teppich",
        description: "Wohnzimmerteppich",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[1].id,
      },
      {
        name: "Vorhang",
        description: "Fenster Vorhang",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[2].id,
      },
      {
        name: "Bettdecke",
        description: "Winterbettdecke",
        isPrivate: true,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[2].id,
      },
      {
        name: "Stuhl",
        description: "Bürostuhl",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[3].id,
      },
      {
        name: "Monitor",
        description: "Computer Monitor",
        isPrivate: true,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[3].id,
      },
      {
        name: "Kühlschrank",
        description: "Kühlschrank",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[0].id,
      },
      {
        name: "Herd",
        description: "Gasherd",
        isPrivate: false,
        ownerId: users.bob.id,
        ownerUsername: users.bob.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[0].id,
      },
      {
        name: "Spülmaschine",
        description: "Geschirrspüler",
        isPrivate: false,
        ownerId: users.david.id,
        ownerUsername: users.david.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[0].id,
      },
      {
        name: "Mikrowelle",
        description: "Mikrowellenherd",
        isPrivate: false,
        ownerId: users.charlie.id,
        ownerUsername: users.charlie.username,
        boxId: null,
        furnitureId: null,
        roomId: createdRooms[0].id,
      },
    ]

    const createdItems = []
    for (let i = 0; i < items.length; i++) {
      const itemData = items[i]
      const item = await prisma.item.create({
        data: {
          ...itemData,
        },
      })
      createdItems.push(item)
      console.log(`  ✅ Item created: ${item.name} (ID: ${item.id})`)
    }
    console.log("✅ Items created\n")

    // Create user item interactions
    console.log("⭐ Creating user item interactions...")
    const interactions = [
      {
        userId: users.alice.id,
        userUsername: users.alice.username,
        itemId: createdItems[0].id,
        isFavorite: true,
        lastUsedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.david.id,
        userUsername: users.david.username,
        itemId: createdItems[1].id,
        isFavorite: false,
        lastUsedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.bob.id,
        userUsername: users.bob.username,
        itemId: createdItems[2].id,
        isFavorite: true,
        lastUsedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.bob.id,
        userUsername: users.bob.username,
        itemId: createdItems[3].id,
        isFavorite: false,
        lastUsedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.charlie.id,
        userUsername: users.charlie.username,
        itemId: createdItems[4].id,
        isFavorite: true,
        lastUsedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.charlie.id,
        userUsername: users.charlie.username,
        itemId: createdItems[5].id,
        isFavorite: false,
        lastUsedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.david.id,
        userUsername: users.david.username,
        itemId: createdItems[6].id,
        isFavorite: false,
        lastUsedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users.bob.id,
        userUsername: users.bob.username,
        itemId: createdItems[7].id,
        isFavorite: true,
        lastUsedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
    ]

    for (const interactionData of interactions) {
      await prisma.userItemInteraction.create({
        data: interactionData,
      })
      console.log(
        `  ✅ Interaction created: User ${interactionData.userId} - Item ${interactionData.itemId} (Favorite: ${interactionData.isFavorite})`,
      )
    }
    console.log("✅ User item interactions created\n")

    console.log("\n🎉 Development seed completed successfully!")
    console.log("\n📊 Summary:")
    console.log("  👥 4 Clerk user IDs (alice, bob, charlie, david)")
    console.log("  🏢 2 Floors (Erdgeschoss, 1. Stock)")
    console.log("  🏠 4 Rooms (Küche, Wohnzimmer, Schlafzimmer, Büro)")
    console.log(
      "  🪑 4 Furnitures (Küchenschrank, Regal, Kommode, Schreibtisch)",
    )
    console.log("  📦 8 Boxes (various locations)")
    console.log(
      `  📋 ${createdItems.length} Items (10 in boxes, 5 in furnitures, 10 in rooms)`,
    )
    console.log(
      `  ⭐ ${interactions.length} User item interactions (favorites and last used)`,
    )
    console.log("\n💡 You can now start developing with realistic sample data!")
  } catch (error) {
    console.error("\n💥 Seed failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0] || "seed"

  await match(command)
    .with("seed", async () => {
      await seedDatabase()
    })
    .with("clear", async () => {
      await prisma.$connect()
      try {
        await clearSeedData()
      } finally {
        await prisma.$disconnect()
      }
    })
    .otherwise(() => {
      console.log("❓ Available commands:")
      console.log("  seed  - Populate database with sample data (default)")
      console.log("  clear - Remove all sample data")
      console.log("\nUsage:")
      console.log("  bun run scripts/seed-dev.ts seed")
      console.log("  bun run scripts/seed-dev.ts clear")
    })
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Script execution failed:", error)
    process.exit(1)
  })
}
