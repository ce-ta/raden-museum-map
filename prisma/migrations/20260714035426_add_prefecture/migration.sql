/*
  Warnings:

  - Added the required column `prefectureCode` to the `Museum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: 一旦NULL許容で追加し、既存行に値を入れてからNOT NULL化する
ALTER TABLE "Museum" ADD COLUMN     "prefectureCode" INTEGER;

-- CreateTable
CREATE TABLE "Prefecture" (
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Prefecture_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prefecture_name_key" ON "Prefecture"("name");

-- Seed: 47都道府県マスタ（JIS X 0401 都道府県コード順）
INSERT INTO "Prefecture" ("code", "name") VALUES
  (1, '北海道'), (2, '青森県'), (3, '岩手県'), (4, '宮城県'), (5, '秋田県'),
  (6, '山形県'), (7, '福島県'), (8, '茨城県'), (9, '栃木県'), (10, '群馬県'),
  (11, '埼玉県'), (12, '千葉県'), (13, '東京都'), (14, '神奈川県'), (15, '新潟県'),
  (16, '富山県'), (17, '石川県'), (18, '福井県'), (19, '山梨県'), (20, '長野県'),
  (21, '岐阜県'), (22, '静岡県'), (23, '愛知県'), (24, '三重県'), (25, '滋賀県'),
  (26, '京都府'), (27, '大阪府'), (28, '兵庫県'), (29, '奈良県'), (30, '和歌山県'),
  (31, '鳥取県'), (32, '島根県'), (33, '岡山県'), (34, '広島県'), (35, '山口県'),
  (36, '徳島県'), (37, '香川県'), (38, '愛媛県'), (39, '高知県'), (40, '福岡県'),
  (41, '佐賀県'), (42, '長崎県'), (43, '熊本県'), (44, '大分県'), (45, '宮崎県'),
  (46, '鹿児島県'), (47, '沖縄県');

-- 既存Museum行への都道府県割り当て（住所文字列から手動で対応付け）
UPDATE "Museum" SET "prefectureCode" = 13 WHERE "address" LIKE '%東京都%';
UPDATE "Museum" SET "prefectureCode" = 14 WHERE "address" LIKE '%神奈川県%';

-- NOT NULL化
ALTER TABLE "Museum" ALTER COLUMN "prefectureCode" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Museum" ADD CONSTRAINT "Museum_prefectureCode_fkey" FOREIGN KEY ("prefectureCode") REFERENCES "Prefecture"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
