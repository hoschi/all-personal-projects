// For read-only UI text: localized currency output with symbol (e.g. "10,10 €").
export const eurFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
})

// For editable form inputs: plain numeric string without currency symbol (e.g. "10,10").
export function toInputValue(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2).replace(".", ",")
}

export function formatDelta(delta: number | null): string {
  if (delta === null) {
    return "—"
  }

  const formatted = eurFormatter.format(delta / 100)
  return delta > 0 ? `+${formatted}` : formatted
}

export function getDeltaColorClass(delta: number | null): string {
  if (delta === null || delta === 0) {
    return "text-muted-foreground"
  }

  return delta > 0 ? "text-emerald-700" : "text-red-600"
}
