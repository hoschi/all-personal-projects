import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { P, match } from "ts-pattern"
import { without } from "ramda"

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
let clerkUsernameCacheOrder: string[] = []
const CLERK_USERNAME_CACHE_LIMIT = 20

const cacheClerkUsername = (userId: string, username: string) => {
  // remove user from cache order
  clerkUsernameCacheOrder = without([userId], clerkUsernameCacheOrder)

  // add/overwrite user
  clerkUsernameCache[userId] = username
  clerkUsernameCacheOrder.push(userId)

  if (clerkUsernameCacheOrder.length <= CLERK_USERNAME_CACHE_LIMIT) {
    return
  }

  // remove oldest (first) user if limit reached
  const oldestUserId = clerkUsernameCacheOrder.shift()!
  delete clerkUsernameCache[oldestUserId]
}

export const getClerkUsername = async (userId: string): Promise<string> => {
  const cachedUsername = clerkUsernameCache[userId]
  if (cachedUsername) {
    return cachedUsername
  }

  const user = await clerkClient().users.getUser(userId)
  if (!user.username) {
    throw new Error(`Missing Clerk username for userId: ${userId}`)
  }

  cacheClerkUsername(userId, user.username)
  return user.username
}
