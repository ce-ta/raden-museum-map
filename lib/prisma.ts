// PrismaClient のシングルトンを生成・エクスポートする置き場所。
// 各所で `new PrismaClient()` せず、ここから import して使い回す。
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });