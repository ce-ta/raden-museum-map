// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";
import { FilterState } from "@/types/museum";
import type { Collaboration } from "@/types/museum";

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
        orderBy: filter.sortBy === "name" ? { name: "asc" } : undefined,
    });
}

export async function getCollaborationsDate(): Promise<Collaboration[]> {
    const result = await prisma.officialCollaboration.findMany();
    const collaborations: Collaboration[] = result.map((r) => ({
        id: r.id,
        title: r.title,
        startDate: r.startDate,
        endDate: r.endDate
    }))

    return collaborations;
}

export function getCollaboDetail(id: string) {
    return prisma.officialCollaboration.findUnique({
        where: { id },
        include: { museum: true },
    });
}