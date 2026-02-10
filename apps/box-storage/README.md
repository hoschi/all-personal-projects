# Box Storage

Box Storage is a TanStack Start-based web application for organizing household items with a strict layered architecture. The system maps hierarchical storage structures and manages the status of items ("In Motion").

**Key Features:**

- **Hierarchical Storage Management** - Organize items in a structured hierarchy: House → Floor → Room → Furniture → Box → Item
- **Inventory View** - Table-based view of all visible items with filtering and sorting capabilities
- **Hierarchical View** - Tree-based visualization of the storage structure
- **Dashboard** - Overview of personal items, other users' items, and recently modified items
- **In Motion Status** - Track which user currently has an item in use

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

| File                                                                         | Purpose                                                          |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`src/routes/__root.tsx`](src/routes/__root.tsx)                             | Root layout with authentication wrapper                          |
| [`src/routes/index.tsx`](src/routes/index.tsx)                               | Entry point → redirects to `/dashboard`                          |
| [`src/routes/(authed)/dashboard.tsx`](<src/routes/(authed)/dashboard.tsx>)   | Dashboard with personal items, others' items, and recent changes |
| [`src/routes/(authed)/table-view.tsx`](<src/routes/(authed)/table-view.tsx>) | Table view of all items with In Motion toggle                    |
| [`src/router.tsx`](src/router.tsx)                                           | Main router configuration                                        |

### Server Actions & Data Layer

| File                                         | Purpose                                                      |
| -------------------------------------------- | ------------------------------------------------------------ |
| [`src/data/actions.ts`](src/data/actions.ts) | Server Actions - orchestrates business logic and data access |
| [`src/data/prisma.ts`](src/data/prisma.ts)   | Prisma client instantiation with connection management       |
| [`src/data/schema.ts`](src/data/schema.ts)   | Zod schemas and TypeScript types for all data models         |

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

4. **Schema Definition (`schema.ts`):**
   - Central repository for TypeScript types and Zod validation schemas
   - Ensures type safety across all layers

---

## DB

### 1. Prisma Configuration

**File:** [`prisma.config.ts`](prisma.config.ts)

The application uses Prisma 7 architecture with PostgreSQL database. The datasource URL is configured in `prisma.config.ts` together with the schema name, both fetched from `.env` file, see `.env.example`.

### 2. Database Schema

**File:** [`prisma/schema.prisma`](prisma/schema.prisma)

The schema defines a comprehensive relational model for hierarchical storage:

- **User:** Core user entity with authentication credentials
- **Floor:** Top level in the house hierarchy
- **Room:** Belongs to Floor (1:n relationship)
- **Furniture:** Belongs to Room (1:n relationship)
- **Box:** Belongs to Furniture (1:n relationship) - lowest storage level
- **Item:** Can be located in Box, Furniture, or Room (exclusive relationship)
- **UserItemInteraction:** Tracks favorites and usage history (junction table)

**Key Relationships:**

- Items have exactly one location: `boxId`, `furnitureId`, or `roomId` (mutually exclusive)
- Items can be "In Motion" via `inMotionUserId` foreign key
- Items have visibility control via `isPrivate` flag and `ownerId`

### 3. Seed Script

**File:** [`scripts/seed-dev.ts`](scripts/seed-dev.ts)

**Purpose:** Populates the database with realistic sample data for development.

**Sample data:**

- **4 Users:** alice, bob, charlie, david (with hashed passwords)
- **2 Floors:** Erdgeschoss, 1. Stock
- **4 Rooms:** Küche, Wohnzimmer, Schlafzimmer, Büro
- **4 Furnitures:** Küchenschrank, Regal, Kommode, Schreibtisch
- **8 Boxes:** Various locations within furniture
- **25 Items:** Distributed across boxes (10), furniture (5), and rooms (10)
- **8 UserItemInteractions:** Favorites and last used timestamps

**Commands:**

```bash
# Clear and €eed database with sample data
bun run scripts/seed-dev.ts seed

# Clear all sample data
bun run scripts/seed-dev.ts clear
```

---

## Todo

- **Authentication:** Implement login via username/password with Clerk
- error handling for async functions in React components, e.g. `toggleInMotion` in table-view.tsx, [see comment](https://github.com/hoschi/all-personal-projects/pull/8#pullrequestreview-3772423363)
- replace if/else with ts-pattern, AI doesn't do this by itself so far, add rules for this
- **UI Enhancements:**
  - Move sidebar toggle from content header to sidebar header
  - Create icon sidebar in collapsed version
  - Add "screen too small" message for mobile devices
- **Testing:** Add unit tests for business logic functions

---

## Getting Started

### Prerequisites

- Bun package manager
- PostgreSQL 15+, see [db package](../../packages/db/README.md) how to create and env files

### Create .env file

- Copy [.env.example](./.env.example) to `.env` and fill out Clerk credentials
