import { z } from "zod"

export const FloorSchema = z.object({
  id: z.number(),
  name: z.string(),
})
export type Floor = z.infer<typeof FloorSchema>

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
  floorId: z.number(),
})
export type Room = z.infer<typeof RoomSchema>

export const FurnitureSchema = z.object({
  id: z.number(),
  name: z.string(),
  roomId: z.number(),
})
export type Furniture = z.infer<typeof FurnitureSchema>

export const BoxSchema = z.object({
  id: z.number(),
  name: z.string(),
  furnitureId: z.number(),
})
export type Box = z.infer<typeof BoxSchema>

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isPrivate: z.boolean(),
  ownerId: z.string(),
  boxId: z.number().nullable(),
  furnitureId: z.number().nullable(),
  roomId: z.number().nullable(),
  inMotionUserId: z.string().nullable(),
})
export type Item = z.infer<typeof ItemSchema>

export const UserItemInteractionSchema = z.object({
  userId: z.string(),
  itemId: z.number(),
  isFavorite: z.boolean(),
  lastUsedAt: z.date(),
})
export type UserItemInteraction = z.infer<typeof UserItemInteractionSchema>
