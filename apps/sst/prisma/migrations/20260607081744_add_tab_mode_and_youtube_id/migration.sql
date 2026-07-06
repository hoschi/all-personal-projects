-- CreateEnum
CREATE TYPE "TabMode" AS ENUM ('private', 'work');

-- AlterTable
ALTER TABLE "tabs" ADD COLUMN     "mode" "TabMode" NOT NULL DEFAULT 'private',
ADD COLUMN     "youtube_id" TEXT;
