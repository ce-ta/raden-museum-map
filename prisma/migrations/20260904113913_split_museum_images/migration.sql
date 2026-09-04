-- AlterTable: imageUrl を coverImageUrl にリネーム（データは保持）し、追加画像用の配列カラムを足す
ALTER TABLE "Museum" RENAME COLUMN "imageUrl" TO "coverImageUrl";
ALTER TABLE "Museum" ADD COLUMN "subImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
