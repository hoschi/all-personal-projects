import { prisma } from "@/data/prisma"
import { hash } from "bcryptjs"

const main = async () => {
  // Cleanup
  await Promise.all([
    prisma.userItemInteraction.deleteMany(),
    prisma.item.deleteMany(),
    prisma.box.deleteMany(),
    prisma.furniture.deleteMany(),
    prisma.room.deleteMany(),
    prisma.floor.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "alice",
        passwordHash: await hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        username: "bob",
        passwordHash: await hash("password123", 10),
      },
    }),
  ])

  // Floors & Rooms
  const floor = await prisma.floor.create({
    data: {
      name: "Ground Floor",
      rooms: {
        create: [{ name: "Living Room" }, { name: "Bedroom" }],
      },
    },
    include: { rooms: true },
  })

  // Furniture in rooms
  const furniture = await Promise.all(
    floor.rooms.map((room) =>
      prisma.furniture.create({
        data: {
          name: room.name === "Living Room" ? "Bookshelf" : "Nightstand",
          roomId: room.id,
          boxes: {
            create: [
              { name: `${room.name} Box 1` },
              { name: `${room.name} Box 2` },
            ],
          },
        },
        include: { boxes: true },
      }),
    ),
  )

  // Items with nested relations
  const items = await Promise.all(
    furniture.flatMap((furn) =>
      furn.boxes.map((box) =>
        prisma.item.create({
          data: {
            name: `Item in ${box.name}`,
            description: "Seeded test item",
            lastModifiedAt: new Date(),
            isPrivate: false,
            ownerId: users[0].id,
            boxId: box.id,
            furnitureId: furn.id,
            roomId: furn.room?.id,
          },
        }),
      ),
    ),
  )

  // User-Item interactions
  await prisma.userItemInteraction.createMany({
    data: items.slice(0, 2).map((item) => ({
      userId: users[0].id,
      itemId: item.id,
      isFavorite: true,
      lastUsedAt: new Date(),
    })),
  })

  console.log(`✅ Seeded ${users.length} users, ${items.length} items`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
