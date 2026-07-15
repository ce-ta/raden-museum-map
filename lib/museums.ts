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
    // 両方外す場合は該当なし（0件）にする
    if (!filter.hasCollaboration && !filter.hasNotCollaboration) {
        return prisma.museum.findMany({ where: { id: { in: [] } } });
    }

    // 両方チェック → 絞り込みなし、片方だけ → その値で絞り込み
    const hasCollaborationFilter =
        filter.hasCollaboration && filter.hasNotCollaboration
            ? undefined
            : filter.hasCollaboration;

    return prisma.museum.findMany({
        where: {
            ...(filter.searchText && {
                name: { contains: filter.searchText, mode: "insensitive" },
            }),
            ...(filter.prefectureCode !== null && filter.prefectureCode !== undefined && {
                prefectureCode: filter.prefectureCode,
            }),
            ...(hasCollaborationFilter !== undefined && {
                hasCollaboration: hasCollaborationFilter,
            }),
        },
    });
}