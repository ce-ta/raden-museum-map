// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";
import { FilterState } from "@/types/museum";

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

export function filterMuseums(filter: FilterState) {
    return prisma.museum.findMany({
        where: {
            ...(filter.searchText && {
                name: { contains: filter.searchText, mode: "insensitive" },
            }),
            ...(filter.hasCollaboration !== null && filter.hasCollaboration !== undefined && {
                hasCollaboration: filter.hasCollaboration,
            }),
            ...(filter.prefectureCode !== null && filter.prefectureCode !== undefined && {
                prefectureCode: filter.prefectureCode,
            }),
        },
    });
}