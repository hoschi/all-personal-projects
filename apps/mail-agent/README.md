# Mail Agent (`apps/mail-agent`)

This workspace migrates the former n8n mail workflow into versioned monorepo code.

## Current Status

- Implemented: **Step 2** from `current/plan.md`
- The workspace now includes a Prisma PostgreSQL baseline for schema `mail`.

## Usable After Step 1

### Workspace commands

- `bun run --filter mail-agent start` runs the bootstrap flow once.
- `bun run --filter mail-agent dev` runs watch mode for fast iteration.
- `bun run --filter mail-agent check-types` validates TypeScript contracts.
- `bun run --filter mail-agent lint` validates code quality.
- `bun run --filter mail-agent test` runs the smoke test suite.

### Available runtime contracts

The codebase already exposes stable module boundaries for later implementation:

- `src/config`: bootstrap config contract
- `src/data`: processed-email store contract (in-memory placeholder)
- `src/gmail`: Gmail sync boundary (`poll`) placeholder
- `src/ai`: classifier decision contract placeholder
- `src/notify`: notifier interface and noop adapter
- `src/http`: HTTP runtime placeholder contract (not enabled in step 1)
- `src/pipeline`: canonical pipeline stage contract

## Usable After Step 2

### Prisma configuration baseline

- `prisma.config.ts` loads `.env.base` first and optional `.env` as override.
- `DATABASE_URL` is required.
- `DATABASE_SCHEMA_NAME` is required and must equal `mail`.
- Prisma datasource URL is built as `${DATABASE_URL}?schema=${DATABASE_SCHEMA_NAME}`.

### Database schema and migration state

- `prisma/schema.prisma` defines:
  - `processed_emails`
  - `agent_state`
- Initial migration is present in `prisma/migrations/`.
- Prisma client output is generated under `src/generated/prisma`.

### Prisma runtime access

- `src/data/prisma.ts` exposes a Prisma client with `@prisma/adapter-pg`.
- Adapter schema binding uses `DATABASE_SCHEMA_NAME` from `prisma.config.ts`.
- `src/data/prisma-smoke.ts` performs an insert/read smoke check for both tables.

## Prisma Flow (Step 2)

```mermaid
flowchart TD
  A[.env.base] --> C[prisma.config.ts]
  B[.env optional override] --> C
  C --> D[Prisma datasource URL with schema=mail]
  D --> E[prisma/schema.prisma]
  E --> F[prisma migrate dev]
  F --> G[prisma/migrations/*]
  E --> H[prisma generate]
  H --> I[src/generated/prisma]
  C --> J[src/data/prisma.ts]
  I --> J
  J --> K[src/data/prisma-smoke.ts]
  K --> L[insert/read validation]
```

### Bootstrap behavior

`start` currently executes an end-to-end placeholder pipeline:

1. Build bootstrap config
2. Build placeholder adapters (data, Gmail, AI, notify, HTTP state)
3. Execute one placeholder classification decision
4. Persist one placeholder processed-email record in-memory
5. Emit one placeholder notification payload
6. Print structured runtime state to stdout

## Runtime Flow (Step 1)

```mermaid
flowchart TD
  A[main()] --> B[createBootstrapConfig]
  A --> C[createInMemoryStore]
  A --> D[createGmailSyncPlaceholder]
  A --> E[createAiPipelinePlaceholder]
  A --> F[createNoopNotifier]
  A --> G[createHttpRuntimePlaceholder]
  A --> H[createPipelineStageDescriptors]

  E --> I[classify placeholder]
  I --> J[insert placeholder processed email]
  J --> K[sendNotification placeholder]
  K --> L[poll placeholder]
  L --> M[log startup payload]
```

## Logical Pipeline Contract (Step 1)

The canonical pipeline stages are already fixed in code and validated by test:

```mermaid
flowchart LR
  S1[loadCursor] --> S2[fetchChanges]
  S2 --> S3[normalizeMessages]
  S3 --> S4[classify]
  S4 --> S5[applyAction]
  S5 --> S6[notifyUser]
```

## Quick Start

From repository root:

```bash
bun run --filter mail-agent start
```

For watch mode:

```bash
bun run --filter mail-agent dev
```

## Database Setup (Step 2)

From repository root:

```bash
bun run --filter mail-agent prisma generate
bun run --filter mail-agent prisma migrate dev --name init
```

Run DB smoke test:

```bash
bun run --filter mail-agent db:smoke
```

## Step 1 Verification

Run from repository root:

```bash
bun run --filter mail-agent check-types
bun run --filter mail-agent lint
bun run --filter mail-agent test
```

### Expected outcomes

- `check-types`: no TypeScript errors
- `lint`: no ESLint errors
- `test`: one passing smoke test (`pipeline scaffold exposes all planned stages`)

## Step 2 Verification

Run from repository root:

```bash
bun run --filter mail-agent prisma generate
bun run --filter mail-agent prisma migrate dev --name init
bun run --filter mail-agent db:smoke
```

### Expected outcomes

- `prisma generate`: client generated at `src/generated/prisma`
- `prisma migrate dev`: migration directory exists and DB is in sync
- `db:smoke`: JSON output contains non-null `state` and `latestProcessedEmail`

### Common failure cases

- Running commands outside repository root
- Missing workspace dependencies in the monorepo install state
