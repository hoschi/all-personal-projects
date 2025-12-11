# Phase 0 Research: Boilerplate Integration Strategy

**Purpose**: To define the best practices and configurations for integrating the specified technology stack, ensuring all components work together seamlessly and adhere to the project constitution.

## 1. Turbopack Monorepo Setup with Bun

- **Decision**: Use `bun create turbo` to scaffold the initial monorepo structure. Bun will be configured as the package manager for the entire monorepo by setting `packageManager` in `turbo.json`.
- **Rationale**: This approach leverages Turbopack's official scaffolding while ensuring Bun is used for its performance benefits from the start. `turbo.json` will be configured to define the dependency relationships and task pipelines (e.g., `build`, `test`, `lint`).
- **Alternatives considered**: Manual setup. Rejected because scaffolding is faster and less error-prone.

## 2. ESLint Configuration for Architectural Enforcement

- **Decision**: A custom ESLint package (`eslint-config-custom`) will be created within the monorepo. It will use `eslint-plugin-import` with the `paths` setting to define strict import restrictions.
  - Rule: `packages/core` can only import from `node_modules` or other `packages/core` modules.
  - Rule: `packages/shell` and `apps/*` can import from `core`, but not vice-versa.
- **Rationale**: This automates the enforcement of the "Functional Core, Imperative Shell" pattern (Principle I), providing immediate feedback to the developer and the CI pipeline if a violation occurs.
- **Alternatives considered**: Relying on manual code reviews. Rejected as it's unreliable and inefficient for a core architectural principle.

## 3. Effect Platform + Prisma Integration Pattern

- **Decision**: The Prisma client instance will be managed as a "Service" within Effect's `Context`. A `PrismaService` layer will be created in `packages/shell` and provided to the Effect runtime. All database calls will be wrapped with `Effect.tryPromise`, mapping Prisma errors to a typed `DatabaseError`.
- **Rationale**: This pattern cleanly integrates Prisma into the Effect ecosystem, allowing for dependency injection, typed error handling, and easy mocking for tests, fully aligning with the imperative shell concept.
- **Alternatives considered**: Calling Prisma directly within business logic. Rejected because it would violate the core/shell separation and bypass Effect's error and resource management.

## 4. Sharing Effect Schemas between Next.js and Effect Backend

- **Decision**: The `packages/shared-api` will export all Effect Schemas. The Next.js application (`apps/web`) will import these schemas directly for client-side validation and type inference. The Effect Platform backend will use the same schemas to define API endpoints, ensuring a single source of truth.
- **Rationale**: This is the most direct way to achieve end-to-end type safety (Principle V). Any change to a schema is immediately reflected on both the client and server, preventing entire classes of bugs.
- **Alternatives considered**: Using a separate validation library on the frontend (e.g., Zod, Yup). Rejected as it introduces duplication and potential for drift between client and server types.

## 5. GitHub Actions for Bun + Turbopack Monorepo

- **Decision**: A single GitHub Actions workflow file will be created. It will use `oven-sh/setup-bun` to install Bun. Turbopack's remote caching will be enabled using a Vercel token stored in repository secrets to dramatically speed up CI runs. The workflow will have separate jobs for linting, testing (with coverage reporting), and building.
- **Rationale**: This provides a robust and efficient CI pipeline. Remote caching is critical for monorepo performance, and separate jobs allow for parallel execution and clear identification of failures.
- **Alternatives considered**: Running all checks in a single job. Rejected as it's slower and provides less granular feedback.

## 6. `bun link` Workflow for Private Projects

- **Decision**: The documentation will specify a clear workflow:
  1. In `public-monorepo/packages/[package-name]`, run `bun link`.
  2. In `private-project/notes-manager-cli`, run `bun link [package-name]`.
     A pre-push hook (using a tool like `husky`) will be configured in the private project to temporarily run `bun unlink` and `bun install` to ensure the project works with the published versions of packages before allowing a push.
- **Rationale**: This provides a reliable local development experience while the pre-push hook acts as a safety net, preventing broken code from being pushed (Principle VI).
- **Alternatives considered**: Using `npm link` or `yarn link`. Rejected to maintain consistency with Bun as the sole package manager. Using relative file paths. Rejected as it's brittle and doesn't simulate a real-world installation.
