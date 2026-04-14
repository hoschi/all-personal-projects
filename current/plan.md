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

## Step 1: Scaffold app workspace and prompt assets

Deliverables:

- Create `apps/mail-agent` workspace with scripts aligned to monorepo:
  - `dev`, `build`, `start`, `check-types`, `lint`, `test`
- Add base folder structure (`src/config`, `src/data`, `src/gmail`, `src/ai`, `src/notify`, `src/http`, `src/pipeline`)
- Copy extracted prompts into versioned files:
  - `src/prompts/classify-email.de.md`
  - `src/prompts/summarize-thread.de.md`
- Create initial `apps/mail-agent/README.md` with setup + step test checklist.

How to test this step:

- `bun run --filter mail-agent check-types`
- `bun run --filter mail-agent lint`
- `bun run --filter mail-agent test` (empty/basic test runner boot is enough)

Commit checkpoint:

- `chore(mail-agent): scaffold workspace and prompt assets`

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
- Run a minimal DB smoke test (insert/read in both tables)

Commit checkpoint:

- `feat(mail-agent): add prisma setup and initial mail schema`

## Step 3: Implement fail-fast configuration and app bootstrap

Deliverables:

- Central config parser with Zod for required env values
- Startup must fail fast on missing/invalid config
- Initial app bootstrap and dependency wiring
- Update README env section with complete variable reference and example flow.

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

How to test this step:

- Start service with a valid mailbox and verify logs show detected candidate IDs.
- Verify `agent_state` persists and updates `gmail_history_id` after a poll cycle.
- Simulate invalid cursor by setting an outdated `gmail_history_id` in DB and rerun.
- Verify fallback path is used and sync continues successfully.
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
- Update README with manual AI test inputs and expected classifier output checks.

How to test this step:

- Run classification manually for one private and one non-private mail input.
- Verify private input bypasses AI and is marked for direct notification flow.
- Verify non-private input returns valid JSON with `deleteIt`, `summary`, `subject`, `reason`.
- Trigger one malformed model-output scenario and verify it is rejected with clear log output.
- Confirm README instructions were sufficient for you to execute and validate these checks.

Commit checkpoint:

- `feat(mail-agent): add ai decision and summary pipeline`

## Step 6: Apply Gmail actions and persist processing state

Deliverables:

- Map classifier decision to Gmail label/inbox mutations
- Persist processing result in `processed_emails`
- Idempotency guard by `gmail_message_id` (and optional thread-level guard)
- Update README with idempotency test procedure and expected DB states.

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

How to test this step:

- Process one mail and open the generated undo link in browser.
- Verify Gmail action is reversed and `processed_emails.user_action` is updated.
- Verify emitted user notification contains exactly one undo link.
- Restart service and confirm undo state remains persisted and visible.
- Confirm README instructions were sufficient for you to run and verify undo behavior.

Commit checkpoint:

- `feat(mail-agent): add undo endpoint and notifier abstraction`
