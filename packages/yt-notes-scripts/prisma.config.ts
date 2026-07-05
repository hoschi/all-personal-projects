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

if (DATABASE_SCHEMA_NAME !== "yt") {
  throw new Error(
    'DATABASE_SCHEMA_NAME must be set to "yt" for yt-notes-scripts',
  )
}

const datasourceUrl = new URL(DATABASE_URL)
datasourceUrl.searchParams.set("schema", DATABASE_SCHEMA_NAME)

export const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl.toString(),
  },
}

export default defineConfig(config)
