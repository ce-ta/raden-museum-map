// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";

export function getMuseums() {
    return prisma.museum.findMany();
}

export function getMuseumDetail(id: string) {
    return prisma.museum.findUnique({
        where: { id },
        include: {
            collaborations: true,
            reports: true,
        },
    });
}