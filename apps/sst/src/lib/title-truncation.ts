const ELLIPSIS = "…" as const

export function truncateTitle(s: string, maxLength = 12): string {
  const chars = Array.from(s)
  if (chars.length <= maxLength) return s
  return chars.slice(0, maxLength).join("") + ELLIPSIS
}
