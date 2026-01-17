/* import z from "zod"
import { CATEGORIES } from "./data"

export const ItemId = z.number().int().positive().describe("Integer ID")
export type ItemId = z.infer<typeof ItemId>

export const Item = z.object({
  id: ItemId,
  title: z.string().describe("Short description of the item"),
  hasDiscount: z.boolean().describe("Has current campaign discount or not"),
  basePrice: z
    .number()
    .int()
    .nonnegative()
    .describe("Euro cent, e.g., 1000 means 10€"),
  category: z.enum(Object.values(CATEGORIES)).describe("Item category"),
})
export type Item = z.infer<typeof Item>

const ItemUpdateData = Item.omit({ id: true }).partial()
export type ItemUpdateData = z.infer<typeof ItemUpdateData>
 */
// TODO zod schema for the data used in frontend
