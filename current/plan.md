# Implementation Plan: `sst` v0 Migration

## Goal

Build a new app `apps/sst` from scratch as v0, using the `sst-web` product logic/features and rough UI direction, but with the `box-storage` technical stack and monorepo conventions (TanStack Start, Tailwind/Shadcn, Turbo/Bun workflows). Keep `apps/sst-web` untouched.

## Source Documents

- Feature specification: [`current/features-sst-v0.md`](./features-sst-v0.md)
- SSL infrastructure plan (to become base for `infra/README.md` later): [`current/ssl-infrastructure-plan.md`](./ssl-infrastructure-plan.md)

## Chosen Architecture Decisions

- No auth/login for v0 (shared local environment data).
- Data layer via Prisma + PostgreSQL.
- Server-side pipeline for transcription/correction orchestration.
- Field-level conflict detection for tab synchronization (title/top/bottom fields).
- Audio replay is local-only and not synchronized.
- Sync transport for v0: polling (`3a` confirmed).
- SSL domain/port convention includes new `sst` app (`dev:3059`, `prod:4059`).

## Mandatory Project Rules Applied (`main-rules.md`)

- Use `bun` commands only (`bun run`, `bunx`), no npm-based workflows.
- Keep all code docs/readmes in English.
- Use latest Shadcn installation flow for new components.
- Prefer `NativeSelect` over `Select` where select inputs are needed.
- Follow React Compiler rule: no default manual memoization (`useMemo`/`useCallback`) unless explicitly required later.
- Use `useEffect` only for real side effects; keep pure derivations in render/state logic.
- Reuse shared Zod/contracts for enum-like values to avoid UI/backend drift.

## Commit-by-Commit Execution Plan

1. Scaffold New App `apps/sst`
   - Copy the proven TanStack Start baseline from `box-storage` (without Clerk-specific code).
   - Set app metadata/scripts (`dev --port 3059`, build, lint, check-types, fix, format) with Bun/Turbo conventions.
   - Add base Tailwind/Shadcn wiring and route shell with two text areas + control strip.
   - Ensure app runs independently and does not modify `sst-web`.
   - Commit: `feat(sst): scaffold new tanstack-start app on port 3059`

2. Define Domain Model + Prisma Schema for `sst`
   - Add Prisma config/schema for tabs, tab content fields, sync metadata, and model run logs.
   - Include per-field versioning metadata for conflict-safe updates.
   - Add migration files and typed Zod contracts for route/server-function boundaries.
   - Commit: `feat(sst): add prisma schema for tabs sync and model run logging`

3. Implement Server Functions for Tabs and Sync
   - Implement create/rename/list/select tab operations.
   - Implement field-level update endpoints with optimistic concurrency checks.
   - Return conflict payloads with clear server/client freshness info.
   - Add explicit overwrite operations (`Overwrite Server`, `Overwrite Client`).
   - Commit: `feat(sst): implement tab sync server functions with field-level conflict handling`

4. Build v0 UI for Tabs + Editing + Conflict Flows
   - Create tabbed UI with auto-naming + rename support.
   - Connect top and bottom textboxes to server-synced data model.
   - Add conflict UX and overwrite actions in each tab context.
   - Keep rough `sst-web` UX structure while using Shadcn/Tailwind components.
   - If select controls are added, use `NativeSelect` (not `Select`).
   - Commit: `feat(sst): build tabbed editor ui with sync and conflict resolution actions`

5. Port Audio Recording + Local Replay
   - Port microphone recording behavior from `sst-web`.
   - Add simple replay control (`Play`/`Stop`) for latest recording in active tab session.
   - Keep recorded audio local-only in client state/storage for v0.
   - Commit: `feat(sst): add microphone recording and local play-stop replay`

6. Implement Server-side Whisper + Ollama Pipeline
   - Add server-side transcription endpoint/function using Whisper `response_format=verbose_json`.
   - Normalize whitespace artifacts before correction.
   - Add Ollama correction step (`gemma3:latest`) with context from lower textbox.
   - Include grammar/punctuation/spelling fixes + context-aware named-entity correction prompt strategy.
   - Return both raw and corrected outputs.
   - Commit: `feat(sst): add server-side whisper verbose-json and ollama correction pipeline`

7. Add Debug and Timing Observability in UI
   - Add `Debug` action showing diff between raw Whisper text and corrected text.
   - Replace upload-size indicator with timing metrics:
     - transcription duration
     - correction duration
     - total duration
   - Commit: `feat(sst): add debug diff view and transcription-correction timing metrics`

8. Persist Model Run Logs for Future Evaluation
   - Store model run records including:
     - model input/output
     - model id
     - correction duration
     - git commit hash
   - Ensure logging is non-blocking for UX and resilient to partial failures.
   - Commit: `feat(sst): persist model run telemetry with git commit traceability`

9. Add Polling Sync Runtime
   - Implement periodic polling and selective refresh for active tab state.
   - Handle stale-client detection and conflict state transitions.
   - Prevent silent overwrite and ensure deterministic merge policy (explicit overwrite only).
   - Commit: `feat(sst): add polling-based multi-client synchronization runtime`

10. Add SSL Infrastructure Files and Monorepo Scripts
   - Create `infra/caddy/Caddyfile`, `infra/docker-compose.yml`, `infra/setup-trust.sh`.
   - Add `sst` routes (`dev.sst.localhost`, `prod.sst.localhost`) and optional LAN aliases via `sslip.io`.
   - Add `.gitignore` entry for generated local root certificate.
   - Add/extend `start:prod` scripts for app packages and root scripts.
   - Commit: `feat(infra): add caddy tls-internal reverse-proxy setup including sst domains`

11. Documentation + Verification
   - Add `apps/sst/README.md` draft based on `features-sst-v0.md`.
   - Cross-link SSL doc and setup steps from `infra` docs.
   - Validate with targeted checks (`check-types`, lint, relevant tests) and smoke run instructions.
   - Verify docs are English and implementation follows the mandatory project rules above.
   - Commit: `docs(sst): add v0 readme and verification notes`

## Acceptance Criteria

- `apps/sst` exists and works independently of `apps/sst-web`.
- Features in `features-sst-v0.md` are implemented for v0 scope.
- Polling-based cross-client sync works with field-level conflict detection and explicit overwrite actions.
- Debug diff and timing UI are available.
- Model run logging is persisted with commit traceability.
- SSL infrastructure plan is represented by concrete infra files and includes `sst` domains/ports.

## Out of Scope for v0

- WebSocket/SSE real-time sync transport.
- Automated model quality evaluation dashboards.
- Cross-client/server synchronization of raw audio files.
