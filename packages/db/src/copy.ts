import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

// Env laden per Parameter
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true })

// Clients für Quelle und Ziel
const sourceClient = new PrismaClient({
  datasources: { db: { url: process.env.SOURCE_URL! } },
})
const targetClient = new PrismaClient()

async function copyVideos() {
  console.log(
    `Datenkopie von ${process.env.SOURCE_URL} nach ${process.env.DATABASE_URL}`,
  )

  // Ziel leeren
  await targetClient.video.deleteMany()
  console.log("Ziel-Datenbank geleert")

  // Quelle auslesen
  const videos = await sourceClient.video.findMany()
  console.log(`Gefundene Videos in Quelle: ${videos.length}`)

  if (videos.length > 0) {
    // Daten kopieren
    await targetClient.video.createMany({
      data: videos.map(({ id, ...rest }) => rest),
    })
    console.log("Daten erfolgreich kopiert")
  } else {
    console.log("Keine Daten zum Kopieren gefunden")
  }
}

async function main() {
  try {
    await copyVideos()
  } catch (e) {
    console.error("Fehler beim Kopieren:", e)
    process.exit(1)
  } finally {
    await sourceClient.$disconnect()
    await targetClient.$disconnect()
  }
}

main()
