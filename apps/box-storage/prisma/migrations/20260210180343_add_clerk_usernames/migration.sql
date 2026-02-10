-- AlterTable
ALTER TABLE "items" ADD COLUMN     "inMotionUsername" TEXT,
ADD COLUMN     "ownerUsername" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "user_item_interactions" ADD COLUMN     "userUsername" TEXT NOT NULL DEFAULT '';
