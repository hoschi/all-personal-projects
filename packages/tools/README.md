# @repo/tools

Common tooling scripts for all workspaces.

## Usage

```bash
# Run from any workspace
bun run init        # Initialize ESLint and TypeScript
bun run lint        # Run ESLint
bun run fix         # Run ESLint with --fix
bun run check-types # Run TypeScript type check
bun run test        # Run tests
bun run format      # Format with Prettier
bun run format:check # Check formatting
```

## Requirements

- ESLint config (`eslint.config.mjs`)
- TypeScript config (`tsconfig.json`)

Run `bun run init` to set up these files in a new workspace.
