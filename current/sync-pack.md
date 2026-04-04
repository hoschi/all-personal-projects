# Syncpack Migration Report (Latest Version)

Date: 2026-04-04

## Goal

Use the latest Syncpack version instead of the legacy v13 command set, but keep CI stable.

## What Failed Initially

When running latest Syncpack (`14.3.0`) with the old workflow, there were three concrete incompatibilities:

1. CLI command changes:
   - Old commands `list-mismatches` and `fix-mismatches` are v13-style.
   - v14 uses `lint` and `fix`.

2. Deprecated config key:
   - `.syncpackrc.json` had:
     - `"dependencyTypes": ["!local"]`
   - v14 rejects this and expects `--dependency-types ...` via CLI flags.

3. Unwanted package discovery / strictness side effects:
   - v14 lint picked up generated files like `apps/box-storage/.output/server/package.json`.
   - It also flagged `nitro: "latest"` under the default semver-mismatch strategy.

## Changes Applied

1. Installed latest Syncpack in `@repo/tools`:
   - `packages/tools/package.json` now includes:
     - `"syncpack": "^14.3.0"` in `devDependencies`.

2. Migrated scripts to latest Syncpack commands:
   - `syncpack:check` now uses `syncpack lint`.
   - `syncpack:fix` now uses `syncpack fix`.

3. Moved filtering logic to CLI flags (v14-compatible):
   - `--dependency-types prod,dev,peer,overrides,pnpmOverrides,resolutions`
   - `--specifier-types exact,major,minor,range,range-complex,range-major,range-minor,workspace-protocol`

4. Restricted sources to real workspace package manifests and excluded generated output:
   - `--source 'package.json'`
   - `--source 'apps/*/package.json'`
   - `--source 'packages/*/package.json'`
   - `--source '!apps/**/.output/**/package.json'`

5. Removed deprecated config usage:
   - `.syncpackrc.json` changed to `{}`.

## Validation

The following checks passed after migration:

1. `bun run syncpack:check` (from `packages/tools`) -> `✓ No issues found`
2. `bun run syncpack:fix` (from `packages/tools`) -> `✓ No issues found`
3. Monorepo quality gate:
   - `bun run ci` (repo root) -> success

## Result

Latest Syncpack is now in active use and CI-compatible.
No rollback to v13 is required.
