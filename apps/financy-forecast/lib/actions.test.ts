import { beforeEach, describe, expect, mock, test } from "bun:test"
import { Option } from "effect"
import { handleApproveSnapshot, handleSaveCurrentBalances } from "./actions"
import {
  NoAccountsAvailableError,
  SnapshotNotApprovableError,
} from "../domain/approveErrors"

const mockApproveCurrentBalancesAsSnapshot = mock()
const mockChangeSettings = mock()
const mockGetLatestAssetSnapshot = mock()
const mockUpdateForcastScenario = mock()
const mockUpdateAccountCurrentBalances = mock()
const mockNow = mock()
const mockRedirect = mock()

const mockRevalidateTag = mock()

mock.module("./db", () => ({
  approveCurrentBalancesAsSnapshot: mockApproveCurrentBalancesAsSnapshot,
  changeSettings: mockChangeSettings,
  getLatestAssetSnapshot: mockGetLatestAssetSnapshot,
  updateAccountCurrentBalances: mockUpdateAccountCurrentBalances,
  updateForcastScenario: mockUpdateForcastScenario,
}))

mock.module("next/cache", () => ({
  revalidateTag: mockRevalidateTag,
}))

mock.module("next/navigation", () => ({
  redirect: mockRedirect,
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
    mockUpdateAccountCurrentBalances.mockClear()
    mockRevalidateTag.mockClear()
    mockRedirect.mockClear()
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
    expect(mockRevalidateTag).toHaveBeenCalledWith("snapshots", "max")
    expect(mockRevalidateTag).toHaveBeenCalledWith("accounts", "max")
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

describe("handleSaveCurrentBalances", () => {
  beforeEach(() => {
    mockUpdateAccountCurrentBalances.mockClear()
    mockRevalidateTag.mockClear()
    mockRedirect.mockClear()
  })

  test("updates balances and revalidates accounts tag", async () => {
    mockUpdateAccountCurrentBalances.mockImplementation(async () => 1)
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT")
    })
    const formData = new FormData()
    formData.append("balance:550e8400-e29b-41d4-a716-446655440000", "10.50")
    formData.append("balance:550e8400-e29b-41d4-a716-446655440001", "0")

    await expect(handleSaveCurrentBalances(null, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    )

    expect(mockUpdateAccountCurrentBalances).toHaveBeenCalledWith([
      {
        accountId: "550e8400-e29b-41d4-a716-446655440000",
        currentBalance: 1050,
      },
      {
        accountId: "550e8400-e29b-41d4-a716-446655440001",
        currentBalance: 0,
      },
    ])
    expect(mockRevalidateTag).toHaveBeenCalledWith("accounts", "max")
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard")
  })

  test("returns validation error for invalid account id format", async () => {
    const formData = new FormData()
    formData.append("balance:not-a-uuid", "10")

    await expect(
      handleSaveCurrentBalances(null, formData),
    ).resolves.toMatchObject({
      success: false,
      error: "Validation failed",
    })
    expect(mockUpdateAccountCurrentBalances).not.toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
