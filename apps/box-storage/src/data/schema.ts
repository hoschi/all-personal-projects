import { z } from "zod"

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  passwordHash: z.string(),
})
export type User = z.infer<typeof UserSchema>

export const FloorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})
export type Floor = z.infer<typeof FloorSchema>

export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  floorId: z.string().uuid(),
})
export type Room = z.infer<typeof RoomSchema>

export const FurnitureSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  roomId: z.string().uuid(),
})
export type Furniture = z.infer<typeof FurnitureSchema>

export const BoxSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  furnitureId: z.string().uuid(),
})
export type Box = z.infer<typeof BoxSchema>

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  lastModifiedAt: z.date(),
  isPrivate: z.boolean(),
  ownerId: z.string().uuid(),
  boxId: z.string().uuid().nullable(),
  furnitureId: z.string().uuid().nullable(),
  roomId: z.string().uuid().nullable(),
  inMotionUserId: z.string().uuid().nullable(),
})
export type Item = z.infer<typeof ItemSchema>

export const UserItemInteractionSchema = z.object({
  userId: z.string().uuid(),
  itemId: z.string().uuid(),
  isFavorite: z.boolean(),
  lastUsedAt: z.date(),
})
export type UserItemInteraction = z.infer<typeof UserItemInteractionSchema>
