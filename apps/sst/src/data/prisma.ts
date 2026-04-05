import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "../generated/prisma/client"
import { DATABASE_SCHEMA_NAME, config } from "prisma.config"

const adapter = new PrismaPg(
  { connectionString: config.datasource.url },
  { schema: DATABASE_SCHEMA_NAME },
)

export const prisma = new PrismaClient({ adapter })
