import { config as dotenvConfig } from "dotenv"
import { defineConfig } from "prisma/config"

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

export const DATABASE_SCHEMA_NAME = process.env.DATABASE_SCHEMA_NAME

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required for Prisma configuration")
}

if (!DATABASE_SCHEMA_NAME) {
  throw new Error("DATABASE_SCHEMA_NAME is required for Prisma configuration")
}

export const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `${DATABASE_URL}?schema=${DATABASE_SCHEMA_NAME}`,
  },
}

export default defineConfig(config)
