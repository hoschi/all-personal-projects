const ELLIPSIS = "…"

export function truncateTitle(s: string, maxLength = 12): string {
  if (s.length <= maxLength) return s
  return s.slice(0, maxLength) + ELLIPSIS
}
