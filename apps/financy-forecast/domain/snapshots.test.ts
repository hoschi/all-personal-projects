import { test, expect, mock, beforeEach } from "bun:test"
import {
  calculateApprovable,
  calculateEarliestApprovalDate,
  calculateInitialSnapshotDate,
  calculateNextSnapshotDate,
} from "./snapshots"

const mockNow = mock()

mock.module("../lib/utils", () => ({
  now: mockNow,
}))

beforeEach(() => {
  mockNow.mockClear()
})

test("calculateApprovable - should return true when today equals approvable date", () => {
  const lastSnapshotDate = new Date(2025, 2, 1) // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date(2025, 4, 1))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(true)
})

test("calculateApprovable - should return false one day before the earliest approvable date", () => {
  const lastSnapshotDate = new Date(2025, 2, 1) // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date(2025, 3, 30))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(false)
})

test("calculateApprovable - should return true when today is after approvable date", () => {
  const lastSnapshotDate = new Date(2025, 2, 1) // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date(2025, 4, 15))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(true)
})

test("calculateNextSnapshotDate - should return first day of the next month", () => {
  const result = calculateNextSnapshotDate(new Date(2025, 2, 1))
  expect(result).toEqual(new Date(2025, 3, 1))
})

test("calculateInitialSnapshotDate - should return first day of previous month", () => {
  mockNow.mockReturnValue(new Date(2025, 4, 19))
  const result = calculateInitialSnapshotDate()
  expect(result).toEqual(new Date(2025, 3, 1))
})

test("calculateEarliestApprovalDate - should return plus two months", () => {
  const result = calculateEarliestApprovalDate(new Date(2025, 2, 1))
  expect(result).toEqual(new Date(2025, 4, 1))
})
