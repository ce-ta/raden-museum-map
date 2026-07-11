// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";

export function getMuseums() {
    return prisma.museum.findMany();
}