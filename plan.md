# Plan

Done

- Read all README files and main rules.
- Added build to the Turbo CI pipeline and defined build scripts across workspaces.
- Kept build placeholders where needed and added tsc builds for script packages.
- Adjusted Prettier ignore handling for generated outputs and route tree files.
- Fixed dashboard data typing in box-storage to align with Prisma includes.
- Ran syncpack to align dependency versions across the monorepo.
- Added explicit types in financy-forecast tsconfig to avoid missing aria-query type errors.
- Removed an unused @ts-expect-error in rest-server.
- Ran `bun run ci` outside the sandbox successfully (lint warnings only).
- Added syncpack check task and wired it into Turbo CI.
- Ensured syncpack:check runs via packages/tools.
- Ran `bun run ci` outside the sandbox successfully with syncpack:check (lint warnings only).
- Adjusted turbo.json caching inputs/outputs per best practices (build outputs, test inputs, non-cacheable fix/format, Prisma outputs, syncpack inputs).
- Confirmed `.output/**` is required for TanStack Start/Nitro build outputs; kept in Turbo outputs.
- Added `globalEnv` entries in `turbo.json` for env vars used in code to keep Turbo caching correct and silence env-var warnings.
- Added root `eslint` devDependency to prevent `bunx` from pulling ESLint 10 and failing lint tasks.
- Ran `bun install` and `bun run ci` outside the sandbox; CI now passes with expected warnings only.
- Added per-package `turbo.json` overrides with `outputs: []` for build tasks that do not produce artifacts.
- Re-ran `bun run ci` outside the sandbox; build output warnings are gone (lint warnings remain as before).

Next

- Create the requested git commits once the git MCP server is available.
