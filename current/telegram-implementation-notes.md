# Telegram Implementation Notes for `apps/mail-agent` (v0)

This document extracts only the implementation-relevant Telegram details for the current mail-agent scope.

## Scope assumptions for v0

- Primary use case is notification delivery from server to one known user/chat.
- Undo flow is handled by HTTP link (`/mail-agent/undo?token=...`) in our app, not by Telegram callback handling.
- Interactive Telegram command/reply processing is optional for later versions.

## Recommended technical direction

- Use **Telegram Bot API** (HTTP) for v0.
- Do **not** use TDLib/MTProto for this project scope.
- Start with a notifier adapter that supports:
  - `sendMessage`
  - optional `editMessageText` (future)
  - optional `setMessageReaction` (future)

## Library choice

- Preferred TypeScript library: **grammY**.
- Rationale for this repo context:
  - strong TS support
  - active ecosystem
  - easy migration path from send-only mode to long polling

## Local operation model

### If v0 only sends notifications

- No webhook required.
- No long polling required.
- Server can call `sendMessage` directly with known `chat_id`.

### If inbound bot messages are needed later

- Use **long polling** (`getUpdates`) with:
  - `timeout=30`
  - tracked `offset = last_update_id + 1`
- Keep only one polling process per bot token.
- Avoid parallel pollers to prevent Telegram `409 Conflict`.

## Required environment variables

- `MAIL_AGENT_TELEGRAM_BOT_TOKEN`
- `MAIL_AGENT_TELEGRAM_CHAT_ID`
- `MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS` (comma-separated, optional but recommended)
- `MAIL_AGENT_TELEGRAM_PARSE_MODE` (`MarkdownV2` default)

## Bot setup checklist (BotFather)

1. Create bot via `/newbot` and store token securely.
2. Disable group use if not needed (`/setjoingroups` -> disable).
3. Keep privacy mode default unless group-wide processing is explicitly required.
4. Configure command list only if command handling is introduced.
5. Rotate token immediately if exposed (`/token` / revoke flow).

## Security requirements

- Treat bot token like a password. Never commit to git.
- Restrict processing to allowed user IDs/chat IDs.
- Validate all incoming text as untrusted input.
- Log denied/unknown users without processing payload.

## Messaging constraints and formatting

- Max text size: `4096` UTF-8 chars.
- If content exceeds limit, split into chunks.
- Default format: `MarkdownV2`.
- Escape required MarkdownV2 special characters before sending.

## Relevant Bot API limits

- Global send rate: about `30 msg/s` per bot.
- Per-chat limit: about `1 msg/s`.
- Group limit: about `20 msg/min`.
- On `429`, respect `retry_after` and retry with backoff.

## API methods needed in v0

- `getMe` (startup health check)
- `sendMessage` (core notification path)

Optional for later:

- `editMessageText`
- `deleteMessage`
- `setMessageReaction`
- `getUpdates` (if interactive mode is added)

## Chat ID acquisition

- Send a message to the bot from target account.
- Call `getUpdates` once.
- Read `chat.id` from the update payload.
- Store as `MAIL_AGENT_TELEGRAM_CHAT_ID`.

## Integration shape for `apps/mail-agent`

Define a notifier interface and keep Telegram behind an adapter.

- Interface example:
  - `sendNotification(input) -> { providerMessageId }`
- Adapter responsibilities:
  - Markdown escaping
  - chunking long text
  - retry/backoff for 429
  - mapping Telegram errors to domain errors

This keeps future channel changes or library swaps isolated.

## Manual verification checklist for this repo

1. Startup with valid token and chat ID.
2. Send test notification and verify delivery.
3. Send message >4096 chars and verify chunking behavior.
4. Trigger a controlled 429 retry scenario and verify backoff logging.
5. Verify only allowed user/chat IDs are processed (if inbound mode enabled).

## Out of scope for v0

- Telegram webhook deployment
- group moderation features
- premium/custom emoji reactions
- media/file transfer flows
- paid broadcasts
