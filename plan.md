# Plan

Done
- Read all README files and main rules.
- Added build to the Turbo CI pipeline and defined build scripts across workspaces.
- Kept build placeholders where needed and added tsc builds for script packages.
- Adjusted Prettier ignore handling for generated outputs and route tree files.
- Fixed dashboard data typing in box-storage to align with Prisma includes.
- Switched financy-forecast build to webpack to avoid Turbopack panics in CI.
- Ran syncpack to align dependency versions across the monorepo.

Next
- Rerun `bun run ci` in an environment with outbound network access for Google Fonts.
- Create the requested git commits once the git MCP server is available.
