export function calculateSnapshotDelta(
  currentBalance: number,
  snapshotBalance: number | null,
): number | null {
  if (snapshotBalance === null) {
    return null
  }

  return currentBalance - snapshotBalance
}

const THOUSANDS_DOT_PATTERN = /^[-+]?\d{1,3}(\.\d{3})+$/
const THOUSANDS_COMMA_PATTERN = /^[-+]?\d{1,3}(,\d{3})+$/

function normalizeBalanceInput(rawValue: string): string {
  const trimmed = rawValue.trim()
  const withoutSpaces = trimmed.replace(/\s+/g, "")
  const hasComma = withoutSpaces.includes(",")
  const hasDot = withoutSpaces.includes(".")

  if (hasComma && hasDot) {
    const lastCommaIndex = withoutSpaces.lastIndexOf(",")
    const lastDotIndex = withoutSpaces.lastIndexOf(".")

    // The last separator is treated as decimal separator, the other as thousands separator.
    if (lastCommaIndex > lastDotIndex) {
      return withoutSpaces.replace(/\./g, "").replace(/,/g, ".")
    }

    return withoutSpaces.replace(/,/g, "")
  }

  if (hasComma) {
    if (THOUSANDS_COMMA_PATTERN.test(withoutSpaces)) {
      return withoutSpaces.replace(/,/g, "")
    }

    return withoutSpaces.replace(/,/g, ".")
  }

  if (hasDot) {
    if (THOUSANDS_DOT_PATTERN.test(withoutSpaces)) {
      return withoutSpaces.replace(/\./g, "")
    }

    return withoutSpaces
  }

  return withoutSpaces
}

export function parseCurrentBalanceValue(rawValue: string): number {
  const normalized = normalizeBalanceInput(rawValue)

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
  return String(amountInCents / 100)
}
