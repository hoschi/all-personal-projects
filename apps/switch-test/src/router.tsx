import { createRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"
import { LoadingIndi } from "./components/LoadingIndi"

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    defaultPendingComponent: LoadingIndi,

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
