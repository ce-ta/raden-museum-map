/*
  Warnings:

  - You are about to drop the column `hasCollaboration` on the `Museum` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Museum" DROP COLUMN "hasCollaboration";

-- AlterTable
ALTER TABLE "OfficialCollaboration" ADD COLUMN     "isOfficial" BOOLEAN NOT NULL DEFAULT true;
