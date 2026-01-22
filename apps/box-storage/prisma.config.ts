import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export const DATABASE_SCHEMA_NAME = env("DATABASE_SCHEMA_NAME")

export const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `${env("DATABASE_URL")}?schema=${DATABASE_SCHEMA_NAME}`,
  },
}

export default defineConfig(config)
