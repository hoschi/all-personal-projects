export class SnapshotNotApprovableError extends Error {
  constructor(public readonly earliestApprovalDate: Date) {
    super("Snapshot is not approvable yet")
    this.name = "SnapshotNotApprovableError"
  }
}

export class NoAccountsAvailableError extends Error {
  constructor() {
    super("No accounts available to approve snapshot")
    this.name = "NoAccountsAvailableError"
  }
}
