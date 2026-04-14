# Gmail Implementation Notes for `apps/mail-agent` (v0)

This document captures implementation-relevant Gmail details for the mail-agent migration.

## Scope assumptions for v0

- Source of truth is Gmail mailbox data (no local seeding).
- Processing model is pull-based polling.
- Mail state changes are done via label/inbox mutations (soft-delete semantics), not hard delete.

## OAuth2 and API prerequisites

- Enable Gmail API in Google Cloud project.
- Configure OAuth consent screen and add required test users.
- Create OAuth client credentials suitable for server-side flow.
- Store credentials in environment variables (never commit secrets).

Required scopes for v0:

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.labels`

## Required environment variables

- `MAIL_AGENT_GMAIL_CLIENT_ID`
- `MAIL_AGENT_GMAIL_CLIENT_SECRET`
- `MAIL_AGENT_GMAIL_REFRESH_TOKEN`
- `MAIL_AGENT_POLL_INTERVAL_MS`
- `MAIL_AGENT_LABEL_AI_MANAGED`
- `MAIL_AGENT_LABEL_KEEP`
- `MAIL_AGENT_LABEL_DELETE`

## Polling model (history cursor)

Use `users.history.list` with persisted cursor state:

- Persist `gmail_history_id` in DB (`agent_state`).
- Poll loop fetches changes since last known history ID.
- Keep interval stable and avoid overlapping runs.

Recommended high-level loop:

1. Load `gmail_history_id` from DB.
2. Call `users.history.list(startHistoryId=...)`.
3. Extract candidate message IDs from history events.
4. Fetch full message/thread payload for candidates.
5. Process candidates and update stored history ID.

## Full sync fallback strategy

When `users.history.list` fails with invalid/expired history ID (`404`):

- Trigger full sync fallback.
- Rebuild processing baseline from current mailbox state.
- Persist new valid `gmail_history_id`.
- Resume normal incremental polling.

## Message retrieval and shaping

- Read message/thread details from Gmail API before classification.
- Normalize payload for AI processing:
  - sender and recipients
  - subject
  - text and HTML body (convert HTML to markdown/plain reduced format)
  - labels and timestamps
- Keep enough metadata for idempotency and undo.

## Gmail actions required in v0

For each processed message:

- `deleteIt = true`
  - apply delete label
  - remove inbox label (soft-delete/archive style)
- `deleteIt = false`
  - apply keep label
- mark as AI-managed/processed to prevent duplicate handling

Implementation notes:

- Prefer `users.messages.modify` for label mutations.
- Keep action operations idempotent.
- Persist action result in `processed_emails`.

## Undo requirements (Gmail side)

Undo link handling must reverse previous Gmail mutation:

- Undo delete -> restore inbox/remove delete marker as needed
- Undo keep -> remove keep marker if applicable
- Persist user override (`user_action`) after successful reversal

## Error handling and reliability

- Categorize errors: auth, quota/rate, network, parse, data.
- Retry transient errors with bounded backoff.
- Do not swallow unexpected exceptions silently.
- Log API request context safely (without sensitive tokens).

## Manual verification checklist for this repo

1. Start service with valid Gmail credentials and labels.
2. Confirm poll loop loads and updates `gmail_history_id` in DB.
3. Force outdated cursor and verify full-sync fallback is executed.
4. Process one keep and one delete decision; verify Gmail labels/inbox state.
5. Trigger undo flow and verify Gmail state is reversed correctly.
6. Confirm idempotency by reprocessing same message and checking no duplicate action.

## Out of scope for v0

- Gmail push via Pub/Sub webhook architecture
- attachment-heavy workflows beyond current classifier needs
- advanced mailbox multi-account orchestration
