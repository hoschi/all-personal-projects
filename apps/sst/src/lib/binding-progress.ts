// A YT-bind sets `bindingStartedAt` atomically before the ~1-2 min critical
// enrich and clears it on success/rollback. This marker is the durable source
// for the in-progress spinner, so a reloaded client re-derives it from the tab
// snapshot instead of losing the client-only `bindingTabIds` state.
//
// A live bind must never be hidden, so the cutoff sits comfortably beyond the
// critical phase. A marker still set past the cutoff is treated as stale (e.g.
// the server crashed mid-bind) so the tab does not show a spinner forever.
export const BINDING_STALE_CUTOFF_MS = 10 * 60 * 1000

// Pure derivation (no `now()` util exists in this app — inject `now` for tests).
export function deriveBindingInProgress(
  bindingStartedAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (bindingStartedAt === null) {
    return false
  }
  return bindingStartedAt.getTime() > now.getTime() - BINDING_STALE_CUTOFF_MS
}

// Where-clause for the atomic bind-claim (used by bindYoutubeToTabFn's
// updateMany). A tab is claimable when it is in work mode AND either unbound
// (youtubeId null) OR its bindingStartedAt marker is older than the stale
// cutoff. The stale branch lets a fresh bind RECLAIM a tab whose previous bind
// died after the claim but before finalize/reset — without it, such a tab would
// stay permanently un-bindable. Semantics (mode work assumed):
//   - finalized (youtubeId set, bindingStartedAt null): `lt` on NULL is never
//     true → not claimable (correct, never steal a bound tab).
//   - in-progress (recent bindingStartedAt): not older than cutoff → not
//     claimable (correct, never steal a live bind).
//   - stale/crashed (old bindingStartedAt): older than cutoff → claimable.
// Extracted (prisma-free) so the where-clause is unit-testable without a DB.
export function buildStaleClaimWhere(tabId: string, now: Date = new Date()) {
  return {
    id: tabId,
    mode: "work" as const,
    OR: [
      { youtubeId: null },
      {
        bindingStartedAt: {
          lt: new Date(now.getTime() - BINDING_STALE_CUTOFF_MS),
        },
      },
    ],
  }
}
