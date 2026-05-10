import { addMonths, startOfMonth, subMonths } from "date-fns"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockedNow } = vi.hoisted(() => ({
  mockedNow: vi.fn<() => Date>(),
}))

vi.mock("@/lib/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/utils")>()

  return {
    ...original,
    now: mockedNow,
  }
})

import {
  calculateApprovable,
  calculateEarliestApprovalDate,
  calculateInitialSnapshotDate,
} from "./snapshots"

beforeEach(() => {
  mockedNow.mockReset()
})

afterEach(() => {
  mockedNow.mockReset()
})

describe("calculateApprovable", () => {
  const lastDate = new Date("2026-01-01T00:00:00.000Z")
  const threshold = calculateEarliestApprovalDate(lastDate)

  it("returns false when now is before threshold", () => {
    mockedNow.mockReturnValue(new Date("2026-02-28T00:00:00.000Z"))

    expect(calculateApprovable(lastDate)).toBe(false)
  })

  it("returns true when now equals threshold", () => {
    mockedNow.mockReturnValue(threshold)

    expect(calculateApprovable(lastDate)).toBe(true)
  })

  it("returns true when now is after threshold", () => {
    mockedNow.mockReturnValue(addMonths(threshold, 1))

    expect(calculateApprovable(lastDate)).toBe(true)
  })
})

describe("calculateInitialSnapshotDate", () => {
  it("uses mocked now when no reference date is provided", () => {
    const nowDate = new Date("2026-06-18T13:00:00.000Z")
    mockedNow.mockReturnValue(nowDate)

    expect(calculateInitialSnapshotDate()).toEqual(
      startOfMonth(subMonths(nowDate, 1)),
    )
  })

  it("uses explicit reference date without reading mocked now", () => {
    const referenceDate = new Date("2026-10-20T08:30:00.000Z")

    expect(calculateInitialSnapshotDate(referenceDate)).toEqual(
      startOfMonth(subMonths(referenceDate, 1)),
    )
  })
})
