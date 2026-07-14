import { prisma } from "./prisma";

export function getPrefecture() {
    return prisma.prefecture.findMany();
}