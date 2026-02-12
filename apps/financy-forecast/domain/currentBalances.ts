export function calculateSnapshotDelta(
  currentBalance: number,
  snapshotBalance: number | null,
): number | null {
  if (snapshotBalance === null) {
    return null
  }

  return currentBalance - snapshotBalance
}

export function parseCurrentBalanceValue(rawValue: string): number {
  const normalized = rawValue.trim().replace(/,/g, ".")

  if (normalized.length === 0) {
    throw new Error("Balance value is required")
  }

  const amount = Number(normalized)
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid balance value: ${rawValue}`)
  }

  return Math.round(amount * 100)
}

export function tryParseCurrentBalanceValue(rawValue: string): number | null {
  try {
    return parseCurrentBalanceValue(rawValue)
  } catch {
    return null
  }
}

export function toInputValue(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2)
}
