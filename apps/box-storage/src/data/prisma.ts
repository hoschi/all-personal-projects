import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

import { config } from "prisma.config"

const adapter = new PrismaPg({ connectionString: config.datasource.url })
export const prisma = new PrismaClient({ adapter })