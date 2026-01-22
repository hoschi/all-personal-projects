import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  passwordHash: z.string(),
})
export type User = z.infer<typeof UserSchema>

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
  lastModifiedAt: z.date(),
  isPrivate: z.boolean(),
  ownerId: z.number(),
  boxId: z.number().nullable(),
  furnitureId: z.number().nullable(),
  roomId: z.number().nullable(),
  inMotionUserId: z.number().nullable(),
})
export type Item = z.infer<typeof ItemSchema>

export const UserItemInteractionSchema = z.object({
  userId: z.number(),
  itemId: z.number(),
  isFavorite: z.boolean(),
  lastUsedAt: z.date(),
})
export type UserItemInteraction = z.infer<typeof UserItemInteractionSchema>
