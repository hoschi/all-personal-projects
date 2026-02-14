import { Either } from "effect"

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

export type ParseCurrentBalanceValueError = string

// Effect models Either as Either<Right, Left>.
export type ParseCurrentBalanceValueResult = Either.Either<
  number,
  ParseCurrentBalanceValueError
>

export function parseCurrentBalanceValue(
  rawValue: string,
): ParseCurrentBalanceValueResult {
  const normalized = normalizeBalanceInput(rawValue)

  if (normalized.length === 0) {
    return Either.left("Balance value is required")
  }

  const amount = Number(normalized)
  if (!Number.isFinite(amount)) {
    return Either.left(`Invalid balance value: ${rawValue}`)
  }

  return Either.right(Math.round(amount * 100))
}
