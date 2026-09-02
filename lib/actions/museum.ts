"use server"

import { FilterState } from "@/types/museum";
import { getMuseumDetail, filterMuseums, getMuseums } from "../museums"
import { getCollaboDetail, getCollaborations, addMuseum, updateMuseumRecord, removeMuseum } from "../museums";
import type { NewMuseumInput, NewCollaborationInput, MuseumMapItem } from "@/types/museum";

export async function fetchMuseums() {
    return getMuseums();
}

export async function fetchCollaboration() {
    return getCollaborations();
}

export async function fetchMuseumDetail(id: string) {
    return getMuseumDetail(id);
}

export async function fetchFilterMuseums(filter: FilterState) {
    return filterMuseums(filter);
}

export async function fetchCollaboDetail(id: string) {
    return getCollaboDetail(id);
}

function isBlank(value: string | null | undefined) {
    return value == null || value.trim() === "";
}

function validateMuseum(museum: NewMuseumInput) {
    const missing: string[] = [];
    if (isBlank(museum.name)) missing.push("美術館名");
    if (isBlank(museum.address)) missing.push("住所");
    if (typeof museum.lat !== "number" || Number.isNaN(museum.lat)) missing.push("緯度");
    if (typeof museum.lng !== "number" || Number.isNaN(museum.lng)) missing.push("経度");
    if (typeof museum.typeId !== "number" || Number.isNaN(museum.typeId)) missing.push("種別");
    if (typeof museum.prefectureCode !== "number" || Number.isNaN(museum.prefectureCode)) missing.push("都道府県");

    if (missing.length > 0) {
        throw new Error(`美術館情報の必須項目が不足しています: ${missing.join(", ")}`);
    }
}

export async function validateCollaboration(collaboration: NewCollaborationInput) {
    const missing: string[] = [];
    if (isBlank(collaboration.title)) missing.push("コラボ名");
    if (isBlank(collaboration.sourceUrl)) missing.push("リンク");

    if (missing.length > 0) {
        throw new Error(`コラボ情報の必須項目が不足しています: ${missing.join(", ")}`);
    }
}

export async function createMuseum(
    museum: NewMuseumInput,
    collaboration?: NewCollaborationInput,
) {
    validateMuseum(museum);
    if (collaboration != null) {
        validateCollaboration(collaboration);
    }

    return addMuseum(museum, collaboration)
}

export async function updateMuseum(museum: MuseumMapItem) {
    validateMuseum(museum);

    return updateMuseumRecord(museum);
}

export async function deleteMuseum(id: string) {
    return removeMuseum(id)
}