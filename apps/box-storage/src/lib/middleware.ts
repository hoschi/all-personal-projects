import { createMiddleware } from "@tanstack/react-start"
import { getToken, hasToken } from "./auth"
import { prisma } from "@/data/prisma"
import { redirect } from "@tanstack/react-router"

export const authMiddleware = createMiddleware({ type: "function" })
  .client(({ next }) => {
    console.log("auth middleware - client")
    if (hasToken()) {
      const token = getToken()
      return next({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    return next()
  })
  .server(async ({ next, response }) => {
    console.log("auth middleware - server")
    const checkAuthOrRedirect = async () => {
      console.log("check auth")
      if (response.headers.Authorization) {
        const user = await prisma.user.findFirst({
          where: { username: response.headers.Authorization },
        })
        if (user) return
      }
      throw redirect({ to: "/" })
    }
    return await next({ context: { checkAuthOrRedirect } })
  })
