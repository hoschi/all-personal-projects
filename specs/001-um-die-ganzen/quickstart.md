# Quickstart: Pragmatic TypeScript Boilerplate

**Purpose**: This guide provides developers with the essential steps to set up the monorepo, run the demo application, and understand the core workflows.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Node.js](https://nodejs.org/) (LTS version, for `corepack`)
- A running PostgreSQL instance

## 1. First-Time Setup

### a. Clone and Install

```bash
# Clone the public monorepo
git clone [repository-url] public-monorepo
cd public-monorepo

# Install dependencies using Bun
bun install
```

### b. Environment Configuration

The project uses a `.env` file for configuration.

1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
2.  Edit the `.env` file and set your `DATABASE_URL`:
    ```env
    # Example for PostgreSQL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

### c. Database Migration

Run the Prisma migration to set up your database schema.

```bash
# This command applies any pending migrations to the database.
bun turbo db:push
```

## 2. Daily Work

### a. Running the Web Application

To start the Next.js development server for the web app:

```bash
bun turbo dev --filter=web
```

The application will be available at `http://localhost:3000`.

### b. Running Tests

To run all tests across the monorepo:

```bash
bun turbo test
```

To get a test coverage report for the functional core:

```bash
bun turbo test:coverage --filter=core
```

### c. Running the CLI Importer

To import YouTube URLs from local markdown files:

```bash
# Ensure you have some .md files with YouTube links in a local directory
bun turbo start --filter=cli-importer -- --directory /path/to/your/notes
```

## 3. Core Workflows

### a. Adding a New Feature (Functional Core First)

1.  **Schema**: Define or update your data contracts in `packages/shared-api/src/schemas.ts`.
2.  **Test**: Write a failing test for your new business logic in `packages/core/tests/`.
3.  **Implement**: Write the pure function in `packages/core/src/` to make the test pass.
4.  **Shell**: Implement the side-effectful logic (e.g., database access) in `packages/shell/src/`.
5.  **App**: Expose the new feature through an API endpoint or UI component in `apps/web/`.

### b. Creating a New Package

To create a new shared package (e.g., a new service):

1.  Create a new directory inside `packages/`.
2.  Add a `package.json` and `tsconfig.json`.
3.  Add the new package to the `workspaces` array in the root `package.json`.
4.  Add a new entry to the `pipeline` in `turbo.json`.

### c. Working with a Private Project

To use the monorepo's packages in your separate private project:

1.  **Link Package**: In `public-monorepo/packages/[package-name]`, run:
    ```bash
    bun link
    ```
2.  **Consume Link**: In your `private-project/[project-name]`, run:
    ```bash
    bun link [package-name]
    ```
3.  **Before Pushing**: The pre-push hook in the private project will automatically verify that your code works with the published versions of the packages, not the linked ones.
