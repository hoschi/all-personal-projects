# Financy Migration Plan: Next.js -> TanStack Start

## Goal

Migrate `apps/financy-forecast` from Next.js App Router to TanStack Start with feature parity and a safe fallback path.

## Status

In progress on 2026-05-03.
Step 7 (error/loading boundaries and runtime-error surfacing) is implemented.
Step 8 validation checks are complete; final cutover remains pending legacy app removal.

## Migration Principles

- Keep a preserved copy of the existing Next.js app as reference during migration; it does not need to stay runnable.
- Implement in locally testable chunks; strict micro-increments are optional.
- Preserve current DB schema and domain behavior.
- Avoid silent runtime error handling; surface unexpected errors via route boundaries.

## Step-by-Step Plan

### 1) Rename current app first (mandatory)

- Rename folder: `apps/financy-forecast` -> `apps/financy-forecast-next`.
- Rename package name: `@repo/financy-forecast` -> `@repo/financy-forecast-next`.
- Update all monorepo references (filters, scripts, docs, CI commands).
- Keep the legacy app as reference copy; runnable state is optional.

Deliverable: Existing Next.js app remains available under a clear legacy name.

### 2) Scaffold new TanStack app at original path

- Create a fresh `apps/financy-forecast` with TanStack Start + Vite + Nitro.
- Align structure with existing TanStack apps in repo (`box-storage`, `sst`):
  - `vite.config.ts` with `tanstackStart`, `nitro`, tailwind, react compiler plugin
  - `src/start.ts`, `src/router.tsx`, `src/routes/**`
- Set package scripts (`dev`, `build`, `start:prod`, `check-types`, `lint`, `test`).

Deliverable: Empty TanStack app starts successfully.

### 3) Migrate shared app shell and routing skeleton

- Recreate sidebar layout + providers in TanStack root route/layout.
- Add route skeletons for:
  - `/dashboard`
  - `/current/edit`
  - `/forecast`
  - `/settings`
- Port framework-independent domain modules first:
  - `domain/currentBalances.ts`
  - `domain/snapshots.ts`
  - `domain/approveErrors.ts`

Deliverable: Navigable app shell with placeholders and shared domain logic.

### 4) Port DB and data layer unchanged

- Move `lib/db.ts` and `lib/data.ts` into server-side TanStack modules.
- Keep SQL semantics and transactions identical.
- Keep `SET search_path TO financy_forecast` behavior.
- Keep env handling fail-fast for required DB variables.

Deliverable: TanStack runtime can read/write the same PostgreSQL schema.

### 5) Replace Next Server Actions with TanStack server functions

- Migrate:
  - `handleApproveSnapshot`
  - `handleSaveCurrentBalances`
  - `handleSaveForecastDirect`
  - `handleUpdateScenarioIsActive`
- Replace framework-specific behavior:
  - Next `updateTag` -> TanStack Query invalidation strategy
  - Next `redirect` -> TanStack router navigation pattern
- Preserve expected form error responses for user-correctable cases.

Deliverable: Mutations execute through TanStack server functions with equivalent behavior.

### 6) Route-by-route feature parity migration

- Dashboard: matrix data + snapshot approval flow.
- Current Edit: balance form, parsing, delta view, submit handling.
- Forecast: scenario editing, save flow, variable costs update.
- Settings: scenario list and active toggle flow.

Deliverable: Core workflows behave the same as in Next.js app.

### 7) Error/loading boundaries and UX stabilization

- Add route `errorComponent` handling for unexpected exceptions.
- Add route pending/loading states for async operations.
- Validate no silent error swallowing remains in migrated flows.

Deliverable: Stable runtime behavior under DB/network failures.

### 8) Validation and cutover

- Run targeted checks:
  - `bun run --filter @repo/financy-forecast lint`
  - `bun run --filter @repo/financy-forecast check-types`
  - `bun run --filter @repo/financy-forecast test`
- Manual parity smoke test:
  - dashboard matrix
  - snapshot approval
  - current balance save
  - forecast save/toggle
  - settings scenario state
- Remove `apps/financy-forecast-next` after successful cutover and final validation.

Deliverable: TanStack app is primary and validated; legacy copy is removed after verification.

## Open Decisions

- Remove Jotai if it is not required after route/component migration, check the usages and Tanstack Start docs if this is still needed
- Use `src/server/*` for server-side modules in the new app. Check the recommendations in the Tanstack Start docs to security handling for code which schould nerver run on the client.

## Definition of Done

- New `apps/financy-forecast` runs on TanStack Start in dev and prod.
- Feature parity for current core flows is confirmed.
- New app has no Next.js runtime dependencies.
- Legacy Next app copy is removed after migration is fully validated.
