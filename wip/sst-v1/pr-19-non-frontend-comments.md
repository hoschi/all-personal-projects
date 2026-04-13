# PR #19 non-frontend review comments (deferred)

This file tracks thumbs-up review comments that are outside the SST frontend route/component scope and are intentionally deferred for a separate implementation pass.

## Infra / monorepo related

| Comment ID | Path | Line | Title | User |
| --- | --- | ---: | --- | --- |
| 3040414428 | `infra/README.md` | 266 | Fix the troubleshooting port example. | `coderabbitai[bot]` (`Bot`) |
| 3040414431 | `infra/setup-trust.sh` | 17 | Replace fixed delay with readiness check before CA export. | `coderabbitai[bot]` (`Bot`) |
| 3040414435 | `package.json` | 18 | Harden `update-prod` for safer, reproducible updates. | `coderabbitai[bot]` (`Bot`) |

## Additional non-frontend (SST backend/config/docs)

| Comment ID | Path | Line | Title | User |
| --- | --- | ---: | --- | --- |
| 3040414396 | `apps/sst/src/contracts/tab-sync.ts` | 99 | Consider clarifying the naming for overwrite schemas. | `coderabbitai[bot]` (`Bot`) |
| 3040414397 | `apps/sst/src/contracts/tab-sync.ts` | 148 | Inconsistent nullability for `lastPushedAt` between schemas. | `coderabbitai[bot]` (`Bot`) |
| 3040414401 | `apps/sst/src/contracts/text-improvement-env.ts` | 6 | (body starts with details block in review export) | `coderabbitai[bot]` (`Bot`) |
| 3040414409 | `apps/sst/src/data/tab-sync-actions.ts` | 398 | Delete needs a freshness precondition too. | `coderabbitai[bot]` (`Bot`) |
| 3040414411 | `apps/sst/src/data/text-improvement-actions.ts` | 32 | Validate required env once at module load, not per request. | `coderabbitai[bot]` (`Bot`) |
| 3040414413 | `apps/sst/src/data/text-improvement-actions.ts` | 91 | Add explicit timeouts to both upstream `fetch` calls. | `coderabbitai[bot]` (`Bot`) |
| 3067809488 | `apps/sst/README.md` | 14 | Status of model-run persistence is inconsistent. | `coderabbitai[bot]` (`Bot`) |
| 3067809489 | `apps/sst/README.md` | 31 | Bottom-text autosave throttle documentation is inconsistent. | `coderabbitai[bot]` (`Bot`) |
| 3040414372 | `apps/sst/.env.example` | 3 | Provide concrete sample values to reduce setup mistakes. | `coderabbitai[bot]` (`Bot`) |
| 3040414388 | `apps/sst/prisma.config.ts` | 5 | Resolve dotenv paths from file location, not current working directory. | `coderabbitai[bot]` (`Bot`) |
| 3040414391 | `apps/sst/prisma.config.ts` | 25 | Avoid manual query-string concatenation for `DATABASE_URL`. | `coderabbitai[bot]` (`Bot`) |
| 3040414407 | `apps/sst/src/data/prisma.ts` | 11 | (body starts with details block in review export) | `coderabbitai[bot]` (`Bot`) |
| 3052686338 | `apps/sst/package.json` | 35 | Move `prisma` CLI to `devDependencies`. | `coderabbitai[bot]` (`Bot`) |
