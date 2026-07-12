// データ投入: npx prisma db seed
// データ削除+マイグレーション再適用+投入: npx prisma migrate reset

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const artMuseumType = await prisma.facilityType.create({
    data: { name: "美術館" },
  });
  const museumType = await prisma.facilityType.create({
    data: { name: "博物館" },
  });

  const tokyoArt = await prisma.museum.create({
    data: {
      name: "東京国立博物館",
      address: "〒110-8712 東京都台東区上野公園１３−９",
      lat: 35.719052838589484,
      lng: 139.7764893106396,
      typeId: museumType.id,
      websiteUrl: "https://www.tnm.jp/",
      phone: "050-5541-8600",
      openingHours: "9:00〜17:00",
      admissionFee: "一般 1,200円 / 学生 800円",
      imageUrl: "/museums/tokyo-art.svg",
      hasCollaboration: true,
      collaborations: {
        create: [
          {
            title: "特別展〇〇 音声ガイド出演",
            description: "でん同士による音声ガイドコラボ企画",
            sourceUrl: "https://x.com/example/status/1",
            date: new Date("2026-05-01"),
          },
          {
            title: "コラボグッズ展開",
            description: "ミュージアムショップ限定コラボグッズ販売",
            sourceUrl: "https://x.com/example/status/2",
            date: new Date("2026-06-15"),
          },
        ],
      },
      reports: {
        create: [
          {
            body: "実際に音声ガイドを聞いてきました。素晴らしい内容でした。",
            status: "PUBLISHED",
          },
          {
            body: "混雑していましたが楽しめました。",
            status: "PENDING",
          },
          {
            body: "不適切な投稿のサンプル。",
            status: "HIDDEN",
          },
        ],
      },
    },
  });

  const osakaMuseum = await prisma.museum.create({
    data: {
      name: "箱根ガラスの森美術館",
      address: "〒250-0631 神奈川県足柄下郡箱根町仙石原９４０−４８",
      lat: 35.266458608316356,
      lng: 139.01766339528083,
      typeId: artMuseumType.id,
      websiteUrl: "https://www.hakone-garasunomori.jp/",
      phone: "0460-86-3111",
      openingHours: "10:00〜18:00",
      admissionFee: "一般 1,000円",
      imageUrl: "/museums/osaka-modern.svg",
      hasCollaboration: false,
      reports: {
        create: [
          {
            body: "リスナーとして訪問しました。公式コラボ待ってます",
            status: "PUBLISHED",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
