import { createMiddleware } from "@tanstack/react-start"
import { getToken, hasToken } from "./lib/auth"

export const authMiddleware = createMiddleware({ type: "function" }).client(
  ({ next }) => {
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
  },
)
