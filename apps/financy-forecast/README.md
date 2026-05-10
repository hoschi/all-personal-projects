# Financy Forecast (TanStack Start)

Financy Forecast is a TanStack Start based personal finance tool with a matrix
view for account balances, snapshot approval workflow, and scenario-driven
forecasting.

## Key Features

- **Financial Matrix Dashboard**: Snapshot history, current balances, and deltas.
- **Current Balance Edit Flow**: Side-by-side view against latest snapshot with
  live parsed deltas and validation feedback.
- **Snapshot Approval**: Persist current balances as a monthly asset snapshot.
- **Forecast Engine**: Timeline projection with variable costs and
  scenario toggles.
- **Settings**: Manage scenario activation state with immediate server updates.

## Tech Stack

- **Runtime/App**: TanStack Start, TanStack Router, React 19, Vite 7, Nitro.
- **Data Layer**: PostgreSQL via `postgres` (raw SQL, no ORM).
- **Validation**: Zod schemas at server boundaries.
- **State/FP**: Jotai and Effect.
- **UI**: Tailwind CSS 4 + shadcn/ui primitives.

## Routes and Workflows

- `/dashboard`: Matrix view + snapshot approval trigger.
- `/current/edit`: Current balance form with parsing and save flow.
- `/forecast`: Forecast timeline with variable costs and scenario impact.
- `/settings`: Scenario list with active-state toggles.
- `/`: Redirects to `/dashboard`.

## Architecture Overview

### Routing

- `src/routes/__root.tsx`: App shell, sidebar layout, document setup.
- `src/routes/*.tsx`: Route-level loaders, pending states, and error components.

### Server Layer

- `src/server/actions.ts`: TanStack server functions for read/write operations.
- `src/server/data.ts`: Data shaping for route payloads.
- `src/server/db.ts`: SQL access, transaction logic, and schema-aware execution.
- `src/server/schemas.ts`: Input/output contracts and parsing.
- `src/server/env.ts`: Server environment validation.

### Domain and UI

- `src/domain/currentBalances.ts`: Numeric parsing + delta calculations.
- `src/domain/snapshots.ts`: Snapshot rules and date calculations.
- `src/components/Matrix.tsx`: Matrix table and snapshot approval UX.
- `src/components/CurrentEdit.tsx`: Current-balance editor UX.
- `src/components/Forecast.tsx` + `src/components/forecastState.tsx`:
  Forecast interactions and timeline rendering.
- `src/components/SettingsScenariosTable.tsx`: Settings table and toggle flow.

## Scripts

- `bun run dev`: Start dev server on port `3056`.
- `bun run build`: Create production build.
- `bun run start:prod`: Start Nitro server on port `4056`.
- `bun run preview`: Preview the production build locally.
- `bun run check-types`: Run TypeScript checks.
- `bun run lint`: Run ESLint.
- `bun run test`: Run Vitest test suite.
- `bun run format:check`: Check Prettier formatting.

## Environment

- Copy `.env.example` to `.env` and provide values.
- `DATABASE_URL` must be a valid URL and must not include a Prisma-style
  `schema=` query parameter.
- Schema selection is handled in SQL via `SET search_path`.
