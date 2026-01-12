import { Item, ItemId, ItemUpdateData } from "./schema"
import { groupBy, prop } from "ramda"

export const CATEGORIES = {
  KITCHEN: "KITCHEN",
  ELECTRONICS: "ELECTRONICS",
  BATHROOM: "BATHROOM",
  LIVING_ROOM: "LIVING_ROOM",
  OFFICE: "OFFICE",
} as const

export async function getItems(): Promise<Item[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [...stock].sort(({ title: titleA }, { title: titleB }) =>
    titleA.localeCompare(titleB),
  )
}

type ItemMap = Record<string, Item[]>

export async function getItemsByCategory(): Promise<ItemMap> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return groupBy(prop("category"), stock)
}

export async function updateItem(id: ItemId, data: ItemUpdateData) {
  console.log(`## upaditng item: ${id} (DB)`)
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const i = stock.findIndex(({ id: itemId }) => id === itemId)
  if (i < 0) {
    throw new Error(`Uknown item: ${id}`)
  }

  stock[i] = { ...stock[i], ...data }
  console.log(`## item: ${id} updated (DB)`)
}

const stock: Item[] = [
  {
    id: 1,
    title: "Shelf",
    hasDiscount: false,
    basePrice: 1000,
    category: CATEGORIES.KITCHEN,
  },
  {
    id: 2,
    title: "Toaster",
    hasDiscount: true,
    basePrice: 2500,
    category: CATEGORIES.KITCHEN,
  },
  {
    id: 3,
    title: "Laptop",
    hasDiscount: false,
    basePrice: 120000,
    category: CATEGORIES.ELECTRONICS,
  },
  {
    id: 4,
    title: "Headphones",
    hasDiscount: true,
    basePrice: 15000,
    category: CATEGORIES.ELECTRONICS,
  },
  {
    id: 5,
    title: "Shower Curtain",
    hasDiscount: false,
    basePrice: 2000,
    category: CATEGORIES.BATHROOM,
  },
  {
    id: 6,
    title: "Towel Rack",
    hasDiscount: true,
    basePrice: 3000,
    category: CATEGORIES.BATHROOM,
  },
  {
    id: 7,
    title: "Sofa",
    hasDiscount: false,
    basePrice: 50000,
    category: CATEGORIES.LIVING_ROOM,
  },
  {
    id: 8,
    title: "Coffee Table",
    hasDiscount: true,
    basePrice: 15000,
    category: CATEGORIES.LIVING_ROOM,
  },
  {
    id: 9,
    title: "Desk Chair",
    hasDiscount: false,
    basePrice: 10000,
    category: CATEGORIES.OFFICE,
  },
  {
    id: 10,
    title: "Monitor Stand",
    hasDiscount: true,
    basePrice: 5000,
    category: CATEGORIES.OFFICE,
  },
]
