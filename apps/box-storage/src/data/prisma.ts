import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

import { config, DATABASE_SCHEMA_NAME } from "prisma.config"

const adapter = new PrismaPg(
  { connectionString: config.datasource.url },
  { schema: DATABASE_SCHEMA_NAME },
)
export const prisma = new PrismaClient({ adapter })
