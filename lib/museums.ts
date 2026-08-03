// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";
import { FilterState } from "@/types/museum";
import type { Collaboration, NewMuseumInput, NewCollaborationInput } from "@/types/museum";

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
        orderBy: (() => {
            switch (filter.sortBy) {
                case "name": return { name: filter.sortOrder };
                case "prefecture": return { prefectureCode: filter.sortOrder };
                default: return undefined;
            }
        })(),
    });
}

export function getCollaborations() {
    return prisma.officialCollaboration.findMany({
        include: { museum: true },
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

export function addMuseum(
    museum: NewMuseumInput,
    collaboration?: NewCollaborationInput,
) {
    if (collaboration == null) {
        return addMuseumOnly(museum);
    } else {
        return addMuseumWithCollaboration(museum, collaboration);
    }
}

function addMuseumOnly(museum: NewMuseumInput) {
    return prisma.museum.create({ data: museum });
}

// 美術館とコラボ情報を1トランザクションで同時作成する。
// OfficialCollaboration.museumId は必須のため、美術館作成→そのidでコラボ作成の順で行う。
function addMuseumWithCollaboration(
    museum: NewMuseumInput,
    collaboration: NewCollaborationInput,
) {
    return prisma.$transaction(async (tx) => {
        const createdMuseum = await tx.museum.create({
            data: { ...museum, hasCollaboration: true },
        });
        const createdCollaboration = await tx.officialCollaboration.create({
            data: { ...collaboration, museumId: createdMuseum.id },
        });
        return { museum: createdMuseum, collaboration: createdCollaboration };
    });
}