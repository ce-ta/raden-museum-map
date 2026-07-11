import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tokyoArt = await prisma.museum.create({
    data: {
      name: "東京アートミュージアム",
      address: "東京都千代田区1-1-1",
      lat: 35.6895,
      lng: 139.6917,
      collaborations: {
        create: {
          title: "特別展〇〇 音声ガイド出演",
          description: "でん同士による音声ガイドコラボ企画",
          sourceUrl: "https://x.com/example/status/1",
          date: new Date("2026-05-01"),
        },
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
        ],
      },
    },
  });

  const osakaMuseum = await prisma.museum.create({
    data: {
      name: "大阪現代美術館",
      address: "大阪府大阪市中央区2-2-2",
      lat: 34.6937,
      lng: 135.5023,
      reports: {
        create: [
          {
            body: "リスナーとして訪問しました。公式コラボはまだ無いようです。",
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
