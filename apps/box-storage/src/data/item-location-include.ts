import { Prisma } from "@/generated/prisma/client"

export const listItemsInclude = {
  box: {
    select: {
      name: true,
      furniture: {
        select: {
          name: true,
          room: {
            select: {
              name: true,
              floor: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  furniture: {
    select: {
      name: true,
      room: {
        select: {
          name: true,
          floor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  room: {
    select: {
      name: true,
      floor: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.ItemInclude

export type ListItemWithLocationRelations = Pick<
  Prisma.ItemGetPayload<{ include: typeof listItemsInclude }>,
  "box" | "furniture" | "room"
>
