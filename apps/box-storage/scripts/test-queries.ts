#!/usr/bin/env bun

import {
  getItems,
  getHierarchicalData,
  getDashboardData,
  toggleItemInMotion,
} from "../src/data/data"

// Helper function to log test results
function logTest(testName: string, success: boolean, details?: string) {
  const status = success ? "✅ PASS" : "❌ FAIL"
  console.log(`${status} ${testName}`)
  if (details) {
    console.log(`   ${details}`)
  }
  console.log()
  return success
}

// Test 1: Items für Inventory View (mit Filtern für owner, isPrivate)
async function testInventoryView() {
  console.log("🧪 Testing Inventory View Filters\n")

  // Test: Alle Items für alice (owner filter)
  const aliceItems = await getItems({
    currentUserId: "550e8400-e29b-41d4-a716-446655440001", // alice
  })
  const aliceVisibleItems = aliceItems.filter(
    (item) =>
      !item.isPrivate ||
      item.ownerId === "550e8400-e29b-41d4-a716-446655440001",
  )
  const success1 = logTest(
    "Get all items for alice",
    aliceItems.length === aliceVisibleItems.length,
    `Found ${aliceItems.length} items (all should be visible to alice)`,
  )

  // Test: Items filtern nach Suchtext "Buch"
  const searchResults = await getItems({
    currentUserId: "550e8400-e29b-41d4-a716-446655440001",
    searchText: "Buch",
  })
  const expectedSearch = aliceItems.filter(
    (item) =>
      item.name.toLowerCase().includes("buch") ||
      item.description.toLowerCase().includes("buch"),
  )
  const success2 = logTest(
    "Search items by text 'Buch'",
    searchResults.length === expectedSearch.length,
    `Found ${searchResults.length} items matching 'Buch'`,
  )

  // Test: Items filtern nach Location "Regal"
  const locationResults = await getItems({
    currentUserId: "550e8400-e29b-41d4-a716-446655440001",
    locationFilter: "Regal",
  })
  const success3 = logTest(
    "Filter items by location 'Regal'",
    locationResults.length > 0,
    `Found ${locationResults.length} items in Regal`,
  )

  // Test: Items filtern nach Status "in-motion"
  const inMotionResults = await getItems({
    currentUserId: "550e8400-e29b-41d4-a716-446655440001",
    statusFilter: "in-motion",
  })
  const expectedInMotion = aliceItems.filter(
    (item) => item.inMotionUserId !== null,
  )
  const success4 = logTest(
    "Filter items by status 'in-motion'",
    inMotionResults.length === expectedInMotion.length,
    `Found ${inMotionResults.length} items in motion`,
  )

  return success1 && success2 && success3 && success4
}

// Test 2: Items für Dashboard (Meine Items, Andere Items, kürzlich modifizierte)
async function testDashboard() {
  console.log("🧪 Testing Dashboard Data\n")

  const dashboardData = await getDashboardData(
    "550e8400-e29b-41d4-a716-446655440001",
  ) // alice

  // Test: Meine Items (alice's items)
  const aliceItems = dashboardData.personalItems
  const expectedPersonalItems = aliceItems.filter(
    (item) => item.ownerId === "550e8400-e29b-41d4-a716-446655440001",
  )
  const success1 = logTest(
    "Dashboard: Personal items for alice",
    aliceItems.length === expectedPersonalItems.length,
    `Found ${aliceItems.length} personal items`,
  )

  // Test: Andere Items (nicht alice's items, visible)
  const othersItems = dashboardData.othersItems
  const expectedOthersItems = othersItems.filter(
    (item) =>
      item.ownerId !== "550e8400-e29b-41d4-a716-446655440001" &&
      (!item.isPrivate ||
        item.ownerId === "550e8400-e29b-41d4-a716-446655440001"),
  )
  const success2 = logTest(
    "Dashboard: Others items visible to alice",
    othersItems.length === expectedOthersItems.length,
    `Found ${othersItems.length} others items`,
  )

  // Test: Kürzlich modifizierte Items (top 5)
  const recentlyModified = dashboardData.recentlyModified
  const success3 = logTest(
    "Dashboard: Recently modified items",
    recentlyModified.length <= 5,
    `Found ${recentlyModified.length} recently modified items (max 5)`,
  )

  return success1 && success2 && success3
}

// Test 3: In Motion Status setzen/löschen
async function testInMotionStatus() {
  console.log("🧪 Testing In Motion Status Toggle\n")

  const itemId = "550e8400-e29b-41d4-a716-446655440100" // Toaster (alice's item, not in motion)
  const aliceId = "550e8400-e29b-41d4-a716-446655440001"

  // Test: Set to in motion
  await toggleItemInMotion(itemId, aliceId)
  const itemsAfterSet = await getItems({ currentUserId: aliceId })
  const itemAfterSet = itemsAfterSet.find((item) => item.id === itemId)
  const success1 = logTest(
    "Set item to in motion",
    itemAfterSet?.inMotionUserId === aliceId,
    `Item in motion by ${itemAfterSet?.inMotionUserId}`,
  )

  // Test: Remove from motion (same user)
  await toggleItemInMotion(itemId, aliceId)
  const itemsAfterRemove = await getItems({ currentUserId: aliceId })
  const itemAfterRemove = itemsAfterRemove.find((item) => item.id === itemId)
  const success2 = logTest(
    "Remove item from motion (same user)",
    itemAfterRemove?.inMotionUserId === null,
    `Item in motion by ${itemAfterRemove?.inMotionUserId}`,
  )

  // Test: Set to in motion by alice
  await toggleItemInMotion(itemId, aliceId)
  // Test: Try to remove by bob (should not work, should set to null instead)
  const bobId = "550e8400-e29b-41d4-a716-446655440002"
  await toggleItemInMotion(itemId, bobId)
  const itemsAfterBob = await getItems({ currentUserId: aliceId })
  const itemAfterBob = itemsAfterBob.find((item) => item.id === itemId)
  const success3 = logTest(
    "Different user removes from motion",
    itemAfterBob?.inMotionUserId === null,
    `Item in motion by ${itemAfterBob?.inMotionUserId} (should be null)`,
  )

  return success1 && success2 && success3
}

// Test 4: Hierarchische Struktur abfragen
/* eslint-disable @typescript-eslint/no-explicit-any */
async function testHierarchicalStructure() {
  console.log("🧪 Testing Hierarchical Structure\n")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hierarchy: any[] = await getHierarchicalData()

  // Test: Floors exist
  const success1 = logTest(
    "Hierarchical data contains floors",
    hierarchy.length > 0,
    `Found ${hierarchy.length} floors`,
  )

  // Test: Rooms in floors
  const totalRooms = hierarchy.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum: number, floor: any) => sum + floor.rooms.length,
    0,
  )
  const success2 = logTest(
    "Floors contain rooms",
    totalRooms > 0,
    `Total rooms across all floors: ${totalRooms}`,
  )

  // Test: Furniture in rooms
  const totalFurniture = hierarchy.reduce(
    (sum: number, floor: any) =>
      sum +
      floor.rooms.reduce(
        (roomSum: number, room: any) => roomSum + room.furnitures.length,
        0,
      ),
    0,
  )
  const success3 = logTest(
    "Rooms contain furniture",
    totalFurniture > 0,
    `Total furniture across all rooms: ${totalFurniture}`,
  )

  // Test: Boxes in furniture
  const totalBoxes = hierarchy.reduce(
    (sum: number, floor: any) =>
      sum +
      floor.rooms.reduce(
        (roomSum: number, room: any) =>
          roomSum +
          room.furnitures.reduce(
            (furnSum: number, furn: any) => furnSum + furn.boxes.length,
            0,
          ),
        0,
      ),
    0,
  )
  const success4 = logTest(
    "Furniture contain boxes",
    totalBoxes > 0,
    `Total boxes across all furniture: ${totalBoxes}`,
  )

  // Test: Items in boxes
  const totalBoxItems = hierarchy.reduce(
    (sum: number, floor: any) =>
      sum +
      floor.rooms.reduce(
        (roomSum: number, room: any) =>
          roomSum +
          room.furnitures.reduce(
            (furnSum: number, furn: any) =>
              furnSum +
              furn.boxes.reduce(
                (boxSum: number, box: any) => boxSum + box.items.length,
                0,
              ),
            0,
          ),
        0,
      ),
    0,
  )
  const success5 = logTest(
    "Boxes contain items",
    totalBoxItems > 0,
    `Total items in boxes: ${totalBoxItems}`,
  )

  return success1 && success2 && success3 && success4 && success5
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting Box-Storage Query Tests\n")
  console.log("=".repeat(50) + "\n")

  const results = await Promise.all([
    testInventoryView(),
    testDashboard(),
    testInMotionStatus(),
    testHierarchicalStructure(),
  ])

  console.log("=".repeat(50))
  const allPassed = results.every((result) => result)
  console.log(allPassed ? "🎉 All tests passed!" : "💥 Some tests failed!")
  console.log("=".repeat(50))

  process.exit(allPassed ? 0 : 1)
}

runAllTests().catch((error) => {
  console.error("❌ Test runner failed:", error)
  process.exit(1)
})
