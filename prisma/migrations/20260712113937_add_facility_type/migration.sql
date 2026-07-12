/*
  Warnings:

  - Added the required column `typeId` to the `Museum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Museum" ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FacilityType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FacilityType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacilityType_name_key" ON "FacilityType"("name");

-- AddForeignKey
ALTER TABLE "Museum" ADD CONSTRAINT "Museum_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FacilityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
