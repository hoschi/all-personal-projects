-- CreateTable
CREATE TABLE "video"."Video" (
    "id" SERIAL NOT NULL,
    "titel" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_titel_key" ON "video"."Video"("titel");
