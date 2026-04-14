# Mail Agent Migration Plan (n8n -> Monorepo Code)

## Goal

Implement the existing n8n Gmail workflow as a new monorepo project with equivalent behavior, while replacing infrastructure integrations:

- Supabase -> PostgreSQL
- Mattermost -> Telegram
- n8n OpenAI node -> OpenAI API/npm SDK

## Inputs reviewed

- Existing n8n workflow: `current/n8n-workflow.json`
- Email handling research: `current/gmail-api.md` (reviewed and removed)

## Monorepo fit and project shape

## Proposed location

Create a new app workspace:

- `apps/mail-agent`

Reasoning:

- This is a runnable service (polling + webhooks + notifications), not a shared library.
- Existing repo pattern already uses app workspaces for runnable services.

## Suggested runtime stack

- Runtime: Bun + TypeScript
- DB: PostgreSQL (`postgres` package, consistent with repo usage)
- Validation: Zod
- Gmail API: `googleapis` + `google-auth-library`
- OpenAI: official `openai` npm SDK
- Telegram: Bot API (HTTP) or lightweight SDK (`grammy`) with typed wrapper

## Functional behavior to preserve (v1)

1. Private emails are **not AI-classified**.
   - They trigger direct Telegram notification.
2. Non-private emails are AI-classified.
   - Decision: keep vs soft-delete (label/inbox changes, no hard delete by default)
   - AI summary is included in user message.
3. User message contains **one undo link only**.
   - Remove old `MEH` path and old second feedback link behavior.
4. User undo action updates mail labels/inbox and records user override in DB.

## Existing workflow behavior mapping (from n8n)

## Intake and filtering

- Trigger currently runs scheduled and event-based.
- AI processing query currently filters inbox + no-user-label style input.
- Private fallback path executes when no AI-eligible message is available.

## Thread and message shaping

- Thread is loaded, messages normalized, HTML converted to markdown for token reduction.
- Multi-message thread handling uses special summary path for latest message.
- Label checks include an `ai-managed` concept to avoid duplicate handling.

## Classification output contract

Structured classifier output currently expects:

- `deleteIt: boolean`
- `summary: string`
- `subject: string`
- `reason: string`

This contract should be preserved in code (Zod schema + strict parser).

## Action behavior

- `deleteIt = true` -> add delete label, remove inbox (soft delete behavior)
- `deleteIt = false` -> add keep label
- In both cases: send Telegram message and persist processing row

## Undo behavior

Current n8n has webhook routes for reversing actions. New code should provide one unified undo endpoint with secure tokenized link.

## Prompt assets extracted for reuse

## Prompt A: thread summary

- Role: helpful email agent in German
- Task: summarize conversation in 50 words, focus on latest email
- Output format: starts with `WICHTIG:` or `Nachricht:`, includes subject + summary
- Context: current date + serialized thread messages

## Prompt B: keep/delete classifier (long policy prompt)

Contains:

- Global keep/delete rules
- Sender-specific override rules
- Summary quality rules (50 words default, with exceptions)
- Required strict JSON shape (`deleteIt`, `summary`, `subject`, `reason`)

Implementation note:

- Keep the original prompt semantics; migrate text into versioned prompt files, e.g.:
  - `apps/mail-agent/src/prompts/classify-email.de.md`
  - `apps/mail-agent/src/prompts/summarize-thread.de.md`

## Architecture plan

## 1) Project scaffold

- Add `apps/mail-agent/package.json`, `tsconfig.json`, lint/format scripts aligned to repo.
- Add `dev`, `build`, `start:prod`, `check-types`, `lint`, `format` scripts.

## 2) Config and fail-fast env

- Load `.env.base` and optional `.env` (same repo conventions).
- Validate all required env vars with Zod and fail at startup.

Required env (initial):

- `MAIL_AGENT_DATABASE_URL`
- `MAIL_AGENT_DATABASE_SCHEMA`
- `MAIL_AGENT_OPENAI_API_KEY`
- `MAIL_AGENT_OPENAI_MODEL`
- `MAIL_AGENT_TELEGRAM_BOT_TOKEN`
- `MAIL_AGENT_TELEGRAM_CHAT_ID`
- `MAIL_AGENT_PUBLIC_BASE_URL`
- `MAIL_AGENT_GMAIL_CLIENT_ID`
- `MAIL_AGENT_GMAIL_CLIENT_SECRET`
- `MAIL_AGENT_GMAIL_REFRESH_TOKEN`
- `MAIL_AGENT_POLL_INTERVAL_MS`
- `MAIL_AGENT_LABEL_AI_MANAGED`
- `MAIL_AGENT_LABEL_KEEP`
- `MAIL_AGENT_LABEL_DELETE`

## 3) Database schema

Create SQL migration + typed repository for at least:

- `processed_emails`
  - `id`
  - `gmail_message_id` (unique)
  - `gmail_thread_id`
  - `classification_json` (jsonb)
  - `input_payload` (jsonb)
  - `telegram_message_id` (nullable)
  - `system_action` (`keep|delete`)
  - `user_action` (`undo_keep|undo_delete|none`)
  - `created_at`, `updated_at`

- `agent_state`
  - `key` (`gmail_history_id`)
  - `value`
  - `updated_at`

## 4) Gmail integration module

- OAuth2 client creation from refresh token
- Polling with `users.history.list` for `messageAdded`
- Full-sync fallback for expired historyId (`404`)
- Message/thread retrieval and normalization helpers
- Label mutation helpers (add/remove labels, archive/unarchive)

## 5) Decision pipeline module

Per candidate email/thread:

1. Determine private-vs-ai path
2. Private path -> direct Telegram notification + mark processed
3. AI path:
   - build input payload
   - run OpenAI classification with structured output parsing
   - run summary prompt when required (multi-message flow parity)
   - persist result
   - execute Gmail label/inbox mutation
   - send Telegram notification with one undo link

## 6) OpenAI module

- Wrap OpenAI calls in dedicated service
- Use deterministic response settings where possible
- Parse output as `unknown` then validate with Zod
- Return typed domain objects only

## 7) Telegram module

- Send markdown-safe message
- Include only one undo URL
- Store Telegram message ID for traceability

## 8) Undo endpoint

- Route example: `GET /mail-agent/undo?token=...`
- Token contains action context (`threadId`, inverse action, timestamp, signature)
- Validate token, apply reverse Gmail mutation, persist `user_action`
- Respond with simple confirmation text

## 9) Scheduling and execution

- Single service loop with lock to avoid overlapping polling runs
- Idempotency checks by `gmail_message_id` and/or `gmail_thread_id`
- Graceful retry with bounded backoff for Gmail/OpenAI/Telegram failures

## 10) Observability

- Structured logs for each pipeline stage
- Error categories: auth, quota, parse, network, data
- Optional dead-letter table for failed items

## Testing and verification plan

1. Unit tests
   - prompt output parser
   - keep/delete decision validator
   - undo token signing/verification
2. Integration tests (mocked external APIs)
   - AI path end-to-end
   - private path end-to-end
   - undo flow end-to-end
3. Manual smoke test
   - poll -> classify -> notify -> undo -> DB state verified

## Migration phases

## Phase 1: Foundation

- scaffold app, config, DB migrations, Gmail auth

## Phase 2: Core processing

- polling + candidate extraction + AI/private branching

## Phase 3: Delivery and undo

- Telegram formatting + secure undo endpoint

## Phase 4: Hardening

- idempotency, retries, logs, tests, docs

## Open decisions to confirm before implementation

1. Project name/path: confirm `apps/mail-agent`.
2. Telegram formatting style (plain text vs MarkdownV2).
3. Which n8n sender-specific rules should be kept 1:1 in v1 vs reduced baseline.
4. Poll interval target (1 min vs 5 min default).
5. Soft-delete semantics: label+archive only (recommended) vs trash.
