import { beforeEach, describe, expect, mock, test } from "bun:test"
import { Option } from "effect"
import { handleApproveSnapshot } from "./actions"
import {
  NoAccountsAvailableError,
  SnapshotNotApprovableError,
} from "../domain/approveErrors"

const mockApproveCurrentBalancesAsSnapshot = mock()
const mockChangeSettings = mock()
const mockGetLatestAssetSnapshot = mock()
const mockUpdateForcastScenario = mock()
const mockNow = mock()

const mockUpdateTag = mock()

mock.module("./db", () => ({
  approveCurrentBalancesAsSnapshot: mockApproveCurrentBalancesAsSnapshot,
  changeSettings: mockChangeSettings,
  getLatestAssetSnapshot: mockGetLatestAssetSnapshot,
  updateForcastScenario: mockUpdateForcastScenario,
}))

mock.module("next/cache", () => ({
  updateTag: mockUpdateTag,
}))

mock.module("./utils", () => ({
  now: mockNow,
}))

describe("handleApproveSnapshot", () => {
  beforeEach(() => {
    mockApproveCurrentBalancesAsSnapshot.mockClear()
    mockChangeSettings.mockClear()
    mockGetLatestAssetSnapshot.mockClear()
    mockUpdateForcastScenario.mockClear()
    mockUpdateTag.mockClear()
    mockNow.mockReset()
  })

  test("approves initial snapshot when no previous snapshot exists", async () => {
    mockNow.mockReturnValue(new Date(2025, 4, 19))
    mockGetLatestAssetSnapshot.mockImplementation(async () => Option.none())
    mockApproveCurrentBalancesAsSnapshot.mockImplementation(async () => ({
      id: "snapshot-1",
      date: new Date(2025, 3, 1),
      totalLiquidity: 1000000,
    }))

    await expect(handleApproveSnapshot()).resolves.toBeUndefined()
    expect(mockApproveCurrentBalancesAsSnapshot).toHaveBeenCalledTimes(1)
    const firstCallArg = mockApproveCurrentBalancesAsSnapshot.mock.calls[0]?.[0]
    expect(firstCallArg).toEqual(new Date(2025, 3, 1))
    expect(mockUpdateTag).toHaveBeenCalledWith("snapshots")
    expect(mockUpdateTag).toHaveBeenCalledWith("accounts")
  })

  test("throws SnapshotNotApprovableError when snapshot is not approvable yet", async () => {
    mockNow.mockReturnValue(new Date(2025, 4, 19))
    const lastSnapshotDate = new Date(2999, 0, 1)

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some({
        id: "snapshot-1",
        date: lastSnapshotDate,
        totalLiquidity: 1000000,
      }),
    )

    await expect(handleApproveSnapshot()).rejects.toBeInstanceOf(
      SnapshotNotApprovableError,
    )
    expect(mockApproveCurrentBalancesAsSnapshot).not.toHaveBeenCalled()
  })

  test("approves next snapshot when last snapshot is approvable", async () => {
    mockNow.mockReturnValue(new Date(2025, 4, 19))
    const lastSnapshotDate = new Date(2020, 0, 1)

    mockGetLatestAssetSnapshot.mockImplementation(async () =>
      Option.some({
        id: "snapshot-1",
        date: lastSnapshotDate,
        totalLiquidity: 1000000,
      }),
    )
    mockApproveCurrentBalancesAsSnapshot.mockImplementation(async () => ({
      id: "snapshot-2",
      date: new Date(2020, 1, 1),
      totalLiquidity: 1200000,
    }))

    await expect(handleApproveSnapshot()).resolves.toBeUndefined()
    expect(mockApproveCurrentBalancesAsSnapshot).toHaveBeenCalledWith(
      new Date(2020, 1, 1),
    )
  })

  test("throws database no-account error when no accounts are available", async () => {
    mockNow.mockReturnValue(new Date(2025, 4, 19))
    mockGetLatestAssetSnapshot.mockImplementation(async () => Option.none())
    mockApproveCurrentBalancesAsSnapshot.mockImplementation(async () => {
      throw new NoAccountsAvailableError()
    })

    await expect(handleApproveSnapshot()).rejects.toBeInstanceOf(
      NoAccountsAvailableError,
    )
  })
})
