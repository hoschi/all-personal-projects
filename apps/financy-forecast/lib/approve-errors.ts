export class SnapshotNotApprovableError extends Error {
  constructor(public readonly earliestApprovalDate: Date) {
    super("Snapshot is not approvable yet")
    this.name = "SnapshotNotApprovableError"
  }
}
