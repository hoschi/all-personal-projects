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
- Client rendering only (`ssr: false` in routes) to avoid SSR-specific runtime issues.
- CSR-only route runtime can use browser APIs directly (`window`, `localStorage`) without SSR guards.
- Active tab is persisted per client and restored on reload.
- Runtime exceptions in route UI flow are surfaced via TanStack route error boundaries (`errorComponent`) instead of being silently swallowed.

## Mandatory Project Rules Applied (`main-rules.md`)

- Use `bun` commands only (`bun run`, `bunx`), no npm-based workflows.
- Keep all code docs/readmes in English.
- Use latest Shadcn installation flow for new components.
- Prefer `NativeSelect` over `Select` where select inputs are needed.
- Follow React Compiler rule: no default manual memoization (`useMemo`/`useCallback`) unless explicitly required later.
- Use `useEffect` only for real side effects; keep pure derivations in render/state logic.
- Reuse shared Zod/contracts for enum-like values to avoid UI/backend drift.
- Use `UPPER_SNAKE_CASE` + `as const` for module-level constants.
- Do not silently swallow runtime exceptions; propagate unexpected errors to route/global error boundaries.

## Progress Snapshot

- [x] `feat(sst): scaffold new tanstack-start app on port 3059`
- [x] `feat(sst): add prisma schema for tabs sync and model run logging`
- [x] `docs(sst): explain sync logic and model telemetry storage with mermaid diagrams`
- [x] `feat(sst): implement tab sync server functions with field-level conflict handling`
- [x] `feat(sst): build tabbed editor ui with sync and conflict resolution actions`
- [x] `feat(sst): add microphone recording and local play-stop replay`
- [x] `feat(sst): add server-side whisper verbose-json and ollama correction pipeline`
- [x] `feat(infra): add caddy tls-internal reverse-proxy setup including sst domains`
- [x] `feat(sst): add debug diff view and transcription-correction timing metrics`
- [x] `feat(sst): align editor interactions with autosave put and cut-delete flow`
- [x] `feat(sst): auto-run improve on recording stop and add active tab delete control`
- [x] `docs(sst): refresh readme with recording-first flow and current feature set`
- [ ] `refactor(sst): decompose route index into feature modules`

## Commit-by-Commit Execution Plan

1. [x] Scaffold New App `apps/sst`
   - Copy the proven TanStack Start baseline from `box-storage` (without Clerk-specific code).
   - Set app metadata/scripts (`dev --port 3059`, build, lint, check-types, fix, format) with Bun/Turbo conventions.
   - Add base Tailwind/Shadcn wiring and route shell with two text areas + control strip.
   - Ensure app runs independently and does not modify `sst-web`.
   - Commit: `feat(sst): scaffold new tanstack-start app on port 3059`

2. [x] Define Domain Model + Prisma Schema for `sst`
   - Add Prisma config/schema for tabs, tab content fields, sync metadata, and model run logs.
   - Include per-field versioning metadata for conflict-safe updates.
   - Add migration files and typed Zod contracts for route/server-function boundaries.
   - Commit: `feat(sst): add prisma schema for tabs sync and model run logging`

3. [x] Document Sync + Telemetry Behavior for Reviewer Readability
   - Expand `apps/sst/README.md` so sync and model telemetry behavior can be understood without reading code.
   - Add Mermaid diagrams for polling sync flow, conflict resolution, logging flow, and persistence model.
   - Update this plan so commit history and plan stay aligned.
   - Commit: `docs(sst): explain sync logic and model telemetry storage with mermaid diagrams`

4. [x] Implement Server Functions for Tabs and Sync
   - Implement create/rename/list/select tab operations.
   - Implement field-level update endpoints with optimistic concurrency checks.
   - Return conflict payloads with clear server/client freshness info.
   - Add explicit conflict resolution operations (`Use Server Data`, `Write Client to Server`).
   - Commit: `feat(sst): implement tab sync server functions with field-level conflict handling`

5. [x] Build v0 UI for Tabs + Editing + Conflict Flows
   - Create tabbed UI with auto-naming + rename support.
   - Connect top and bottom textboxes to server-synced data model.
   - Add conflict UX and explicit actions in each tab context (`Use Server Data`, `Write Client to Server`).
   - Keep rough `sst-web` UX structure while using Shadcn/Tailwind components.
   - If select controls are added, use `NativeSelect` (not `Select`).
   - Commit: `feat(sst): build tabbed editor ui with sync and conflict resolution actions`

6. [x] Port Audio Recording + Local Replay
   - Port microphone recording behavior from `sst-web`.
   - Add simple replay control (`Play`/`Stop`) for latest recording in active tab session.
   - Keep recorded audio local-only in client state/storage for v0.
   - Commit: `feat(sst): add microphone recording and local play-stop replay`

7. [x] Implement Server-side Whisper + Ollama Pipeline
   - Add server-side transcription endpoint/function using Whisper `response_format=verbose_json`.
   - Normalize whitespace artifacts before correction.
   - Add Ollama correction step (`gemma3:latest`) with context from lower textbox.
   - Include grammar/punctuation/spelling fixes + context-aware named-entity correction prompt strategy.
   - Return both raw and corrected outputs.
   - Commit: `feat(sst): add server-side whisper verbose-json and ollama correction pipeline`

8. [x] Add SSL Infrastructure Files and Monorepo Scripts
   - Create `infra/caddy/Caddyfile`, `infra/docker-compose.yml`, `infra/setup-trust.sh`.
   - Create `infra/README.md` based on `current/ssl-infrastructure-plan.md` with setup and test instructions.
   - Add `sst` routes (`dev.sst.localhost`, `prod.sst.localhost`) and optional LAN aliases via `sslip.io`.
   - Add `.gitignore` entry for generated local root certificate.
   - Add/extend `start:prod` scripts for app packages and root scripts.
   - Ensure setup supports tablet-device testing over LAN aliases.
   - Commit: `feat(infra): add caddy tls-internal reverse-proxy setup including sst domains`

9. [x] Add Debug and Timing Observability in UI
   - Add `Debug` action showing diff between raw Whisper text and corrected text.
   - Replace upload-size indicator with timing metrics:
     - transcription duration
     - correction duration
     - total duration
   - Commit: `feat(sst): add debug diff view and transcription-correction timing metrics`

10. [x] Align Editor Interaction Design with `sst-web` Flow

- Remove manual save actions for top/bottom text and auto-save on content changes.
- Switch top and bottom textboxes to a stacked vertical layout.
- Replace `Improve Text` action with `Put` (`top` → append to `bottom`, then clear `top`).
- Replace `Save Bottom Text` with scissors action (`✂️`) that copies bottom text and deletes the current tab.
- Tune textbox font size to sit between current `sst` and `sst-web` baseline.
- Commit: `feat(sst): align editor interactions with autosave put and cut-delete flow`

11. [x] Automate Recording-Stop Processing and Active Tab Deletion

- Switch recording button labels to `start` / `recording`.
- Trigger `improveTabRecordingFn` automatically when recording stops.
- Write corrected result to top text and persist it immediately.
- Throttle top-text manual auto-save to 1 second.
- Add dedicated `Delete Tab` control next to `Debug` and keep local state in sync after deletion.
- Commit: `feat(sst): auto-run improve on recording stop and add active tab delete control`

12. [x] Refresh `apps/sst` README to Match Implemented Flow

- Rewrite README around the recording-first workflow.
- Document auto-improve-on-stop, top/bottom autosave behavior, `Put`, scissors copy+delete flow, and dedicated delete-tab action.
- Keep architecture/data model/env/dev command sections aligned with current runtime behavior.
- Commit: `docs(sst): refresh readme with recording-first flow and current feature set`

13. [ ] Resolve Remaining PR #19 Review Comments

- Implement the remaining deferred comments listed in `current/pr-19-non-frontend-comments.md`.
- Prioritize infra/monorepo items separately from SST backend/config/doc adjustments.
- Keep changes scoped to each comment and validate with targeted checks per affected area.
- Commit: `chore(sst): resolve remaining deferred pr-19 review comments`

14. [ ] Decompose `apps/sst/src/routes/index.tsx` into Feature Modules

- Follow the approved `/react-componize` decomposition plan from `current/sst-react-componize-plan.md`.
- Extract presentation sections into focused components under `src/features/sst/components`.
- Extract side-effect/state orchestration into dedicated hooks under `src/features/sst/hooks`.
- Move pure helpers (`diff`, `tab mappers`, browser storage helpers) into `src/features/sst/utils`.
- Keep behavior parity strictly unchanged while reducing file size and responsibility coupling.
- Commit: `refactor(sst): decompose route index into feature modules`

15. [ ] Persist Model Run Logs for Future Evaluation

- Store model run records locally after the corrected text is put into the top text box:
  - model input/output
  - model id
  - correction duration
  - git commit hash to know the source code state
- When the user uses the "put" button, save the top text box content into the stored model data
- With this information at hand, save it as one run log
- This way we can evaluate the model performance in the future: what input came from the ASR, what did the LLM and finally what wanted the user.
- Another use case for this logs is to create a long term memory of fixes
- Commit: `feat(sst): persist model run telemetry with git commit traceability`

16. [ ] Add Polling Sync Runtime

- Implement periodic polling and selective refresh for active tab state.
- Update the data when the tab is focused again (browser events)
- Handle stale-client detection and conflict state transitions.
- Prevent silent overwrite and ensure deterministic merge policy (explicit overwrite only).
- Commit: `feat(sst): add polling-based multi-client synchronization runtime`

17. [ ] Final Documentation + Verification Sweep

- Cross-link SSL doc and setup steps from `infra` docs.
- Validate with targeted checks (`check-types`, lint, relevant tests) and smoke run instructions.
- Verify docs are English and implementation follows the mandatory project rules above.
- Include tablet smoke-test instructions after SSL/LAN setup.
- Commit: `docs(sst): finalize verification notes and cross-links`

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
