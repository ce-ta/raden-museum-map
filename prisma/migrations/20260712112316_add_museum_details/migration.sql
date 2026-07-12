-- AlterTable
ALTER TABLE "Museum" ADD COLUMN     "admissionFee" TEXT,
ADD COLUMN     "hasCollaboration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "websiteUrl" TEXT;
