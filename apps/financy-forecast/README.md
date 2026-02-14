# Financy Forecast

Financy Forecast is a Next.js-based personal finance tracking tool with a matrix
view for account balances, snapshot approval workflow, and scenario-based
forecasting.
[Currently Buggy!](./bug.md)

**Key Features:**

- **Financial Matrix Dashboard** - Snapshot history, current balances, and monthly deltas
- **Current Balance Edit Flow** - Side-by-side edit view vs. latest snapshot with live deltas
- **Snapshot Approval** - Persist current balances as monthly snapshots
- **Forecast Engine** - Scenario planning with timeline visualization
- **Settings** - Management of recurring items and fixed costs

**Tech Stack:**

- PostgreSQL database with raw SQL queries (no ORM)
- Next.js 16, React 19, Tailwind CSS 4, ShadCN UI

## Next.js v16 Features Used

- **App Router** - File-based routing in `app/` directory
- **Server Actions** - `'use server'` directive for form processing
- **Server Components** - Default for pages and async data loading
- **Cache Tags** - `updateTag` for read-your-own-writes cache invalidation
- **Suspense boundaries** - Used for uncached async data in route segments
- **Server-side redirects** - `redirect()` after successful mutations
- **Turbopack** - `next dev --turbopack` for faster development
- **React Compiler** - Babel plugin enabled in `next.config.ts`
- **`cacheComponents`** - Enabled for component caching

## File Overview

### Core App Files

| File                                                  | Purpose                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| [`app/layout.tsx`](app/layout.tsx)                    | Root layout with sidebar provider, Jotai provider, and font setup |
| [`app/page.tsx`](app/page.tsx)                        | Entry point, redirects to `/dashboard`                            |
| [`app/dashboard/page.tsx`](app/dashboard/page.tsx)    | Dashboard with financial matrix                                   |
| [`app/current/edit/page.tsx`](app/current/edit/page.tsx) | Current balances edit page (`Suspense` + async data load)      |
| [`app/forecast/page.tsx`](app/forecast/page.tsx)      | Forecast view with scenarios                                      |
| [`app/settings/page.tsx`](app/settings/page.tsx)      | Settings page for recurring and scenario items                    |
| [`app/global-error.tsx`](app/global-error.tsx)        | Global runtime error boundary                                     |

### Server Actions & Data Layer

| File                               | Purpose                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| [`lib/actions.ts`](lib/actions.ts) | Server Actions for forecast, snapshot approval, and saving current balances     |
| [`lib/data.ts`](lib/data.ts)       | Data shaping for Matrix, Forecast, and Current Edit views                       |
| [`lib/db.ts`](lib/db.ts)           | Raw SQL data access incl. transactional updates for account current balances     |
| [`lib/schemas.ts`](lib/schemas.ts) | Zod schemas for validation and DB-result parsing (`Account` includes `updatedAt`) |
| [`lib/types.ts`](lib/types.ts)     | Additional UI-facing TypeScript interfaces (incl. `CurrentEditData`)            |

### Domain Logic

| File                                                     | Purpose                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| [`domain/currentBalances.ts`](domain/currentBalances.ts) | Parsing localized numeric inputs and computing snapshot deltas     |
| [`domain/snapshots.ts`](domain/snapshots.ts)             | Snapshot date rules and total-balance calculation helpers          |
| [`domain/approveErrors.ts`](domain/approveErrors.ts)     | Domain errors for snapshot approval constraints                    |

### Components

| File                                                       | Purpose                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`components/matrix.tsx`](components/matrix.tsx)           | Financial matrix display, snapshot approval trigger, link to current edit |
| [`components/current-edit.tsx`](components/current-edit.tsx) | Form for editing current balances with live deltas and error feedback   |
| [`components/forecast.tsx`](components/forecast.tsx)       | Forecast form with timeline                                                |
| [`components/format.ts`](components/format.ts)             | Shared EUR and delta formatting helpers                                   |
| [`components/app-sidebar.tsx`](components/app-sidebar.tsx) | App navigation sidebar                                                     |

---

## Notes

- Styling is still intentionally secondary to functional correctness.
- The app now includes form-based current-balance editing and validation in the UI.

## DB

### 1. @repo/db Package

Script linked from @repo/db package to quickly copy/backup/restore the DB.

### 2. `scripts/create-tables.sql` - Database Schema

**Purpose:** SQL schema for all FinanceForecast application tables.

### 3. `scripts/create-tables.ts` - Table Creation Script

**Purpose:** TypeScript wrapper for table creation.

**Commands:**

```bash
# Create tables
bun run scripts/create-tables.ts create

# Reset database (drop + create)
bun run scripts/create-tables.ts reset

# Drop all tables
bun run scripts/create-tables.ts drop
```

### 4. `scripts/seed-dev.ts` - Development Data

**Purpose:** Realistic sample data for development and testing.

**Sample data:**

- **5 accounts:** liquid + retirement accounts with realistic balances
- **6 months data:** July-December 2024 with realistic balance progressions
- **15 recurring items:** Rent, salary, insurance, etc.
- **9 scenario items:** Vacation, purchases, etc. (active/inactive)
- **Settings:** Standard variable costs (1,200.00 EUR)
- **Snapshots:** `totalLiquidity` is calculated as the sum over all account balances

**Commands:**

```bash
# Seed database with sample data
bun run scripts/seed-dev.ts seed

# Clear all sample data
bun run scripts/seed-dev.ts clear
```

## Todo

- Replace enums in schemas.ts with what TS page suggests instead (objects with `as const`?!)
- Use server-only package to not leak DB connection details for security
- Styling
  - Move sidebar toggle from content header to sidebar header and create an icon sidebar in collapsed version. Create a "screen too small" message for anything below tablet size, this doesn't make sense!
  - isActive in sidebar isn't working at the moment
- Forward root to dashboard route
