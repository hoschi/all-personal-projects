import { loginFn } from "@/data/actions"

export function hasToken() {
  return !!localStorage.getItem("token")
}

export function getToken() {
  return localStorage.getItem("token")
}

export function getUserId() {
  const stringId = localStorage.getItem("userId")
  if (!stringId) {
    throw new Error("It is not me, it is you thats doing this wrong!")
  }
  return parseInt(stringId, 10)
}

export async function login(callback: () => void) {
  const { username, id } = await loginFn({
    data: { username: "alice", password: "blubs" },
  })
  localStorage.setItem("token", username)
  localStorage.setItem("userId", id.toString())

  callback()
}
