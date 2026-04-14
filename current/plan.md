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

## Step 1: Scaffold app workspace and prompt assets

Deliverables:

- Create `apps/mail-agent` workspace with scripts aligned to monorepo:
  - `dev`, `build`, `start`, `check-types`, `lint`, `test`
- Add base folder structure (`src/config`, `src/data`, `src/gmail`, `src/ai`, `src/notify`, `src/http`, `src/pipeline`)
- Copy extracted prompts into versioned files:
  - `src/prompts/classify-email.de.md`
  - `src/prompts/summarize-thread.de.md`

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

- Integration tests with mocked Gmail client:
  - valid history path returns expected candidates
  - invalid history path triggers full sync fallback
- Manual run logs candidate IDs and updates `agent_state`

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

How to test this step:

- Fixture-based tests for:
  - private email bypasses AI
  - normal newsletter gets valid classifier JSON
  - malformed model output is rejected and logged

Commit checkpoint:

- `feat(mail-agent): add ai decision and summary pipeline`

## Step 6: Apply Gmail actions and persist processing state

Deliverables:

- Map classifier decision to Gmail label/inbox mutations
- Persist processing result in `processed_emails`
- Idempotency guard by `gmail_message_id` (and optional thread-level guard)

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

- Unit tests for token sign/verify and expiry behavior
- Integration test: trigger undo link -> Gmail reverse action + DB update
- Contract test: emitted notification contains one and only one undo link

Commit checkpoint:

- `feat(mail-agent): add undo endpoint and notifier abstraction`

## Step 8: Wire final Telegram implementation and run full smoke tests

Deliverables:

- Plug chosen Telegram implementation into existing `Notifier` interface
- End-to-end run: poll -> classify -> apply -> notify -> undo
- Add operational README for local run and troubleshooting

How to test this step:

- Real mailbox smoke test with at least:
  - one private mail
  - one keep decision
  - one delete decision
  - one successful undo
- Verify DB rows + Gmail label state + delivered Telegram messages

Commit checkpoint:

- `feat(mail-agent): integrate telegram notifier and complete e2e flow`

### Note

Telegram implementation details are intentionally left open until your decision.
