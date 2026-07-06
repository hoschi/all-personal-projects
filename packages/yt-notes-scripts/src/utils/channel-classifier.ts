import type { ChannelClass } from "../generated/prisma/enums"

/**
 * Auto-Klassifikations-Regel R11 (Cluster-2-Spec, korrigiert 2026-06-04).
 *
 * - Leere Stub-Menge => null (HITL muss entscheiden).
 * - Stubs nur in stefans-vault/private => 'privat'.
 * - Stubs in stefans-vault/private UND irgendeinem anderen Vault => null
 *   (HITL — ambig: Video taucht beruflich UND privat auf, User entscheidet).
 * - Stubs ausschließlich in Nicht-Private-Vaults (shared, user-KB-vault, Mix) => 'arbeit'.
 *
 * 'mixed' ist explizit NICHT Auto-Ergebnis (nur HITL-Wahl).
 */
export const autoClassify = (stubVaults: Set<string>): ChannelClass | null => {
  if (stubVaults.size === 0) return null
  const hasPrivate = stubVaults.has("stefans-vault/private")
  if (hasPrivate) {
    return stubVaults.size === 1 ? "privat" : null
  }
  return "arbeit"
}

export const formatAutoNote = (stubVaults: Set<string>): string => {
  const sorted = Array.from(stubVaults).sort()
  return `auto: stubs in ${sorted.join(", ")}`
}
