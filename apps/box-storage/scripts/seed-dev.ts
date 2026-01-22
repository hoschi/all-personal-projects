/**
 * Box Storage Development Seed Data Script
 *
 * This script populates the database with realistic sample data for development:
 * - 2-3 users with hashed passwords
 * - 2 floors (EG, OG)
 * - Rooms, furniture, boxes, items with various locations
 * - User item interactions (favorites, last used)
 */

import { execSync } from "child_process"
import * as bcrypt from "bcrypt"

// Load environment variables
import * as dotenv from "dotenv"
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable not set")
  console.log("Please create a .env file with DATABASE_URL=postgresql://...")
  process.exit(1)
}

/**
 * Execute SQL command directly
 */
function executeSql(sql: string): void {
  try {
    execSync(
      `psql "${DATABASE_URL}" -c "SET search_path TO box_storage, public; ${sql}"`,
      {
        stdio: "inherit",
        env: process.env,
      },
    )
  } catch (error) {
    console.error("❌ SQL execution failed:", sql)
    console.error("Error:", error)
    throw error
  }
}

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Get user IDs for reference
 */
function getUserIds(): { [username: string]: string } {
  try {
    const result = execSync(
      `psql "${DATABASE_URL}" -t -c "SET search_path TO box_storage, public; SELECT username, id FROM users ORDER BY username;"`,
      {
        encoding: "utf8",
        env: process.env,
      },
    ).trim()

    const users: { [username: string]: string } = {}
    const lines = result.split("\n")

    lines.forEach((line) => {
      const [username, id] = line.trim().split("|")
      if (username && id) {
        users[username.trim()] = id.trim()
      }
    })

    return users
  } catch {
    throw new Error("Failed to fetch user IDs")
  }
}

/**
 * Generate random date within last 30 days
 */
function getRandomRecentDate(): string {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const randomTime =
    thirtyDaysAgo.getTime() +
    Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  return new Date(randomTime).toISOString()
}

/**
 * Main seed function
 */
async function seedDatabase(): Promise<void> {
  console.log("🌱 Starting Box Storage development seed...")
  console.log("==============================================")

  try {
    // Test connection
    executeSql("SELECT 1")
    console.log("✅ Database connection successful\n")

    // Clear existing data first
    console.log("🧹 Clearing existing data...")
    executeSql("DELETE FROM user_item_interactions;")
    executeSql("DELETE FROM items;")
    executeSql("DELETE FROM boxes;")
    executeSql("DELETE FROM furniture;")
    executeSql("DELETE FROM rooms;")
    executeSql("DELETE FROM floors;")
    executeSql("DELETE FROM users;")
    console.log("✅ Existing data cleared\n")

    // Create users with hashed passwords
    console.log("👥 Creating users...")
    const users = [
      { username: "alice", password: "password123" },
      { username: "bob", password: "password456" },
      { username: "charlie", password: "password789" },
    ]

    for (const user of users) {
      const passwordHash = await hashPassword(user.password)
      const userSql = `
        INSERT INTO users (username, password_hash)
        VALUES ('${user.username}', '${passwordHash}');
      `
      executeSql(userSql)
      console.log(`  ✅ User ${user.username} created`)
    }
    console.log("✅ Users created\n")

    // Create floors
    console.log("🏠 Creating floors...")
    const floorsSql = `
      INSERT INTO floors (name) VALUES
      ('Erdgeschoss'),
      ('Obergeschoss');
    `
    executeSql(floorsSql)
    console.log("✅ Floors created\n")

    // Create rooms
    console.log("🚪 Creating rooms...")
    const roomsSql = `
      INSERT INTO rooms (name, floor_id) VALUES
      ('Wohnzimmer', (SELECT id FROM floors WHERE name = 'Erdgeschoss')),
      ('Küche', (SELECT id FROM floors WHERE name = 'Erdgeschoss')),
      ('Schlafzimmer', (SELECT id FROM floors WHERE name = 'Obergeschoss')),
      ('Badezimmer', (SELECT id FROM floors WHERE name = 'Obergeschoss'));
    `
    executeSql(roomsSql)
    console.log("✅ Rooms created\n")

    // Create furniture
    console.log("🪑 Creating furniture...")
    const furnitureSql = `
      INSERT INTO furniture (name, room_id) VALUES
      ('Wohnzimmerschrank', (SELECT id FROM rooms WHERE name = 'Wohnzimmer')),
      ('TV-Schrank', (SELECT id FROM rooms WHERE name = 'Wohnzimmer')),
      ('Küchenschrank Oben', (SELECT id FROM rooms WHERE name = 'Küche')),
      ('Küchenschrank Unten', (SELECT id FROM rooms WHERE name = 'Küche')),
      ('Kleiderschrank', (SELECT id FROM rooms WHERE name = 'Schlafzimmer')),
      ('Nachttisch', (SELECT id FROM rooms WHERE name = 'Schlafzimmer')),
      ('Badezimmerschrank', (SELECT id FROM rooms WHERE name = 'Badezimmer')),
      ('Spiegelschrank', (SELECT id FROM rooms WHERE name = 'Badezimmer'));
    `
    executeSql(furnitureSql)
    console.log("✅ Furniture created\n")

    // Create boxes
    console.log("📦 Creating boxes...")
    const boxesSql = `
      INSERT INTO boxes (name, furniture_id) VALUES
      ('Dekorationskiste', (SELECT id FROM furniture WHERE name = 'Wohnzimmerschrank')),
      ('Bilderrahmen Box', (SELECT id FROM furniture WHERE name = 'Wohnzimmerschrank')),
      ('DVD Sammlung', (SELECT id FROM furniture WHERE name = 'TV-Schrank')),
      ('Kabel Box', (SELECT id FROM furniture WHERE name = 'TV-Schrank')),
      ('Gewürze', (SELECT id FROM furniture WHERE name = 'Küchenschrank Oben')),
      ('Backzutaten', (SELECT id FROM furniture WHERE name = 'Küchenschrank Oben')),
      ('Töpfe', (SELECT id FROM furniture WHERE name = 'Küchenschrank Unten')),
      ('Pfannen', (SELECT id FROM furniture WHERE name = 'Küchenschrank Unten')),
      ('Winterkleidung', (SELECT id FROM furniture WHERE name = 'Kleiderschrank')),
      ('Sommerkleidung', (SELECT id FROM furniture WHERE name = 'Kleiderschrank')),
      ('Bettwäsche', (SELECT id FROM furniture WHERE name = 'Nachttisch')),
      ('Schlafzimmer Krimskrams', (SELECT id FROM furniture WHERE name = 'Nachttisch')),
      ('Handtücher', (SELECT id FROM furniture WHERE name = 'Badezimmerschrank')),
      ('Putzmittel', (SELECT id FROM furniture WHERE name = 'Badezimmerschrank')),
      ('Medikamente', (SELECT id FROM furniture WHERE name = 'Spiegelschrank')),
      ('Pflegeprodukte', (SELECT id FROM furniture WHERE name = 'Spiegelschrank'));
    `
    executeSql(boxesSql)
    console.log("✅ Boxes created\n")

    // Get user IDs for item creation
    const userIds = getUserIds()
    const aliceId = userIds["alice"]
    const bobId = userIds["bob"]
    const charlieId = userIds["charlie"]

    // Create items with various locations
    console.log("📋 Creating items...")
    const items = [
      // Items in boxes
      {
        name: "Weihnachtsdekoration",
        description: "Kugeln und Lichter",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Dekorationskiste')",
      },
      {
        name: "Familienfotos",
        description: "Alte Bilderrahmen",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Bilderrahmen Box')",
      },
      {
        name: "DVD Filme",
        description: "Klassiker Sammlung",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'DVD Sammlung')",
      },
      {
        name: "Kabelsalat",
        description: "Verschiedene Kabel",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Kabel Box')",
      },
      {
        name: "Gewürze",
        description: "Salz, Pfeffer, Paprika",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Gewürze')",
      },
      {
        name: "Mehl und Zucker",
        description: "Backzutaten",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Backzutaten')",
      },
      {
        name: "Kochtopfset",
        description: "5 Töpfe verschiedener Größen",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Töpfe')",
      },
      {
        name: "Pfannenset",
        description: "3 Antihaftpfannen",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Pfannen')",
      },
      {
        name: "Winterjacke",
        description: "Dicke Jacke",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Winterkleidung')",
      },
      {
        name: "Pullover",
        description: "Wollpullover",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Winterkleidung')",
      },
      {
        name: "Shorts",
        description: "Sommerkleidung",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Sommerkleidung')",
      },
      {
        name: "T-Shirts",
        description: "Baumwolle",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Sommerkleidung')",
      },
      {
        name: "Bettlaken",
        description: "Doppelbett",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Bettwäsche')",
      },
      {
        name: "Kopfkissenbezüge",
        description: "4 Stück",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Bettwäsche')",
      },
      {
        name: "Buch",
        description: "Alter Roman",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Schlafzimmer Krimskrams')",
      },
      {
        name: "Wecker",
        description: "Alter Wecker",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Schlafzimmer Krimskrams')",
      },
      {
        name: "Badetücher",
        description: "Große Handtücher",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Handtücher')",
      },
      {
        name: "Waschlappen",
        description: "Kleine Tücher",
        ownerId: parseInt(charlieId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Handtücher')",
      },
      {
        name: "Allergietabletten",
        description: "Notfall Medikamente",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Medikamente')",
      },
      {
        name: "Pflaster",
        description: "Erste Hilfe",
        ownerId: parseInt(aliceId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Medikamente')",
      },
      {
        name: "Shampoo",
        description: "Haarwaschmittel",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Pflegeprodukte')",
      },
      {
        name: "Zahnpasta",
        description: "Fluoridhaltig",
        ownerId: parseInt(bobId),
        boxId: "(SELECT id FROM boxes WHERE name = 'Pflegeprodukte')",
      },
      // Items directly in furniture
      {
        name: "Fernbedienung",
        description: "TV Fernbedienung",
        ownerId: parseInt(charlieId),
        furnitureId: "(SELECT id FROM furniture WHERE name = 'TV-Schrank')",
      },
      {
        name: "Bilderrahmen",
        description: "Familienfoto",
        ownerId: parseInt(charlieId),
        furnitureId:
          "(SELECT id FROM furniture WHERE name = 'Wohnzimmerschrank')",
      },
      // Items directly in rooms
      {
        name: "Sofa",
        description: "Großes Ecksofa",
        ownerId: parseInt(aliceId),
        roomId: "(SELECT id FROM rooms WHERE name = 'Wohnzimmer')",
      },
      {
        name: "Tisch",
        description: "Esstisch",
        ownerId: parseInt(bobId),
        roomId: "(SELECT id FROM rooms WHERE name = 'Küche')",
      },
      {
        name: "Bett",
        description: "Doppelbett",
        ownerId: parseInt(charlieId),
        roomId: "(SELECT id FROM rooms WHERE name = 'Schlafzimmer')",
      },
    ]

    // Insert items in batches by location type
    const boxItems = items.filter((i) => i.boxId)
    const furnitureItems = items.filter((i) => i.furnitureId)
    const roomItems = items.filter((i) => i.roomId)

    if (boxItems.length > 0) {
      const boxItemInserts = boxItems
        .map((item) => {
          const lastModifiedAt = getRandomRecentDate()
          return `(${item.ownerId}, '${item.name.replace(/'/g, "''")}', '${item.description.replace(/'/g, "''")}', '${lastModifiedAt}', false, ${item.boxId})`
        })
        .join(",\n        ")
      const boxItemsSql = `
        INSERT INTO items (owner_id, name, description, last_modified_at, is_private, box_id) VALUES
        ${boxItemInserts};
      `
      executeSql(boxItemsSql)
    }

    if (furnitureItems.length > 0) {
      const furnitureItemInserts = furnitureItems
        .map((item) => {
          const lastModifiedAt = getRandomRecentDate()
          return `(${item.ownerId}, '${item.name.replace(/'/g, "''")}', '${item.description.replace(/'/g, "''")}', '${lastModifiedAt}', false, ${item.furnitureId})`
        })
        .join(",\n        ")
      const furnitureItemsSql = `
        INSERT INTO items (owner_id, name, description, last_modified_at, is_private, furniture_id) VALUES
        ${furnitureItemInserts};
      `
      executeSql(furnitureItemsSql)
    }

    if (roomItems.length > 0) {
      const roomItemInserts = roomItems
        .map((item) => {
          const lastModifiedAt = getRandomRecentDate()
          return `(${item.ownerId}, '${item.name.replace(/'/g, "''")}', '${item.description.replace(/'/g, "''")}', '${lastModifiedAt}', false, ${item.roomId})`
        })
        .join(",\n        ")
      const roomItemsSql = `
        INSERT INTO items (owner_id, name, description, last_modified_at, is_private, room_id) VALUES
        ${roomItemInserts};
      `
      executeSql(roomItemsSql)
    }
    console.log("✅ Items created\n")

    // Create user item interactions (favorites and last used)
    console.log("⭐ Creating user item interactions...")
    const interactions: Array<{
      userId: number
      itemName: string
      isFavorite: boolean
      lastUsedAt?: string
    }> = [
      // Alice's favorites
      {
        userId: parseInt(aliceId),
        itemName: "Weihnachtsdekoration",
        isFavorite: true,
      },
      {
        userId: parseInt(aliceId),
        itemName: "Familienfotos",
        isFavorite: true,
      },
      { userId: parseInt(aliceId), itemName: "Sofa", isFavorite: true },
      // Bob's favorites
      { userId: parseInt(bobId), itemName: "DVD Filme", isFavorite: true },
      { userId: parseInt(bobId), itemName: "Winterjacke", isFavorite: true },
      // Charlie's favorites
      { userId: parseInt(charlieId), itemName: "Gewürze", isFavorite: true },
      { userId: parseInt(charlieId), itemName: "Bett", isFavorite: true },
    ]

    // Add some last used interactions (not favorites)
    const allItemNames = items.map((i) => i.name)
    for (let i = 0; i < 10; i++) {
      const randomUserId = [aliceId, bobId, charlieId][
        Math.floor(Math.random() * 3)
      ]
      const randomItemName =
        allItemNames[Math.floor(Math.random() * allItemNames.length)]
      const lastUsedAt = getRandomRecentDate()
      interactions.push({
        userId: parseInt(randomUserId),
        itemName: randomItemName,
        isFavorite: false,
        lastUsedAt,
      })
    }

    const interactionInserts = interactions
      .map((interaction) => {
        const lastUsedAt = interaction.lastUsedAt
          ? `'${interaction.lastUsedAt}'`
          : "CURRENT_TIMESTAMP"
        return `(${interaction.userId}, (SELECT id FROM items WHERE name = '${interaction.itemName.replace(/'/g, "''")}'), ${interaction.isFavorite}, ${lastUsedAt})`
      })
      .join(",\n      ")

    const interactionsSql = `
      INSERT INTO user_item_interactions (user_id, item_id, is_favorite, last_used_at) VALUES
      ${interactionInserts};
    `
    executeSql(interactionsSql)
    console.log("✅ User item interactions created\n")

    console.log("\n🎉 Development seed completed successfully!")
    console.log("\n📊 Summary:")
    console.log("  👥 3 Users (with hashed passwords)")
    console.log("  🏠 2 Floors (Erdgeschoss, Obergeschoss)")
    console.log("  🚪 4 Rooms (Wohnzimmer, Küche, Schlafzimmer, Badezimmer)")
    console.log("  🪑 8 Furniture pieces")
    console.log("  📦 16 Boxes")
    console.log("  📋 27 Items (in boxes, furniture, rooms)")
    console.log("  ⭐ User item interactions (favorites and usage)")
    console.log("\n💡 You can now start developing with realistic sample data!")
  } catch (error) {
    console.error("\n💥 Seed failed:", error)
    process.exit(1)
  }
}

/**
 * Clear all development data
 */
function clearSeedData(): void {
  console.log("🧹 Clearing development seed data...")

  try {
    executeSql("DELETE FROM user_item_interactions;")
    executeSql("DELETE FROM items;")
    executeSql("DELETE FROM boxes;")
    executeSql("DELETE FROM furniture;")
    executeSql("DELETE FROM rooms;")
    executeSql("DELETE FROM floors;")
    executeSql("DELETE FROM users;")

    console.log("✅ Development data cleared")
  } catch (error) {
    console.error("❌ Failed to clear data:", error)
    throw error
  }
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const command = args[0] || "seed"

  switch (command) {
    case "seed":
      seedDatabase()
      break
    case "clear":
      clearSeedData()
      break
    default:
      console.log("❓ Available commands:")
      console.log("  seed  - Populate database with sample data (default)")
      console.log("  clear - Remove all sample data")
      console.log("\nUsage:")
      console.log("  bun run scripts/seed-dev.ts seed")
      console.log("  bun run scripts/seed-dev.ts clear")
      break
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
