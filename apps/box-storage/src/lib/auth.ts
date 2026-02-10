import { auth } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { useUser } from "@clerk/tanstack-react-start"

export const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    throw redirect({
      to: "/",
    })
  }

  return { userId }
})

export const useUserId = function () {
  const { user } = useUser()

  if (!user?.id) {
    throw Error("Use this only in authed routes!")
  }

  return user.id
}
