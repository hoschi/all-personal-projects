# @repo/tools

Common tooling scripts for all workspaces.

## Scripts

- `bun run init` - Initialize ESLint and TypeScript in the current workspace.
- `bun run init-fresh-clone` - Link workspace bins, fetch AI docs into `tmp/`, and optionally run `bun install` (`-y`/`--yes` to skip the prompt).
- `bun run fetch-ai-docs` - Download Next.js and ts-pattern docs into `tmp/` (gitignored).
- `bun run sync-main-rules` - Sync `ai-assistants/main-rules.md` to `.roo/rules/main-rules.md` and `.kilocode/rules/main-rules.md`.
- `bun run lint` - Run ESLint in this package.
- `bun run fix` - Run ESLint with `--fix`, then format.
- `bun run check-types` - Run TypeScript type checking (`tsc --noEmit`).
- `bun run format` - Format with Prettier (uses root `.prettierignore`).
- `bun run format:check` - Check formatting with Prettier.
- `bun run syncpack:check` - List dependency mismatches from the repo root.
- `bun run syncpack:fix` - Fix dependency mismatches from the repo root.
- `bun run test` - Placeholder test script.
- `bun run build` - Placeholder build script.
- `bun run src/link-bins.ts` - Recreate workspace bin links (workaround for Bun workspace bin linking bug).

## Requirements

- ESLint config (`eslint.config.mjs`)
- TypeScript config (`tsconfig.json`)

Run `bun run init` to set up these files in a new workspace.

## main-rules Sync

- The file-sync logic lives in `src/sync-main-rules.ts`.
- This script only handles content synchronization, no Git operations.
- Git-specific orchestration (checking staged changes and `git add`) is handled in `.husky/pre-commit`.
