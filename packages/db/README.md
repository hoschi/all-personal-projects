# DB

## Init fresh clone

Install PostgreSQL 17 and create database users (password is the db name) with databases:

```bash
createuser all_personal_projects_prod -P --createdb
createdb all_personal_projects_prod -O all_personal_projects_prod
createuser all_personal_projects_staging -P --createdb
createdb all_personal_projects_staging -O all_personal_projects_staging
createuser all_personal_projects_dev -P --createdb
createdb all_personal_projects_dev -O all_personal_projects_dev
cd ./packages/db/
dotenv -f .env.prod run -- npx prisma migrate deploy
dotenv -f .env.staging run -- npx prisma migrate deploy
dotenv -f .env.dev run -- npx prisma migrate deploy
```

## Database Copy Tools

There are two scripts for copying database schemas:

### 1. `copy.ts` - Flexible Copy, Backup, and Restore Tool

**Purpose:** Universal tool for copying, backing up, and restoring database schemas.

**Special Feature:** The script can automatically read the schema from the `.env` file when `DB_SCHEMA` is defined, or use the `-s` parameter.

**Usage without schema parameter (schema from .env):**

```bash
# Simple copying with schema from .env
bun copy.ts <source> <target>

# Backup with schema from .env
bun copy.ts -f <backup-file> -b <source>

# Restore with schema from .env
bun copy.ts -f <backup-file> -r <target>
```

**Usage with schema parameter (legacy):**

```bash
bun copy.ts -s <schema> <source> <target>
```

#### Copying between databases

**Usage:**

```bash
# New: Use schema from .env
bun copy.ts <source> <target>

# Legacy: Specify schema explicitly
bun copy.ts -s <schema> <source> <target>
```

**Parameters:**

- `-s <schema>`: Name of the schema to copy (optional if `DB_SCHEMA` is set in `.env`)
- `<source>`: Source environment (`dev`, `staging`, or `prod`)
- `<target>`: Target environment (`dev`, `staging`, or `prod`)

**Examples:**

```bash
# Copy video data from dev to staging (with .env schema)
bun copy.ts dev staging

# Copy video data with explicit schema
bun copy.ts -s video dev staging

# Copy financy forecast from production to staging
bun copy.ts -s financy_forecast prod staging

# Copy any schema between any environments
bun copy.ts -s my_schema staging dev
```

#### Create backup

**Usage:**

```bash
# New: Use schema from .env
bun copy.ts -f <backup-file> -b <source>

# Legacy: Specify schema explicitly
bun copy.ts -s <schema> -f <backup-file> -b <source>
```

**Parameters:**

- `-s <schema>`: Name of the schema to backup (optional if `DB_SCHEMA` is set in `.env`)
- `-f <backup-file>`: Name of the backup file (e.g., `backup.sql`, `2025-12-26-backup.sql`)
- `-b`: Backup mode (export)
- `<source>`: Source environment for the backup

**Examples:**

```bash
# Backup video schema from dev (with .env schema)
bun copy.ts -f backup.sql -b dev

# Backup video schema with explicit schema
bun copy.ts -s video -f backup.sql -b dev

# Backup production data with date
bun copy.ts -s financy_forecast -f 2025-12-26-prod-backup.sql -b prod

# Backup staging data with timestamp
bun copy.ts -f staging-$(date +%Y%m%d).sql -b staging
```

#### Restore backup

**Usage:**

```bash
# New: Use schema from .env
bun copy.ts -f <backup-file> -r <target>

# Legacy: Specify schema explicitly
bun copy.ts -s <schema> -f <backup-file> -r <target>
```

**Parameters:**

- `-s <schema>`: Name of the schema to restore (optional if `DB_SCHEMA` is set in `.env`)
- `-f <backup-file>`: Name of the backup file
- `-r`: Restore mode (import with schema deletion)
- `<target>`: Target environment for restoration

**Examples:**

```bash
# Restore backup in dev (with .env schema)
bun copy.ts -f backup.sql -r dev

# Restore backup with explicit schema
bun copy.ts -s video -f backup.sql -r dev

# Restore production backup in staging
bun copy.ts -s financy_forecast -f prod-backup.sql -r staging

# Restore staging backup to a new environment
bun copy.ts -f staging-backup.sql -r dev
```

**Technical Details:**

- Uses PostgreSQL CLI (`pg_dump` and `psql`)
- Supports all PostgreSQL databases, not just Prisma
- **Copy:** Deletes target schema completely before import (`--clean` flag)
- **Backup:** Standard `pg_dump` export without DROP statements
- **Restore:** Deletes target schema before import (`DROP SCHEMA CASCADE`)
- Works on schema level, not table level

### 2. `copy-env.ts` - Bidirectional Environment Pipeline

**Purpose:** Flexible tool for copying a specific schema between environments in both directions.

**Usage:**

```bash
# Development → Staging → Production (complete pipeline)
bun copy-env.ts -s <schema> up

# Development → Staging (only up to staging)
bun copy-env.ts -s <schema> up --staging-only

# Production → Staging → Development (complete pipeline)
bun copy-env.ts -s <schema> down

# Production → Staging (only up to staging)
bun copy-env.ts -s <schema> down --staging-only
```

**Parameters:**

- `-s <schema>`: Name of the schema to copy (e.g., `video`, `financy_forecast`) - optional if DB_SCHEMA in .env is set
- `up`: Copy in direction Production (dev → staging → prod)
- `down`: Copy in direction Development (prod → staging → dev)
- `--staging-only`: Copy only up to staging (skip last stage)

**Examples:**

```bash
# Copy video schema from Development to Production
bun copy-env.ts up

# Copy video schema with explicit schema
bun copy-env.ts -s video up

# Copy video schema only up to staging (Development → Staging)
bun copy-env.ts up --staging-only

# Copy video schema with explicit schema only up to staging
bun copy-env.ts -s video up --staging-only

# Copy video schema from Production to Development
bun copy-env.ts down

# Copy video schema with explicit schema
bun copy-env.ts -s video down

# Copy video schema only up to staging (Production → Staging)
bun copy-env.ts down --staging-only

# Copy video schema with explicit schema only up to staging
bun copy-env.ts -s video down --staging-only
```

**Pipeline Directions:**

- **up:** Development → Staging → Production
- **down:** Production → Staging → Development

**Use Cases:**

- **up:** When you test in Development with real data and want to bring it to Staging/Production
- **down:** When you work in Production and need data for local development

**Technical Details:**

- Uses the `copy.ts` script internally
- Copies only the specified schema
- Supports both directions with identical logic
- Simple one-click solution for bidirectional workflows

## Differences in Detail

| Feature                | `copy.ts`              | `copy-env.ts`                                 |
| ---------------------- | ---------------------- | --------------------------------------------- |
| **Flexibility**        | ✅ Fully flexible      | ⚠️ Only up/down pipeline                      |
| **Environments**       | ✅ Any combinations    | ❌ Fixed pipeline                             |
| **Schema Selection**   | ✅ Single schema       | ✅ Single schema (-s flag)                    |
| **Pipeline Direction** | ❌ Not available       | ✅ up/down modes                              |
| **Backup Function**    | ✅ Yes (-b flag)       | ❌ No                                         |
| **Restore Function**   | ✅ Yes (-r flag)       | ❌ No                                         |
| **Use Case**           | ✅ Any DB operations   | ✅ Bidirectional pipeline for specific schema |
| **Complexity**         | ⚠️ Parameters required | ✅ Simple call                                |
| **CLI-Based**          | ✅ PostgreSQL CLI      | ✅ Uses copy.ts                               |

## Recommendations

- **For general DB operations:** Use `copy.ts` with copy parameter
- **For backups:** Use `copy.ts` with `-b` flag
- **For restoration:** Use `copy.ts` with `-r` flag
- **For Development → Production pipeline:** Use `copy-env.ts -s <schema> up`
- **For Production → Development pipeline:** Use `copy-env.ts -s <schema> down`
- **For tests with specific data:** `copy.ts` with exact parameters
- **For data backup:** `copy.ts` with `-b backup.sql source`
- **For schema-specific pipeline:** `copy-env.ts -s <schema> <up|down>`

## Workflow Examples

### Complete Backup/Restore Cycle

```bash
# 1. Create backup before changes (with .env schema)
bun copy.ts -f backup-before-changes.sql -b dev

# 2. Test changes...
bun copy.ts -f backup-after-test.sql -b dev

# 3. Restore if problems occur (with .env schema)
bun copy.ts -f backup-before-changes.sql -r dev
```

### Development-to-Production Workflow

```bash
# Copy video schema from Development to Production
bun copy-env.ts up

# Only up to staging for testing
bun copy-env.ts up --staging-only

# After successful tests: complete pipeline
bun copy-env.ts up
```

### Production-to-Development Workflow

```bash
# Copy video schema from Production to Development
bun copy-env.ts down

# Only up to staging for testing
bun copy-env.ts down --staging-only

# After successful tests: complete pipeline
bun copy-env.ts down
```

### Data Synchronization

```bash
# Update staging with production
bun copy.ts prod staging

# Update development with staging
bun copy.ts staging dev

# Specific schema in both directions
bun copy-env.ts up     # Dev → Prod
bun copy-env.ts down   # Prod → Dev
```

### Backup Rotation

```bash
# Daily backups with date
bun copy.ts -f "backup-$(date +%Y%m%d).sql" -b prod

# Weekly backups
bun copy.ts -s financy_forecast -f "weekly-$(date +%Y-W%V).sql" -b staging
```

### Disaster Recovery

```bash
# Complete restoration from backup
bun copy.ts -f emergency-backup.sql -r dev

# Restore staging from production backup
bun copy.ts -s financy_forecast -f latest-prod-backup.sql -r staging

# Production data in development with copy-env
bun copy-env.ts down --staging-only

# Development data in production with copy-env
bun copy-env.ts up --staging-only
```

## Environments

The following environments are available:

- **dev:** `postgresql://all_personal_projects_dev:all_personal_projects_dev@localhost:5432/all_personal_projects_dev`
- **staging:** `postgresql://all_personal_projects_staging:all_personal_projects_staging@localhost:5432/all_personal_projects_staging`
- **prod:** `postgresql://all_personal_projects_prod:all_personal_projects_prod@localhost:5432/all_personal_projects_prod`

## Advantages of PostgreSQL CLI

- **Universal:** Works with any PostgreSQL database
- **Schema-based:** Works on complete schema level
- **Clean:** `--clean` flag automatically deletes before import
- **Backup-capable:** Standard `pg_dump` for safe backups
- **Restore-capable:** Automatic schema deletion before restore
- **Performant:** Optimized for large amounts of data
- **Standard:** Industry standard for PostgreSQL backups

## Test Examples

To test the extended `copy.ts`:

### Test Copy Functionality

```bash
# Copy data from dev to staging with .env schema
bun copy.ts dev staging

# Copy data from dev to staging with explicit schema
bun copy.ts -s video dev staging

# Copy data from dev to staging with financy_forecast schema
bun copy.ts -s financy_forecast dev staging
```

### Test Backup Functionality

```bash
# Create backup of video schema from dev (with .env schema)
bun copy.ts -f test-backup.sql -b dev

# Create backup of video schema with explicit schema
bun copy.ts -s video -f test-backup.sql -b dev

# Check backup
ls -la test-backup.sql
head -20 test-backup.sql
```

### Test Restore Functionality

```bash
# Restore backup in dev (deletes existing schema)
bun copy.ts -f test-backup.sql -r dev

# Restore backup with explicit schema
bun copy.ts -s video -f test-backup.sql -r dev
```

### Test copy-env Functionality

```bash
# Copy video schema from Development to Staging
bun copy-env.ts up --staging-only

# Copy video schema with explicit schema from Development to Staging
bun copy-env.ts -s video up --staging-only

# Copy video schema from Production to Staging
bun copy-env.ts down --staging-only

# Copy video schema with explicit schema from Production to Staging
bun copy-env.ts -s video down --staging-only

# Complete pipeline: Development → Staging → Production
bun copy-env.ts up

# Complete pipeline with explicit schema
bun copy-env.ts -s video up

# Complete pipeline: Production → Staging → Development
bun copy-env.ts down

# Complete pipeline with explicit schema
bun copy-env.ts -s video down
```

### Compare All Modes

```bash
# Copy (automatically deletes target)
bun copy.ts dev staging

# Backup (export only, no changes)
bun copy.ts -f backup.sql -b staging

# Restore (deletes target and imports)
bun copy.ts -f backup.sql -r dev

# Pipeline: Development → Staging
bun copy-env.ts up --staging-only

# Pipeline: Production → Staging
bun copy-env.ts down --staging-only
```
