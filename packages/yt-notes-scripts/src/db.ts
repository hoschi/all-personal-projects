import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "./generated/prisma/client"

const YT_SCHEMA = "yt"

// Name des KB-Vaults in yt.vault. Konstante muss konsistent zum Schema-
// Init-Migrations-Stand der DB sein. Wenn jemand den Namen ändern will:
// in einem Commit sowohl diese Konstante als auch eine begleitende
// Migration anpassen.
export const USER_KB_VAULT_NAME = "user-kb-vault"

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL required for yt-notes-scripts runtime client (db.ts)",
  )
}

const adapter = new PrismaPg(
  { connectionString: `${DATABASE_URL}?schema=${YT_SCHEMA}` },
  { schema: YT_SCHEMA },
)

export const prisma = new PrismaClient({ adapter })
