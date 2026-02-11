/*
  Warnings:

  - Made the column `ownerUsername` on table `items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userUsername` on table `user_item_interactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "ownerUsername" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_item_interactions" ALTER COLUMN "userUsername" SET NOT NULL;
