-- AlterTable
ALTER TABLE "items" ALTER COLUMN "ownerUsername" DROP NOT NULL,
ALTER COLUMN "ownerUsername" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_item_interactions" ALTER COLUMN "userUsername" DROP NOT NULL,
ALTER COLUMN "userUsername" DROP DEFAULT;
