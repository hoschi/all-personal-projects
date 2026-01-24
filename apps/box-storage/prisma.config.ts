import { config as dotenvConfig } from "dotenv"
import { defineConfig } from "prisma/config"

// Load .env.base first, then override with .env if it exists
dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

export const DATABASE_SCHEMA_NAME = process.env.DATABASE_SCHEMA_NAME

export const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `${process.env.DATABASE_URL}?schema=${DATABASE_SCHEMA_NAME}`,
  },
}

export default defineConfig(config)
