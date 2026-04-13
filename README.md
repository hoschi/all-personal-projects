# All Personal Projects

This monorepo contains various personal projects including financial forecasting tools, REST servers, database utilities, and YouTube note automation scripts. I created this as a monorepo to bundle all the scripts and enhancements one needs in one place. Additionally, it serves as a centralized place to enhance my coding AI additions, saved in `ai-assistants/main-rules.md` for easy use across all projects/apps.

## Apps

- [financy-forecast](/apps/financy-forecast/README.md) - Financial forecasting dashboard with snapshot management
  - Forecast calculations and visualization
  - Scenario management
  - Settings and configuration
- [box-storage](/apps/box-storage/README.md) - Storage management system
  - TanStack Start web application
  - PostgreSQL database with Prisma ORM
  - Multi-level storage hierarchy (Floor → Room → Furniture → Box → Item)
  - In Motion status tracking for items
- [sst](/apps/sst/README.md) - Speech-to-Structured-Text workspace (v0)
  - Recording-first speech processing flow (Whisper + Ollama)
  - Conflict-safe tab syncing for title, top text, and bottom text
  - Model-run telemetry and debug diff tooling

## WIP

Work in progress that is already planned and can be picked up is stored in the `wip/` dir.

### SST v1

The in-progress planning and handover artifacts were moved from `current/` to `wip/sst-v1/`.
This work is not finished yet, but it is already planned and can be resumed immediately.

- Main plan: [`wip/sst-v1/plan.md`](/wip/sst-v1/plan.md)
- Frontend decomposition plan: [`wip/sst-v1/sst-react-componize-plan.md`](/wip/sst-v1/sst-react-componize-plan.md)
- Deferred PR comments: [`wip/sst-v1/pr-19-non-frontend-comments.md`](/wip/sst-v1/pr-19-non-frontend-comments.md)

Completed so far (short):

- `apps/sst` v0 scaffold and core architecture are implemented.
- Recording-first flow, conflict-safe tab sync, and compact UI refactor are implemented.
- `apps/sst-web` was removed and docs were aligned to the active `apps/sst` app.

Still open (short):

- Resolve remaining deferred PR comments.
- Decompose `apps/sst/src/routes/index.tsx` into feature modules.
- Implement persisted model-run logging and polling sync runtime.
- Final verification/documentation sweep.

### Tests

- [rest-server](/apps/rest-server/README.md) - Effet-based REST API server, combines services from package directory
- [switch-test](/apps/switch-test/README.md) - TanStack Start test: data loading logic and pending UI when editing the same entities in multiple places

## Packages

- [db](/packages/db/README.md) - Database utilities for PostgreSQL
  - Environment configuration
  - Data copying scripts (prod → staging → dev)
- [eslint-config](/packages/eslint-config/README.md) - Shared ESLint configurations
- [tools](/packages/tools/README.md) - Common tooling scripts for all workspaces
- [typescript-config](/packages/typescript-config/README.md) - Shared TypeScript configurations
- [yt-notes-scripts](/packages/yt-notes-scripts/README.md) - YouTube history and transcript import
  - Video details import
  - Transcript processing
  - Note links management

### Tests

- [video-service](/packages/video-service/README.md) - Testbed for service written with Effect

## Init from fresh clone

- run `bun run init-fresh-clone` to link workspace bins, fetch AI docs into `tmp/`, set up Husky hooks, and optionally run `bun install` (`-y` to auto-confirm). This does:
  - `bun run packages/tools/src/link-bins.ts` - Recreate workspace bin links (Bun workspace bin bug workaround).
  - `bun run packages/tools/src/fetch-ai-docs.ts` - Download Next.js and ts-pattern docs into `tmp/`.
  - `bun run prepare` (or fallback `bunx husky`) - Initialize Git hooks in `.husky/`.
- see `./packages/db/README.md`
- copy your `.env` files from one clone to another: `rsync -av --include='*.env' --include='*/' --exclude='*'  ~/repos/personal-one/ ~/repos/personal-two/`
- for local HTTPS/LAN testing (including FRITZ!Box hostname), see:
  - [`infra/README.md#machine-local-config-infraenv`](/infra/README.md#machine-local-config-infraenv)
  - [`infra/README.md#initial-setup`](/infra/README.md#initial-setup)
  - [`infra/README.md#how-to-test-the-setup`](/infra/README.md#how-to-test-the-setup)
- set up the git MCP server to match the [main-rules](/ai-assistants/main-rules.md) file, e.g. `.roo/mpc.json`:

```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "/Users/hoschi/repos/personal-one"
      ]
    }
  }
}
```

## Init new project

- `bun run initproject` - Initialize ESLint and TypeScript configuration

## Daily Work

- infra helpers at root:
  - `bun run infra:up`
  - `bun run infra:down`
- for day-to-day Caddy/HTTPS operations (start/restart and LAN routes), see:
  - [`infra/README.md#start-and-stop-caddy`](/infra/README.md#start-and-stop-caddy)
  - [`infra/README.md#run-apps-behind-https`](/infra/README.md#run-apps-behind-https)
  - [`infra/README.md#3-lanmobile-test-fritzbox-hostname`](/infra/README.md#3-lanmobile-test-fritzbox-hostname)

### main-rules Sync

- `ai-assistants/main-rules.md` is the single source of truth.
- A pre-commit hook syncs it to:
  - `.roo/rules/main-rules.md`
  - `.kilocode/rules/main-rules.md`
  - `AGENTS.md`
- The hook only runs the sync when `ai-assistants/main-rules.md` is staged and then stages the three target files automatically.
- Manual sync is possible with: `bun run packages/tools/src/sync-main-rules.ts` or `cd packages/tools && bun run sync-main-rules`.

### Push data from prod over staging to dev

See [packages/db/src/copy.ts](/packages/db/src/copy.ts) for the script that copies database data from production over staging to development. Run with: `cd packages/db && bun run copy`. See the [packages/db/README.md#data-copy-process](/packages/db/README.md#data-copy-process) for detailed information.

### QA

- `bun run lint` - Run ESLint on all projects
- `bun run check-types` - Run TypeScript type checking
- `bun run fix` - Runs eslint --fix and format task at once
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting without modifying files
- `bun run test` - Runs unit tests for all projects
- `bun run ci` - Runs lint, typecheck, format:check and test

## Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- Turbopack
  - [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
  - [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
  - [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
  - [Configuration Options](https://turborepo.com/docs/reference/configuration)
  - [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
