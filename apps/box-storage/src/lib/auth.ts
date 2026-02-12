import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { P, match } from "ts-pattern"

export const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  return match({ isAuthenticated, userId })
    .with({ isAuthenticated: true, userId: P.string }, ({ userId }) => ({
      userId,
    }))
    .otherwise(() => {
      throw redirect({
        to: "/",
      })
    })
})

const clerkUsernameCache: Record<string, string> = {}
const clerkUsernameCacheOrder: string[] = []
const CLERK_USERNAME_CACHE_LIMIT = 20

const cacheClerkUsername = (userId: string, username: string) => {
  match(clerkUsernameCache[userId])
    .with(P.string, () => {
      const existingIndex = clerkUsernameCacheOrder.indexOf(userId)
      return match(existingIndex)
        .with(P.number.gte(0), (index) => {
          clerkUsernameCacheOrder.splice(index, 1)
          return undefined
        })
        .otherwise(() => undefined)
    })
    .otherwise(() => undefined)

  clerkUsernameCache[userId] = username
  clerkUsernameCacheOrder.push(userId)

  const oldestUserId = match(
    clerkUsernameCacheOrder.length > CLERK_USERNAME_CACHE_LIMIT,
  )
    .with(true, () => clerkUsernameCacheOrder.shift())
    .otherwise(() => undefined)

  match(oldestUserId)
    .with(P.string, (id) => {
      delete clerkUsernameCache[id]
      return undefined
    })
    .otherwise(() => undefined)
}

export const getClerkUsername = async (userId: string): Promise<string> => {
  return match(clerkUsernameCache[userId])
    .with(P.string, (username) => username)
    .otherwise(async () => {
      const user = await clerkClient().users.getUser(userId)

      return match(user.username)
        .with(P.string, (username) => {
          cacheClerkUsername(userId, username)
          return username
        })
        .otherwise(() => {
          throw new Error(`Missing Clerk username for userId: ${userId}`)
        })
    })
}
