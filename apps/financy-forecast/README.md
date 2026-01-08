# Financy Forecast

## Project Summary

Financy Forecast is a Next.js-based personal finance tracking tool focused on liquidity, burn-rate monitoring, and interactive runway simulation.

**Key Features:**

- **Financial Matrix Dashboard** - Overview of accounts and balances
- **Forecast Engine** - Scenario planning with timeline visualization
- **Settings** - Management of recurring items and fixed costs

**Tech Stack:**

- PostgreSQL database with raw SQL queries (no ORM)
- Next.js 16, React 19, Tailwind CSS 4, ShadCN UI

## Next.js v16 Features Used

- **App Router** - File-based routing in `app/` directory
- **Server Actions** - `'use server'` directive for form processing
- **Server Components** - Default for all pages
- **Server-side rendering** - Async data fetching
- **Server-side redirects** - `redirect()` function
- **Cache Tags & Revalidation** - `updateTag` for data refresh
- **Turbopack** - `next dev --turbopack` for faster development
- **React Compiler** - Babel plugin enabled in `next.config.ts`
- **`cacheComponents`** - Enabled for component caching
- **Full URL logging** - All fetches log complete URLs

## File Overview

### Core App Files

| File                                               | Purpose                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| [`app/layout.tsx`](app/layout.tsx)                 | Root layout with sidebar provider, Jotai provider, and font setup |
| [`app/page.tsx`](app/page.tsx)                     | Entry point → redirects to `/dashboard`                           |
| [`app/dashboard/page.tsx`](app/dashboard/page.tsx) | Dashboard with Financial Matrix                                   |
| [`app/forecast/page.tsx`](app/forecast/page.tsx)   | Forecast view with scenarios                                      |
| [`app/settings/page.tsx`](app/settings/page.tsx)   | Settings page for recurring and scenario items                    |

### Server Actions & Data Layer

| File                               | Purpose                                                  |
| ---------------------------------- | -------------------------------------------------------- |
| [`lib/actions.ts`](lib/actions.ts) | Server Actions - orchestrates logic and data access      |
| [`lib/data.ts`](lib/data.ts)       | Data processing logic (MatrixData, ForecastTimelineData) |
| [`lib/db.ts`](lib/db.ts)           | Data access layer (raw SQL queries)                      |
| [`lib/schemas.ts`](lib/schemas.ts) | Zod schemas for validation and data types                |
| [`lib/types.ts`](lib/types.ts)     | Additional TypeScript interfaces beyond schemas          |

### Components

| File                                                       | Purpose                     |
| ---------------------------------------------------------- | --------------------------- |
| [`components/matrix.tsx`](components/matrix.tsx)           | Financial Matrix display    |
| [`components/forecast.tsx`](components/forecast.tsx)       | Forecast form with timeline |
| [`components/app-sidebar.tsx`](components/app-sidebar.tsx) | App navigation sidebar      |

---

## Disclaimer

- Styling was only copied from AI-generated mockup and looks a bit wild in places, will stay like this for now, functional features are more important
- Forms are missing and will remain so for simple things since I can do them directly in the DB

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

- **5 accounts:** 3 liquid (Sparkasse, ING DiBa, PayPal) + 2 retirement (Comdirect, DAX ETF)
- **6 months data:** July-December 2024 with realistic balance progressions
- **15 Recurring Items:** Rent, salary, insurance, etc.
- **9 Scenario Items:** Vacation, purchases, etc. (active/inactive)
- **Settings:** Standard variable costs (1,200.00 €)

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
