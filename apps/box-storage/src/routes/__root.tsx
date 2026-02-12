import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type React from "react"
import { ClerkProvider } from "@clerk/tanstack-react-start"
import Header from "../components/Header"
import appCss from "../styles.css?url"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth()

  return {
    userId,
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()

    return {
      userId,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Box Storage",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="p-4">
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
