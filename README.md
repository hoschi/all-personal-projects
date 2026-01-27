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

- run `bun run packages/tools/src/link-bins.ts` to link bins correctly, Bun has a bug and `bun install` doesn't always work
- see `./packages/db/README.md`
- copy your `.env` files from one clone to another: `rsync -av --include='*.env' --include='*/' --exclude='*'  ~/repos/personal-one/ ~/repos/personal-two/`
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
