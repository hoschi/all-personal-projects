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

Next

- Create the requested git commits once the git MCP server is available.
