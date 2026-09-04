"use server"

import type { NewMuseumInput, MuseumMapItem } from "@/types/museum";
import type { NewCollaborationInput } from "@/types/museum";
import { addMuseum, updateMuseumRecord, removeMuseum } from "../museums";
import { requiredAdmin } from "./sessions";
import { put } from "@vercel/blob";
import { validateImageFile } from "../imageUpload";

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
    await requiredAdmin();
    validateMuseum(museum);
    if (collaboration != null) {
        validateCollaboration(collaboration);
    }

    return addMuseum(museum, collaboration)
}

export async function updateMuseum(museum: MuseumMapItem) {
    await requiredAdmin();
    validateMuseum(museum);
    return updateMuseumRecord(museum);
}

export async function deleteMuseum(id: string) {
    await requiredAdmin();
    return removeMuseum(id)
}

export async function uploadMuseumImage(file: File): Promise<string> {
    await requiredAdmin();
    const invalid = validateImageFile(file);
    if (invalid) throw new Error(invalid);
    const blob = await put(`museums/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
    });
    return blob.url;
}