// Museum に関するデータアクセス関数をまとめる場所。
import { prisma } from "./prisma";
import { FilterState } from "@/types/museum";
import type { Collaboration, NewMuseumInput, NewCollaborationInput, MuseumMapItem } from "@/types/museum";
import { REGIONS, regionOfPrefecture } from "./regions";

// 地方名の配列を、該当する都道府県コードの配列に展開する。
function regionsToCodes(regions: string[]): number[] {
    const codes: number[] = [];
    for (let code = 1; code <= 47; code++) {
        if (regions.includes(regionOfPrefecture(code) ?? "")) codes.push(code);
    }
    return codes;
}

function withReportCount<T extends { _count: { reports: number } }>(museum: T) {
    const { _count, ...rest } = museum;
    return { ...rest, reportCount: _count.reports };
}

export async function getMuseums() {
    const museums = await prisma.museum.findMany({
        include: {
            _count: { select: { reports: true } },
            collaborations: { select: { isOfficial: true } },
        },
    });
    return museums.map(withReportCount);
}

export function getMuseumDetail(id: string) {
    return prisma.museum.findUnique({
        where: { id },
        include: {
            collaborations: true,
            reports: true,
            type: true,
            prefecture: true,
        },
    });
}

export async function filterMuseums(filter: FilterState) {
    // 両方外す場合は該当なし（0件）にする
    if (!filter.hasCollaboration && !filter.hasNotCollaboration) {
        return [];
    }

    if (filter.typeIds.length === 0) {
        return [];
    }

    if (filter.regions.length === 0) {
        return [];
    }

    const collaborationCondition =
        filter.hasCollaboration && filter.hasNotCollaboration
            ? undefined                                                  // 両方チェック→絞り込みなし
            : filter.hasCollaboration
                ? { collaborations: { some: { isOfficial: true } } }      // コラボありのみ
                : { collaborations: { none: { isOfficial: true } } };     // コラボなしのみ

    const regionCodes = filter.regions.length > 0 ? regionsToCodes(filter.regions) : null;

    const museums = await prisma.museum.findMany({
        where: {
            ...(filter.searchText && {
                OR: [
                    { name: { contains: filter.searchText, mode: "insensitive" } },
                    { address: { contains: filter.searchText, mode: "insensitive" } },
                ],
            }),
            ...(regionCodes !== null && {
                prefectureCode: { in: regionCodes },
            }),
            ...(filter.typeIds.length > 0 && {
                typeId: { in: filter.typeIds },
            }),
            ...(collaborationCondition ?? {}),
        },
        include: {
            _count: { select: { reports: true } },
            collaborations: { select: { isOfficial: true } },   // 判定に要る最小限だけ取得
        },
        orderBy: filter.sortBy === "name" ? { name: filter.sortOrder } : undefined,
    });

    const mapped = museums.map(withReportCount);
    if (filter.sortBy === "reports") {
        mapped.sort((a, b) => (filter.sortOrder === "asc" ? a.reportCount - b.reportCount : b.reportCount - a.reportCount));
    }
    return mapped;
}

export { REGIONS };

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

export function addCollaboration(collaboration: NewCollaborationInput) {
    return prisma.officialCollaboration.create({ data: collaboration });
}

export function updateCollaboration(collaboration: NewCollaborationInput) {
    const { collaborationId: id, ...data } = collaboration;
    return prisma.officialCollaboration.update({
        where: { id },
        data,
    });
}

export async function deleteCollaboration(id: string) {
    return prisma.officialCollaboration.delete({
        where: { id }
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

export function updateMuseumRecord(museum: MuseumMapItem) {
    const { id, ...data } = museum;
    return prisma.museum.update({
        where: { id },
        data
    })
}

export function removeMuseum(id: string) {
    return prisma.museum.delete({
        where: { id }
    });
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