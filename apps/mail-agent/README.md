# Mail Agent (`apps/mail-agent`)

Mail Agent is the production replacement for the previous n8n mail workflow.
It polls Gmail, classifies messages, applies keep/delete label actions, sends Telegram notifications, and exposes a reusable signed undo URL.

## Setup

### Prerequisites

- Bun
- PostgreSQL
- Google Cloud project for Gmail API + OAuth
- OpenAI API key and model access
- Telegram bot token and chat ID

### 1) Create local env file

From repository root:

```bash
cp apps/mail-agent/.env.example apps/mail-agent/.env
```

### 2) Configure environment

Required variables:

- `DATABASE_URL`
- `DATABASE_SCHEMA_NAME` (`mail`)
- `MAIL_AGENT_OPENAI_API_KEY`
- `MAIL_AGENT_OPENAI_MODEL`
- `MAIL_AGENT_AI_RULES_DELETE`
- `MAIL_AGENT_AI_RULES_KEEP`
- `MAIL_AGENT_AI_RULES_SUMMARY`
- `MAIL_AGENT_HTTP_HOST`
- `MAIL_AGENT_HTTP_PORT`
- `MAIL_AGENT_GMAIL_CLIENT_ID`
- `MAIL_AGENT_GMAIL_CLIENT_SECRET`
- `MAIL_AGENT_GMAIL_REFRESH_TOKEN`
- `MAIL_AGENT_GMAIL_FILTER_QUERY`
- `MAIL_AGENT_POLL_INTERVAL_MS`
- `MAIL_AGENT_LABEL_AI_LABEL_PREFIX`
- `MAIL_AGENT_LABEL_KEEP`
- `MAIL_AGENT_LABEL_DELETE`
- `MAIL_AGENT_LABEL_HIDDEN`
- `MAIL_AGENT_UNDO_TOKEN_SECRET`
- `MAIL_AGENT_TELEGRAM_BOT_TOKEN`
- `MAIL_AGENT_TELEGRAM_CHAT_ID`

Optional variables:

- `MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS`

Notes:

- `MAIL_AGENT_GMAIL_FILTER_QUERY` has a default in `.env.base` and can be overridden in `.env`.
- The query is used for full-sync candidate listing (first run and invalid-history fallback).
- AI prompt rule env vars (`MAIL_AGENT_AI_RULES_DELETE`, `MAIL_AGENT_AI_RULES_KEEP`, `MAIL_AGENT_AI_RULES_SUMMARY`) accept `||`-separated bullet entries and are rendered into the system prompt under their respective headings.
- `MAIL_AGENT_HTTP_HOST` + `MAIL_AGENT_HTTP_PORT` define both:
  - the Bun bind target
  - the generated undo link base URL (`http://<MAIL_AGENT_HTTP_HOST>:<MAIL_AGENT_HTTP_PORT>`)
- `MAIL_AGENT_HTTP_HOST` must be an IPv4 address and cannot be `0.0.0.0`.
- For Telegram undo links from other devices, use your LAN IPv4 (for example `192.168.178.91`).
- Managed labels are composed as:
  - `${MAIL_AGENT_LABEL_AI_LABEL_PREFIX}/${MAIL_AGENT_LABEL_KEEP}`
  - `${MAIL_AGENT_LABEL_AI_LABEL_PREFIX}/${MAIL_AGENT_LABEL_DELETE}`
  - `${MAIL_AGENT_LABEL_AI_LABEL_PREFIX}/${MAIL_AGENT_LABEL_HIDDEN}`

Generate undo secret once:

```bash
openssl rand -hex 32
```

### 3) Apply database migrations

From repository root:

```bash
bun run --filter mail-agent prisma migrate deploy
```

Optional during local development:

```bash
bun run --filter mail-agent prisma generate
```

### 4) Start runtime

From repository root:

```bash
bun run --filter mail-agent start
```

Watch mode:

```bash
bun run --filter mail-agent dev
```

## Gmail OAuth Workflow

### GCP setup — detailed guide

#### 1. Create a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top-left header.
3. Click **"New Project"**.
4. Enter a project name (for example, "Gmail Local Reader").
5. Organization can stay empty for private usage.
6. Click **"Create"** and switch to the new project.

#### 2. Enable Gmail API

1. Open **APIs & Services -> Library** or [API Library](https://console.cloud.google.com/apis/library).
2. Search for **"Gmail API"**.
3. Select **"Gmail API"** from results.
4. Click **"Enable"**.

#### 3. Configure OAuth consent screen

1. Open **Google Auth Platform -> Branding** or [OAuth Consent Screen](https://console.cloud.google.com/auth/branding).
   - If not configured yet, click **"Get Started"**.

2. **App information**:
   - **App name**: for example, "Gmail Local Reader". Google validates this and it should look like a real app name. See [naming examples](https://support.google.com/cloud/answer/15549049?visit_id=639117854563019737-2224445486&rd=1#app-name&zippy=%2Capp-name).
   - **User support email**: select your email.

3. **Audience**:
   - **User type**: **"External"** (required for `@gmail.com` accounts).

4. **Contact information**:
   - Add your developer notification email.

5. **Finish**:
   - Accept the Google API Services User Data Policy.
   - Click **"Create"**.

##### Add scopes

1. Open **Google Auth Platform -> Data Access**.
2. Click **"Add or Remove Scopes"**.
3. Add these scopes:
   - `https://www.googleapis.com/auth/gmail.modify` (restricted)
   - `https://www.googleapis.com/auth/gmail.labels` (non-sensitive)
4. Click **"Update"** and **"Save"**.

> [!info] `gmail.modify` is classified as **restricted**. For personal-use apps (up to 100 users), the personal-use exception applies and CASA verification is not required. `gmail.labels` is non-sensitive.

##### Add test users

1. Open **Google Auth Platform -> Audience**.
2. In **"Test users"**, click **"Add users"**.
3. Add your Gmail address (the mailbox you want to read).
4. Save.

> [!warning] In testing mode, only configured test users can complete the consent flow.

##### Set publishing status to production

1. Open **Google Auth Platform -> Audience**.
2. Find **"Publishing status"** and click **"Publish App"**.
3. Confirm.

> [!warning] Critical: in testing mode, refresh tokens can expire after about 7 days. After switching to production, create new OAuth credentials and complete consent again; old testing-mode refresh tokens keep their original expiration behavior.

4. You can ignore the review submission message for this personal-use setup.

#### 4. Create OAuth client credentials

1. Open **Google Auth Platform -> Clients** or [Credentials Page](https://console.cloud.google.com/auth/clients).
2. Click **"+ Create Client"**.
3. Choose **"Desktop app"** as application type.
4. Enter a name (for example, "Gmail Local Reader Desktop" or `app-mail`).
5. Click **"Create"**.
6. Copy or download credentials immediately:
   - download the JSON credentials file
   - client secret is fully visible only at creation time
7. Store values in `MAIL_AGENT_GMAIL_CLIENT_ID` and `MAIL_AGENT_GMAIL_CLIENT_SECRET`.

> [!tip] Why use a desktop app instead of web application?
> For desktop app clients, you do not need to manually configure redirect URIs. Google automatically allows loopback addresses (`http://127.0.0.1`, `http://[::1]`, `http://localhost`) on any port. With web application clients, localhost redirect URIs must be configured manually.

### 5) Generate one refresh token

Run one OAuth consent flow and store the returned refresh token.

From repository root:

```bash
bun run --filter mail-agent gmail:auth
```

Behavior of this CLI:

- starts a local callback server on `http://127.0.0.1:3000`
- prints the OAuth consent URL in terminal
- opens the URL automatically on macOS
- prints `MAIL_AGENT_GMAIL_REFRESH_TOKEN="..."` after successful consent

### 6) Store Gmail credentials in `.env`

Add these values to `apps/mail-agent/.env`:

```env
MAIL_AGENT_GMAIL_CLIENT_ID="..."
MAIL_AGENT_GMAIL_CLIENT_SECRET="..."
MAIL_AGENT_GMAIL_REFRESH_TOKEN="..."
```

Then complete the rest of required Mail Agent variables from the Setup section above.

## Telegram Bot Workflow

### 1) Create bot with BotFather

1. Open Telegram and start a chat with `@BotFather`.
2. Run `/newbot` and follow the prompts, e.g. name it EmailAgent and EmailAgentBot
3. Copy the generated bot token.

Store token in:

- `MAIL_AGENT_TELEGRAM_BOT_TOKEN`

### 2) Get target chat ID

1. Search for `EmailAgentBot` in Telegram and click on it to start the bot. This sends `start`. Send another message.
2. Fetch updates with your bot token:

```text
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

3. Read `message.chat.id` from the response JSON.

Store chat ID in:

- `MAIL_AGENT_TELEGRAM_CHAT_ID`

### 3) Optional: restrict undo interactions

- `MAIL_AGENT_TELEGRAM_ALLOWED_USER_IDS` accepts a comma-separated list of allowed Telegram user IDs.
- If set, only listed users are accepted for notifier interaction rules.

## Daily Work

From repository root:

- Start once: `bun run --filter mail-agent start`
- Watch mode: `bun run --filter mail-agent dev`
- Typecheck: `bun run --filter mail-agent check-types`
- Lint: `bun run --filter mail-agent lint`
- Test: `bun run --filter mail-agent test`
- Format: `bun run --filter mail-agent format`
- Format check: `bun run --filter mail-agent format:check`

Debug run:

```bash
DEBUG=app:* bun run --filter mail-agent start
```

Useful scopes:

- `DEBUG=app:action:*`
- `DEBUG=app:db:*`

## Logic Overview (without reading code)

### End-to-end pipeline

1. Load and validate runtime configuration (fail fast on missing required env values).
2. Poll Gmail using stored history cursor.
3. Fall back to full sync when no cursor exists or cursor is invalid.
4. Normalize candidate message and thread data (sorted by internal date).
5. Process all normalized messages sequentially in one run.
6. Skip already processed messages (`gmail_message_id` idempotency check).
7. Classify with private bypass or OpenAI model.
8. Apply Gmail labels according to decision (`keep` or `delete`).
9. Persist classification and action result in `processed_emails`.
10. Create signed undo URL and send Telegram notification.

### Gmail sync behavior

- `agent_state.gmail_history_id` stores the last known mailbox cursor.
- Incremental mode uses `users.history.list(startHistoryId=...)` with pagination until all pages are consumed.
- Full sync mode uses `users.messages.list` with `MAIL_AGENT_GMAIL_FILTER_QUERY` in small pages (`maxResults=5`), one page per poll cycle.
- Each full-sync page is processed immediately before the next page is requested.
- Message detail normalization is fetched in batches to avoid large one-shot requests.
- After full-sync backlog is drained (no candidates left), the latest valid cursor is persisted.

### Classification behavior

- Private messages are routed to `private_bypass` and kept.
- Non-private messages are sent to OpenAI using `MAIL_AGENT_OPENAI_MODEL`.
- Model JSON is treated as untrusted input and validated with Zod.
- Expected output contract: `deleteIt`, `summary`, `subject`, `reason`.

### Action behavior

- `delete` action: add delete label, remove `INBOX`, keep label, hidden label.
- `keep` action: add keep label, remove delete label, hidden label.
- Label names are composed from `MAIL_AGENT_LABEL_AI_LABEL_PREFIX` + suffix vars.

### Undo behavior

- Undo URL: `GET /mail-agent/undo?token=...`
- Token contains `gmailMessageId` and HMAC signature.
- Same URL is reusable and toggles state:
  - apply undo when `user_action` is `null`
  - re-apply original action when `user_action` is already `undo_*`
- `processed_emails.user_action` is the toggle state source of truth.

### Telegram notification behavior

- Initial notification is sent once per processed message.
- Message headline includes action status, subject, and AI reason in parentheses.
- Undo status updates edit the existing Telegram message (`editMessageText`).
- Mapping (`provider`, `providerMessageId`, `subject`, `reason`, `summary`, `undoUrl`) is persisted in `processed_emails`.
- After restart, mapping is loaded from DB so the same message can still be updated.
- If mapping is missing, undo still succeeds and notifier logs a debug skip.

## Operational Checks

### Verify undo toggle

Call the same undo URL repeatedly:

- 1st call: `Undo applied.`
- 2nd call: `Undo reverted to original action.`
- 3rd call: `Undo applied.`

### Verify restart-safe Telegram status updates

1. Process a message and send Telegram notification.
2. Restart the service.
3. Open the same undo URL again.
4. Confirm the original Telegram message is edited (no second status message).

### Verify cursor fallback

Set an outdated `gmail_history_id`, then run `start` again.

Expected behavior:

- runtime switches to full sync
- a fresh valid cursor is persisted

## Key Files

- `src/index.ts` - runtime bootstrap and orchestration
- `src/config/index.ts` - strict env parsing and typed config
- `src/gmail/index.ts` - Gmail polling, normalization, and label actions
- `src/ai/index.ts` - private bypass and OpenAI classification
- `src/notify/index.ts` - Telegram notifier and status update logic
- `src/http/index.ts` - undo HTTP runtime
- `src/http/undo-service.ts` - undo business logic
- `src/http/undo-token.ts` - signed token create/verify
- `src/data/index.ts` - persistence adapter and notification mapping storage
- `prisma/schema.prisma` - database schema
