export type PlanReason = "plugin-output-to-private" | "reverse-reclassification"

export type PlanResult = {
  targetVault: string
  reason: PlanReason
} | null

export const planMove = (
  currentVault: string,
  classification: string | null,
): PlanResult => {
  if (currentVault === "stefans-vault/shared" && classification === "privat") {
    return {
      targetVault: "stefans-vault/private",
      reason: "plugin-output-to-private",
    }
  }
  if (currentVault === "stefans-vault/private" && classification === "arbeit") {
    return {
      targetVault: "stefans-vault/shared",
      reason: "reverse-reclassification",
    }
  }
  return null
}
