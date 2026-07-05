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
