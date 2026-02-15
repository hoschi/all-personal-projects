import { describe, expect, test } from "bun:test"
import {
  getLocationDisplay,
  getStatusKey,
  getStatusLabel,
  sortInventoryItems,
  type SortableInventoryItem,
} from "./list-items-utils"

describe("getLocationDisplay", () => {
  test("builds full hierarchy for box locations", () => {
    const value = getLocationDisplay({
      box: {
        name: "Blue Box",
        furniture: {
          name: "Workbench",
          room: {
            name: "Workshop",
            floor: {
              name: "Basement",
            },
          },
        },
      },
      furniture: null,
      room: null,
    })

    expect(value).toBe("Basement > Workshop > Workbench > Blue Box")
  })

  test("builds hierarchy for furniture locations", () => {
    const value = getLocationDisplay({
      box: null,
      furniture: {
        name: "Pantry Shelf",
        room: {
          name: "Kitchen",
          floor: {
            name: "Ground Floor",
          },
        },
      },
      room: null,
    })

    expect(value).toBe("Ground Floor > Kitchen > Pantry Shelf")
  })

  test("builds hierarchy for room-only locations", () => {
    const value = getLocationDisplay({
      box: null,
      furniture: null,
      room: {
        name: "Kitchen",
        floor: {
          name: "Ground",
        },
      },
    })

    expect(value).toBe("Ground > Kitchen")
  })

  test("returns unknown when no location relation is available", () => {
    const value = getLocationDisplay({
      box: null,
      furniture: null,
      room: null,
    })

    expect(value).toBe("Unknown")
  })
})

describe("status helpers", () => {
  test("maps status keys correctly", () => {
    expect(getStatusKey(null, "me")).toBe("free")
    expect(getStatusKey("me", "me")).toBe("mine")
    expect(getStatusKey("other-user", "me")).toBe("others")
  })

  test("maps status labels correctly", () => {
    expect(getStatusLabel("free")).toBe("Free")
    expect(getStatusLabel("mine")).toBe("In Motion (you)")
    expect(getStatusLabel("others")).toBe("In Motion (others)")
  })
})

describe("sortInventoryItems", () => {
  const items: SortableInventoryItem[] = [
    {
      id: 1,
      name: "Drill",
      locationDisplay: "Basement > Shelf",
      statusKey: "others",
    },
    {
      id: 2,
      name: "Apples",
      locationDisplay: "Kitchen > Pantry",
      statusKey: "free",
    },
    {
      id: 3,
      name: "Cable",
      locationDisplay: "Attic > Box",
      statusKey: "mine",
    },
  ]

  test("sorts by location asc", () => {
    const sorted = sortInventoryItems(items, "location", "asc").map(
      (item) => item.id,
    )

    expect(sorted).toEqual([3, 1, 2])
  })

  test("sorts location ties with direction-aware name/id tiebreakers", () => {
    const tiedItems: SortableInventoryItem[] = [
      {
        id: 1,
        name: "Alpha",
        locationDisplay: "Kitchen > Drawer",
        statusKey: "free",
      },
      {
        id: 2,
        name: "Bravo",
        locationDisplay: "Kitchen > Drawer",
        statusKey: "free",
      },
      {
        id: 3,
        name: "Bravo",
        locationDisplay: "Kitchen > Drawer",
        statusKey: "free",
      },
    ]

    const asc = sortInventoryItems(tiedItems, "location", "asc").map(
      (item) => item.id,
    )
    const desc = sortInventoryItems(tiedItems, "location", "desc").map(
      (item) => item.id,
    )

    expect(asc).toEqual([1, 2, 3])
    expect(desc).toEqual([3, 2, 1])
  })

  test("sorts by status asc and desc", () => {
    const asc = sortInventoryItems(items, "status", "asc").map(
      (item) => item.id,
    )
    const desc = sortInventoryItems(items, "status", "desc").map(
      (item) => item.id,
    )

    expect(asc).toEqual([2, 3, 1])
    expect(desc).toEqual([1, 3, 2])
  })

  test("sorts status ties with direction-aware name/id tiebreakers", () => {
    const tiedItems: SortableInventoryItem[] = [
      {
        id: 1,
        name: "Alpha",
        locationDisplay: "Room A",
        statusKey: "mine",
      },
      {
        id: 2,
        name: "Bravo",
        locationDisplay: "Room B",
        statusKey: "mine",
      },
      {
        id: 3,
        name: "Bravo",
        locationDisplay: "Room C",
        statusKey: "mine",
      },
    ]

    const asc = sortInventoryItems(tiedItems, "status", "asc").map(
      (item) => item.id,
    )
    const desc = sortInventoryItems(tiedItems, "status", "desc").map(
      (item) => item.id,
    )

    expect(asc).toEqual([1, 2, 3])
    expect(desc).toEqual([3, 2, 1])
  })
})
