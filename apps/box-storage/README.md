# Box Storage

Box Storage is a TanStack Start-based web application for organizing household items with a strict layered architecture. The system maps hierarchical storage structures and manages the status of items ("In Motion").

**Key Features:**

- **Hierarchical Storage Management** - Organize items in a structured hierarchy: House → Floor → Room → Furniture → Box → Item
- **Inventory View** - Table-based view with URL-driven filters/sorting, debounced text filters, and server-side sorting
- **Hierarchical View** - Tree-based visualization of the storage structure
- **Dashboard** - Overview of personal items, other users' items, and recently modified items
- **In Motion Status** - Track which Clerk user currently has an item in use

**Tech Stack:**

- **Framework:** TanStack Start
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **UI/Styling:** Tailwind CSS, ShadCN UI
- **Validation:** Zod
- **Authentication:** Clerk
  - [Docs](https://clerk.com/docs/reference/tanstack-react-start/)

## TanStack Start Features Used

- **File-based routing** - Route configuration in `src/routes/` directory
- **Cliend mode (ssr:false)** - Default for all pages, only pages which profit from SSR enable this to ensure less problems
- **Loader functions** - Data fetching with `loader` property
- **Server Functions** - `createServerFn()` for server-side operations
- **Route invalidation** - `router.invalidate()` for data refresh

## File Overview

### Core App Files

| File                                                                         | Purpose                                                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`src/routes/__root.tsx`](src/routes/__root.tsx)                             | Root layout with authentication wrapper                                        |
| [`src/routes/index.tsx`](src/routes/index.tsx)                               | Entry point → redirects to `/dashboard`                                        |
| [`src/routes/(authed)/dashboard.tsx`](<src/routes/(authed)/dashboard.tsx>)   | Dashboard with personal items, others' items, and recent changes               |
| [`src/routes/(authed)/table-view.tsx`](<src/routes/(authed)/table-view.tsx>) | Inventory table with debounced filters, URL search state, and In Motion toggle |
| [`src/router.tsx`](src/router.tsx)                                           | Main router configuration                                                      |

### Server Actions & Data Layer

| File                                                           | Purpose                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`src/data/actions.ts`](src/data/actions.ts)                   | Server Actions - orchestrates business logic and data access            |
| [`src/data/inventory-query.ts`](src/data/inventory-query.ts)   | Shared inventory filter/sort constants and Zod schemas for UI + backend |
| [`src/data/list-items-utils.ts`](src/data/list-items-utils.ts) | Inventory helper logic (location display, status mapping, sorting)      |
| [`src/data/prisma.ts`](src/data/prisma.ts)                     | Prisma client instantiation with connection management                  |
| [`src/data/schema.ts`](src/data/schema.ts)                     | Zod schemas and TypeScript types for all data models                    |

### Components

| File                                                               | Purpose                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| [`src/components/Header.tsx`](src/components/Header.tsx)           | Application header with navigation                      |
| [`src/components/LoadingIndi.tsx`](src/components/LoadingIndi.tsx) | Loading indicator component                             |
| UI Components                                                      | ShadCN UI components (badge, card, switch, table, etc.) |

### Configuration

| File                                   | Purpose                                  |
| -------------------------------------- | ---------------------------------------- |
| [`prisma.config.ts`](prisma.config.ts) | Prisma configuration with datasource URL |
| [`vite.config.ts`](vite.config.ts)     | Vite configuration for TanStack Start    |

---

## Architecture Layers

The application follows a strict layered architecture with clear separation of responsibilities:

1. **Presentation Layer (UI):**
   - Server Components and Client Components in `src/routes/`
   - Use exclusively functions from `actions.ts` to load or change data
   - Never directly access the database

2. **Business Logic Layer (`actions.ts`):**
   - Contains all functions called by the UI
   - Serves as abstraction layer/controller
   - Implements core business logic like "In Motion" status management
   - Calls functions from the data access layer

3. **Data Access Layer (`prisma.ts`):**
   - Contains Prisma client instantiation
   - Provides database connection management
   - Only here is the database client imported and executed

4. **Shared Query Contracts & Helpers (`inventory-query.ts`, `list-items-utils.ts`, `schema.ts`):**
   - `inventory-query.ts` defines shared, typed filter/sort contracts for route search + server filters
   - `list-items-utils.ts` contains deterministic helper logic used by server actions
   - `schema.ts` remains the central repository for model-level types and Zod schemas

---

## DB

### 1. Prisma Configuration

**File:** [`prisma.config.ts`](prisma.config.ts)

The application uses Prisma 7 architecture with PostgreSQL database. The datasource URL is configured in `prisma.config.ts` together with the schema name, both fetched from `.env` file, see `.env.example`.

### 2. Database Schema

**File:** [`prisma/schema.prisma`](prisma/schema.prisma)

The schema defines a comprehensive relational model for hierarchical storage:

- **Floor:** Top level in the house hierarchy
- **Room:** Belongs to Floor (1:n relationship)
- **Furniture:** Belongs to Room (1:n relationship)
- **Box:** Belongs to Furniture (1:n relationship) - lowest storage level
- **Item:** Can be located in Box, Furniture, or Room (exclusive relationship)
- **UserItemInteraction:** Tracks favorites and usage history (junction table)

User data is managed by Clerk. The database stores Clerk user IDs (string) and usernames in `Item.ownerId`, `Item.ownerUsername`, `Item.inMotionUserId`, `Item.inMotionUsername`, `UserItemInteraction.userId`, and `UserItemInteraction.userUsername`.

**Key Relationships:**

- Items have exactly one location: `boxId`, `furnitureId`, or `roomId` (mutually exclusive)
- Items can be "In Motion" via `inMotionUserId` (Clerk user ID) and `inMotionUsername`
- Items have visibility control via `isPrivate` flag and `ownerId`

### 3. Seed Script

**File:** [`scripts/seed-dev.ts`](scripts/seed-dev.ts)

**Purpose:** Populates the database with realistic sample data for development.

**Sample data:**

- **4 Clerk User IDs:** alice, bob, charlie, david
- **2 Floors:** Erdgeschoss, 1. Stock
- **4 Rooms:** Küche, Wohnzimmer, Schlafzimmer, Büro
- **4 Furnitures:** Küchenschrank, Regal, Kommode, Schreibtisch
- **8 Boxes:** Various locations within furniture
- **25 Items:** Distributed across boxes (10), furniture (5), and rooms (10)
- **8 UserItemInteractions:** Favorites and last used timestamps

**Commands:**

```bash
# Clear and seed database with sample data
bun run scripts/seed-dev.ts seed

# Clear all sample data
bun run scripts/seed-dev.ts clear
```

---

## Todo

- error handling for async functions in React components, e.g. `toggleInMotion` in table-view.tsx, [see comment](https://github.com/hoschi/all-personal-projects/pull/8#pullrequestreview-3772423363)
- **UI Enhancements:**
  - Move sidebar toggle from content header to sidebar header
  - Create icon sidebar in collapsed version
  - Add "screen too small" message for mobile devices
- **Testing:** Add integration tests for inventory filters/toggles across route + server action boundaries

---

## Getting Started

### Prerequisites

- Bun package manager
- PostgreSQL 15+, see [db package](../../packages/db/README.md) how to create and env files

### Create .env file

- Copy [.env.example](./.env.example) to `.env` and fill out Clerk credentials

## Known Bugs

### Clerk with client-side rendering

The currently used Clerk version sometimes throws the following browser error: `Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead.` The error disappears if you remove `ssr:false` from the route. I think this happens because the Clerk `<->` TanStack integration is still in beta. Links on this topic were not helpful:

- [Seit ich Clerk zu meiner Tanstack Start Applikation hinzugefügt habe, bekomme...](https://www.perplexity.ai/search/seit-ich-clerk-zu-meiner-tanst-LRONryPqRjCkkNrTpFzU0w)
- [TanStack Router with Clerk · TanStack/router · Discussion #1119](https://github.com/TanStack/router/discussions/1119)
- [Clerk integration broken on >= 1.70.2: useRouter must be used inside a <RouterProvider> component · Issue #2594 · TanStack/router](https://github.com/TanStack/router/issues/2594)
- [Some server-side modules incorrectly bundled into the client? · Issue #5738 · TanStack/router](https://github.com/TanStack/router/issues/5738)
- [@tanstack/react-start v1.134.7 causes import error with use-sync-external-store · Issue #5717 · TanStack/router](https://github.com/TanStack/router/issues/5717)
- [clerk-tanstack-react-start-quickstart/src/routes/\\\_\\\_root.tsx at main · clerk/clerk-tanstack-react-start-quickstart](https://github.com/clerk/clerk-tanstack-react-start-quickstart/blob/main/src/routes/__root.tsx)

In this repository, I changed the config so it matches the one used here, and the bug does not occur there. However, I copied how Clerk and Start are connected from that repo.
