# Mail Agent Migration Plan (n8n -> Monorepo Code)

Target workspace: `apps/mail-agent`

### Stack

- Runtime: Bun + TypeScript
- Server: lightweight Bun HTTP service
- Database ORM: Prisma (same pattern as `apps/box-storage` and `apps/sst`)
  - `DATABASE_URL` + `DATABASE_SCHEMA_NAME`
  - fixed schema name: `mail`
  - `prisma.config.ts` + `@prisma/adapter-pg` + generated Prisma client
- Validation: Zod
- Gmail API: `googleapis` + `google-auth-library`
- OpenAI: official `openai` npm SDK
- Telegram: TBD (we decide integration package/approach later)

### Feature scope (v0)

- Ingestion and sync
  - Poll Gmail changes via `users.history.list`
  - Recover with full sync when history is invalid/expired
  - Normalize messages/threads (including HTML -> markdown reduction)
- Mail processing behavior
  - Private emails bypass AI and trigger direct user notification
  - Non-private emails go through AI keep/delete decision
  - AI creates the user-facing summary based on extracted prompts
  - Keep strict classifier JSON contract: `deleteIt`, `summary`, `subject`, `reason`
- Gmail actions
  - `deleteIt = true`: soft-delete semantics via labels/inbox state (not hard delete)
  - `deleteIt = false`: apply keep label
  - Add AI-managed/processed state to prevent duplicate handling
- User feedback and reversibility
  - Notification contains one undo link only
  - Undo endpoint reverses the system action and persists override
- Persistence
  - Store processed mail metadata, classifier output, and action trail
  - Store sync cursor state (`gmail_history_id`)
  - No seeding logic (data source is Gmail)
- Reliability
  - Idempotent processing by Gmail identifiers
  - Retries with bounded backoff for external API failures
  - Structured logs for each pipeline stage

### Documentation and onboarding policy (mandatory)

- `apps/mail-agent/README.md` is a living setup and test guide and must stay in sync with code.
- Every implementation step updates README in the same commit.
- README must always cover at least:
  - prerequisites (accounts, env vars, local services)
  - local setup from clone to first successful run
  - how to run each manual test from this plan
  - expected outcomes and common failure cases
  - rollback/cleanup notes for test runs

### Execution protocol (mandatory)

- Implement exactly one plan step per commit checkpoint.
- After each commit checkpoint, stop implementation and wait for explicit user instruction to continue.
- In every commit, extend `apps/mail-agent/README.md` with detailed explanations of the newly implemented logic.
- Use Mermaid diagrams whenever they improve understanding of flow, decision logic, or data movement.
- Temporary smoke tests/scripts are allowed during implementation but must be removed in the final cleanup step.

### Implementation reference documents

- Gmail reference: [`current/gmail-implementation-notes.md`](./gmail-implementation-notes.md)
  - Use in Step 3 for Gmail env/config setup.
  - Use in Step 4 for polling, history cursor, and full-sync fallback behavior.
  - Use in Step 6 and Step 7 for Gmail label mutations and undo reversal behavior.
- Telegram reference: [`current/telegram-implementation-notes.md`](./telegram-implementation-notes.md)
  - Use in Step 3 for Telegram env/config setup.
  - Use in Step 7 for notifier adapter shape, message formatting, and provider error handling.

## Step 1: Scaffold app workspace and runtime contracts

Deliverables:

- Create `apps/mail-agent` workspace with scripts aligned to monorepo:
  - `dev`, `build`, `start`, `check-types`, `lint`, `test`
- Add base folder structure (`src/config`, `src/data`, `src/gmail`, `src/ai`, `src/notify`, `src/http`, `src/pipeline`)
- Keep prompt source-of-truth in `current/n8n-prompts.md` during implementation.
- Do not copy prompt files into `apps/mail-agent` before v0 is implemented.
- Create initial `apps/mail-agent/README.md` focused on what is usable after Step 1.

How to test this step:

- `bun run --filter mail-agent check-types`
- `bun run --filter mail-agent lint`
- `bun run --filter mail-agent test` (empty/basic test runner boot is enough)

Commit checkpoint:

- `chore(mail-agent): scaffold workspace and runtime contracts`

## Step 2: Add Prisma baseline with schema `mail`

Deliverables:

- Implement Prisma setup exactly like `box-storage`/`sst`:
  - `prisma.config.ts` loading `.env.base` then optional `.env`
  - datasource URL pattern with schema parameter from env
  - `src/data/prisma.ts` using `@prisma/adapter-pg`
- Set required env convention:
  - `DATABASE_URL=...`
  - `DATABASE_SCHEMA_NAME=mail`
- Add Prisma schema and first migration with at least:
  - `processed_emails`
  - `agent_state`
- Explicitly do **not** create any seed script/file.
- Update README with DB setup, schema `mail`, and migration commands.

How to test this step:

- `bun run --filter mail-agent prisma generate`
- `bun run --filter mail-agent prisma migrate dev --name init`
- `bun run --filter mail-agent db:smoke` (minimal insert/read in both tables)

Commit checkpoint:

- `feat(mail-agent): add prisma setup and initial mail schema`

## Step 3: Implement fail-fast configuration and app bootstrap

Deliverables:

- Central config parser with Zod for required env values
- Startup must fail fast on missing/invalid config
- Initial app bootstrap and dependency wiring
- Update README env section with complete variable reference and example flow.
- Apply env requirements from:
  - [`current/gmail-implementation-notes.md`](./gmail-implementation-notes.md) (`Required environment variables`)
  - [`current/telegram-implementation-notes.md`](./telegram-implementation-notes.md) (`Required environment variables`)

Initial required env:

- `DATABASE_URL`
- `DATABASE_SCHEMA_NAME` (must be `mail`)
- `MAIL_AGENT_OPENAI_API_KEY`
- `MAIL_AGENT_OPENAI_MODEL`
- `MAIL_AGENT_PUBLIC_BASE_URL`
- `MAIL_AGENT_GMAIL_CLIENT_ID`
- `MAIL_AGENT_GMAIL_CLIENT_SECRET`
- `MAIL_AGENT_GMAIL_REFRESH_TOKEN`
- `MAIL_AGENT_POLL_INTERVAL_MS`
- `MAIL_AGENT_LABEL_AI_MANAGED`
- `MAIL_AGENT_LABEL_KEEP`
- `MAIL_AGENT_LABEL_DELETE`
- `MAIL_AGENT_TELEGRAM_BOT_TOKEN`
- `MAIL_AGENT_TELEGRAM_CHAT_ID`
- `MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS` (optional)
- `MAIL_AGENT_TELEGRAM_PARSE_MODE`

How to test this step:

- Start with missing env var -> process exits with clear error
- Start with full env -> service starts cleanly

Commit checkpoint:

- `feat(mail-agent): add fail-fast env configuration and bootstrap`

## Step 4: Build Gmail sync module with cursor handling

Deliverables:

- OAuth2 client from refresh token
- Polling based on stored `gmail_history_id`
- Fallback full sync path when Gmail returns invalid history (`404`)
- Message/thread fetch + normalization helpers
- Add temporary Gmail read smoke command (`bun run --filter mail-agent gmail:smoke`) that prints sender/subject preview for real mailbox verification during migration.
- Implement this step according to [`current/gmail-implementation-notes.md`](./gmail-implementation-notes.md):
  - `Polling model (history cursor)`
  - `Full sync fallback strategy`
  - `Message retrieval and shaping`

How to test this step:

- Start service with a valid mailbox and verify logs show detected candidate IDs.
- Verify `agent_state` persists and updates `gmail_history_id` after a poll cycle.
- Simulate invalid cursor by setting an outdated `gmail_history_id` in DB and rerun.
- Verify fallback path is used and sync continues successfully.
- Run `bun run --filter mail-agent gmail:smoke` and verify preview contains real sender/subject rows.
- Confirm README instructions were sufficient for you to execute this end-to-end test.

Commit checkpoint:

- `feat(mail-agent): implement gmail polling and cursor sync`

## Step 5: Implement AI classification and summary pipeline

Deliverables:

- Private-vs-non-private branching
- Private path: no AI classification
- Non-private path:
  - OpenAI call for keep/delete decision
  - strict Zod parse of `unknown` model output
  - summary generation path using extracted prompt semantics
- Enforce classifier result contract:
  - `deleteIt`, `summary`, `subject`, `reason`
- Add temporary AI smoke command (`bun run --filter mail-agent ai:smoke`) for private/non-private/manual parse checks during migration.
- Update README with manual AI test inputs and expected classifier output checks.

How to test this step:

- Run classification manually for one private and one non-private mail input.
- Verify private input bypasses AI and is marked for direct notification flow.
- Verify non-private input returns valid JSON with `deleteIt`, `summary`, `subject`, `reason`.
- Trigger one malformed model-output scenario and verify it is rejected with clear log output.
- Run `bun run --filter mail-agent ai:smoke` and verify private bypass path, non-private model path (or clear config error), and malformed output parse failure.
- Confirm README instructions were sufficient for you to execute and validate these checks.

Commit checkpoint:

- `feat(mail-agent): add ai decision and summary pipeline`

## Step 6: Apply Gmail actions and persist processing state

Deliverables:

- Map classifier decision to Gmail label/inbox mutations
- Persist processing result in `processed_emails`
- Idempotency guard by `gmail_message_id` (and optional thread-level guard)
- Update README with idempotency test procedure and expected DB states.
- Apply Gmail action semantics from [`current/gmail-implementation-notes.md`](./gmail-implementation-notes.md):
  - `Gmail actions required in v0`
  - `Error handling and reliability`

How to test this step:

- Process same message twice -> second pass is skipped safely
- `deleteIt=true` and `deleteIt=false` both produce expected DB + Gmail mutation calls

Commit checkpoint:

- `feat(mail-agent): persist actions and enforce idempotency`

## Step 7: Add notifier abstraction and undo endpoint

Deliverables:

- Introduce `Notifier` interface (Telegram adapter plugged later)
- Notification payload includes exactly one undo URL
- Implement `GET /mail-agent/undo?token=...`
- Signed undo token validation and reverse action execution
- Persist user override (`user_action`) in DB
- Build notifier adapter using [`current/telegram-implementation-notes.md`](./telegram-implementation-notes.md):
  - `Recommended technical direction`
  - `Messaging constraints and formatting`
  - `Integration shape for apps/mail-agent`
- Implement Gmail-side undo behavior using [`current/gmail-implementation-notes.md`](./gmail-implementation-notes.md):
  - `Undo requirements (Gmail side)`

How to test this step:

- Process one mail and open the generated undo link in browser.
- Verify Gmail action is reversed and `processed_emails.user_action` is updated.
- Verify emitted user notification contains exactly one undo link.
- Restart service and confirm undo state remains persisted and visible.
- Confirm README instructions were sufficient for you to run and verify undo behavior.

Commit checkpoint:

- `feat(mail-agent): add undo endpoint and notifier abstraction`

## Step 8: Re-enable strict runtime env checks

Deliverables:

- Remove temporary optional defaults used to unblock Step 4 Gmail-only local testing.
- Make OpenAI env values required again once AI integration is active:
  - `MAIL_AGENT_OPENAI_API_KEY`
  - `MAIL_AGENT_OPENAI_MODEL`
- Make Telegram notifier env values required again once notifier integration is active:
  - `MAIL_AGENT_TELEGRAM_BOT_TOKEN`
  - `MAIL_AGENT_TELEGRAM_CHAT_ID`
- Keep `MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS` optional.
- Update `apps/mail-agent/README.md` with a per-step env matrix that clearly distinguishes temporary Step 4 relaxations from final required production values.

How to test this step:

- Unset one required OpenAI env value and verify startup fails fast with a clear Zod error.
- Unset one required Telegram env value and verify startup fails fast with a clear Zod error.
- Start with full env and verify service boots cleanly.

Commit checkpoint:

- `chore(mail-agent): re-enable strict env checks for full runtime`

## Step 9: Remove temporary smoke tests and cleanup test surface

Deliverables:

- Remove all temporary smoke tests introduced for intermediate implementation validation.
- Remove temporary smoke scripts such as `db:smoke` once equivalent real workflow tests/checks exist.
- Remove temporary Gmail read smoke command `gmail:smoke` and its helper file.
- Remove temporary AI smoke command `ai:smoke` and its helper file.
- Remove smoke-only helper files that are not part of the v0 production runtime.
- Update `apps/mail-agent/README.md` to remove temporary smoke-test instructions.
- Keep only durable verification commands and tests intended for long-term maintenance.

How to test this step:

- `bun run --filter mail-agent check-types`
- `bun run --filter mail-agent lint`
- `bun run --filter mail-agent test`
- `bun run --filter mail-agent prisma migrate dev --name verify-cleanup` (must be no-op if schema unchanged)

Commit checkpoint:

- `chore(mail-agent): remove temporary smoke tests and cleanup docs`
