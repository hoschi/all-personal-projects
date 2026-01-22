import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export const config = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `${env("DATABASE_URL")}?schema=box_storage`,
  },
}

export default defineConfig(config)
