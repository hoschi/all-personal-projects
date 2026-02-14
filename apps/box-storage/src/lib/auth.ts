import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"

export const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    throw redirect({
      to: "/",
    })
  }

  return { userId }
})

const clerkUsernameCache: Record<string, string> = {}
const clerkUsernameCacheOrder: string[] = []
const CLERK_USERNAME_CACHE_LIMIT = 20

const cacheClerkUsername = (userId: string, username: string) => {
  if (clerkUsernameCache[userId]) {
    const existingIndex = clerkUsernameCacheOrder.indexOf(userId)
    if (existingIndex >= 0) {
      clerkUsernameCacheOrder.splice(existingIndex, 1)
    }
  }

  clerkUsernameCache[userId] = username
  clerkUsernameCacheOrder.push(userId)

  if (clerkUsernameCacheOrder.length > CLERK_USERNAME_CACHE_LIMIT) {
    const oldestUserId = clerkUsernameCacheOrder.shift()
    if (oldestUserId) {
      delete clerkUsernameCache[oldestUserId]
    }
  }
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
