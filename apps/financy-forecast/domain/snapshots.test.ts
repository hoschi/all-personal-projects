import { test, expect, mock, beforeEach } from "bun:test"
import { calculateApprovable } from "./snapshots"

const mockNow = mock()

mock.module("../lib/utils", () => ({
  now: mockNow,
}))

beforeEach(() => {
  mockNow.mockClear()
})

test("calculateApprovable - should return true when today equals approvable date", () => {
  const lastSnapshotDate = new Date("2025-03-01") // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date("2025-05-01"))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(true)
})

test("calculateApprovable - should return false one day before the earliest approvable date", () => {
  const lastSnapshotDate = new Date("2025-03-01") // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date("2025-04-30"))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(false)
})

test("calculateApprovable - should return true when today is after approvable date", () => {
  const lastSnapshotDate = new Date("2025-03-01") // snapshot represents 1.3. to 31.3. - next snapshot is from 1.4. to 30.4. and can be approved at 1.5. earliest!
  mockNow.mockReturnValue(new Date("2025-05-15"))
  const result = calculateApprovable(lastSnapshotDate)
  expect(result).toBe(true)
})
