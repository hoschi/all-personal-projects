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

  test("sorts by name asc and desc", () => {
    const asc = sortInventoryItems(items, "name", "asc").map((item) => item.id)
    const desc = sortInventoryItems(items, "name", "desc").map(
      (item) => item.id,
    )

    expect(asc).toEqual([2, 3, 1])
    expect(desc).toEqual([1, 3, 2])
  })

  test("sorts by location asc", () => {
    const sorted = sortInventoryItems(items, "location", "asc").map(
      (item) => item.id,
    )

    expect(sorted).toEqual([3, 1, 2])
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
})
