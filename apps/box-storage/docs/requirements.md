## 1. Management Summary

Development of a web application for organizing household items based on a strict **Layered Architecture** in TanStack Start. The system maps hierarchical storage structures and manages the status of items ("In Motion"). Special focus is on clean separation of UI, business logic, and database access, as well as the use of URL parameters for state management.

## 2. Technical Architecture & Conventions

### 2.1 Tech Stack

- **Framework:** TanStack Start
- **Language:** TypeScript.
- **Database:** Strapi (JS objects as fake until then)
- **UI/Styling:** Tailwind CSS, Shadcn UI.
- **Authentication:** TODO
- **Validation:** Zod.

### 2.2 Architecture Layers & Data Flow

Strict separation of responsibilities applies. UI components may **never** directly access the database.

1.  **Presentation Layer (UI):**
    - Server Components and Client Components.
    - Use exclusively functions from `actions.ts` (Server Actions) to load or change data.
2.  **Business Logic Layer (`actions.ts`):**
    - Contains all functions called by the UI.
    - Serves as abstraction layer / controller.
    - Calls functions from `data.ts`.
3.  **Data Access Layer (`data.ts`):**
    - Contains the low-level functions that instantiate and use Strapi client.
    - Only here is the Strapi client imported and executed.
4.  **Schema Definition (`schema.ts`):**
    - Central repository for TypeScript types and Zod validation schemas.

## 3. Database Schema (Concrete Modeling)

The modeling follows relational best practices according to the architectural decisions made:

### 3.1 Users

- **Table `User`:**
  - Fields: ID, Username.
  - **Security:** The password must not be stored in plain text. A field for the password hash must exist.

### 3.2 Storage Hierarchy (Explicit Tables)

**No** Single-Table-Inheritance Pattern is used. The levels must be modeled as separate tables to ensure type safety and clear relations:

- **Table `Floor` (Floor):** Top level in the house.
- **Table `Room` (Room):** Belongs to `Floor` (1:n).
- **Table `Furniture` (Furniture):** Belongs to `Room` (1:n). Represents shelves or cabinets.
- **Table `Box` (Box/Compartment):** Belongs to `Furniture` (1:n). Represents the lowest storage level.

### 3.3 Items & Storage

- **Table `Item`:**
  - Basic data: Name, Description, `lastModifiedAt`.
  - **Visibility:** Field `isPrivate` (Boolean) and relation `ownerId` (User). If `isPrivate` is set, only the owner may see the item.
  - **Storage Location (Exclusivity):** An item can be in three different locations. This must be represented via three nullable foreign keys:
    1.  `boxId` (in box)
    2.  `furnitureId` (directly in furniture)
    3.  `roomId` (directly in room)
  - _Rule:_ An item may not be directly assigned to a floor or the house.
  - **Status "In Motion":** Relation `inMotionUserId` (Nullable Foreign Key to `User`). Indicates who has the item right now.

### 3.4 Personalization (Relation Table)

Since favorites and history ("Recently used") are user-dependent, these may **not** be stored in the `Item` table.

- **Table `UserItemInteraction`:**
  - Link table between `User` and `Item` (Composite Primary Key from UserID + ItemID).
  - Fields: `isFavorite` (Boolean), `lastUsedAt` (Timestamp).

## 4. Functional Requirements & UI

### 4.1 Authentication

- Login via username/password.
- Protection of all routes (except login).

### 4.2 Inventory View (Table)

- Table of all visible items.
- **Filter/Sort:** Text search and sorting (Name, Location, Status) must be represented via paramis in the URL
- **Action:** Switch for "In Motion".

### 4.3 Hierarchical View (Tree)

- Visual representation: House -> Floor -> Room -> Furniture -> Box -> Item.
- Sorting: Fixed (Status first, then Name).
- Action: Switch for "In Motion".

### 4.4 Dashboard

- Display of personal items ("Mine"), other users' items ("Others"), and recently modified items.
- The data query must occur via corresponding functions in `actions.ts` -> `data.ts`.

### 4.5 Business Logic "In Motion"

- **Switch Logic:**
  - _Item is free:_ Current user is entered.
  - _Item belongs to current user:_ Status is reset (NULL).
  - _Item belongs to another user:_ Status is reset (NULL). No direct "stealing" allowed.
