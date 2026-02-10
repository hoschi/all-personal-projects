/*
  Warnings:

  - The primary key for the `user_item_interactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_inMotionUserId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "user_item_interactions" DROP CONSTRAINT "user_item_interactions_userId_fkey";

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ALTER COLUMN "inMotionUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_item_interactions" DROP CONSTRAINT "user_item_interactions_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_item_interactions_pkey" PRIMARY KEY ("userId", "itemId");

-- DropTable
DROP TABLE "users";
