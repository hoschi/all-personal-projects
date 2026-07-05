import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "./generated/prisma/client"

const YT_SCHEMA = "yt"

// Name des KB-Vaults in yt.vault. Konstante muss konsistent zum Schema-
// Init-Migrations-Stand der DB sein. Wenn jemand den Namen ändern will:
// in einem Commit sowohl diese Konstante als auch eine begleitende
// Migration anpassen.
export const USER_KB_VAULT_NAME = "user-kb-vault"

// Prisma-Client wird lazy erzeugt: der DATABASE_URL-Check und die
// Client-Erzeugung passieren erst beim ersten Zugriff, nicht beim Import.
// Sonst würde schon das reine Importieren dieses Moduls (z.B. nur für
// USER_KB_VAULT_NAME oder in Unit-Tests mit gemocktem DB) ohne gesetzte
// DATABASE_URL werfen — das macht Unit-Tests ohne echte Datenbank (CI)
// unmöglich. Die echte Nutzung wirft weiterhin fail-fast.
let client: PrismaClient | undefined

function getClient(): PrismaClient {
  if (client) return client

  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL required for yt-notes-scripts runtime client (db.ts)",
    )
  }

  const adapter = new PrismaPg(
    { connectionString: DATABASE_URL },
    { schema: YT_SCHEMA },
  )
  client = new PrismaClient({ adapter })
  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver)
  },
}) as PrismaClient
