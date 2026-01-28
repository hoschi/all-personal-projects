import { loginFn } from "@/data/actions"

export function hasToken() {
  return !!localStorage.getItem("token")
}

export async function login(callback: () => void) {
  const { username } = await loginFn({
    data: { username: "alice", password: "blubs" },
  })
  localStorage.setItem("token", username)
  callback()
}
