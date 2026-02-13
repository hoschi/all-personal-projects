import { beforeEach, expect, mock, test } from "bun:test"

const mockAuth = mock()
const mockGetUser = mock()
const mockRedirect = mock()

mock.module("@clerk/tanstack-react-start/server", () => ({
  auth: mockAuth,
  clerkClient: () => ({
    users: {
      getUser: mockGetUser,
    },
  }),
}))

mock.module("@tanstack/react-router", () => ({
  redirect: mockRedirect,
}))

mock.module("@tanstack/react-start", () => ({
  createServerFn: () => ({
    handler: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  }),
}))

const loadAuthModule = async () =>
  await import(`./auth.ts?test=${Date.now()}-${Math.random()}`)

beforeEach(() => {
  mockAuth.mockReset()
  mockGetUser.mockReset()
  mockRedirect.mockReset()
  mockGetUser.mockImplementation(async (userId: string) => ({
    username: `username-${userId}`,
  }))
})

test("authStateFn returns userId when authenticated", async () => {
  const { authStateFn } = await loadAuthModule()
  mockAuth.mockResolvedValue({
    isAuthenticated: true,
    userId: "user-authenticated",
  })

  const result = await authStateFn()
  expect(result).toEqual({ userId: "user-authenticated" })
  expect(mockRedirect).not.toHaveBeenCalled()
})

test("authStateFn throws redirect when user is not authenticated", async () => {
  const { authStateFn } = await loadAuthModule()
  const redirectValue = { kind: "redirect", to: "/" }
  mockRedirect.mockReturnValue(redirectValue)
  mockAuth.mockResolvedValue({
    isAuthenticated: false,
    userId: null,
  })

  await expect(authStateFn()).rejects.toBe(redirectValue)
  expect(mockRedirect).toHaveBeenCalledWith({ to: "/" })
})

test("authStateFn throws redirect when userId is missing", async () => {
  const { authStateFn } = await loadAuthModule()
  const redirectValue = { kind: "redirect", to: "/" }
  mockRedirect.mockReturnValue(redirectValue)
  mockAuth.mockResolvedValue({
    isAuthenticated: true,
    userId: null,
  })

  await expect(authStateFn()).rejects.toBe(redirectValue)
  expect(mockRedirect).toHaveBeenCalledWith({ to: "/" })
})

test("getClerkUsername caches fetched usernames", async () => {
  const { getClerkUsername } = await loadAuthModule()

  const first = await getClerkUsername("user-cache")
  const second = await getClerkUsername("user-cache")

  expect(first).toBe("username-user-cache")
  expect(second).toBe("username-user-cache")
  expect(mockGetUser).toHaveBeenCalledTimes(1)
  expect(mockGetUser).toHaveBeenCalledWith("user-cache")
})

test("getClerkUsername throws when Clerk user has no username", async () => {
  const { getClerkUsername } = await loadAuthModule()
  mockGetUser.mockResolvedValue({ username: null })

  await expect(getClerkUsername("user-without-username")).rejects.toThrow(
    "Missing Clerk username for userId: user-without-username",
  )
})

test("getClerkUsername evicts oldest cache entry after limit", async () => {
  const { getClerkUsername } = await loadAuthModule()

  await getClerkUsername("user-0")
  for (let i = 1; i <= 20; i++) {
    await getClerkUsername(`user-${i}`)
  }

  expect(mockGetUser).toHaveBeenCalledTimes(21)

  await getClerkUsername("user-0")
  expect(mockGetUser).toHaveBeenCalledTimes(22)
})
