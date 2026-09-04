"use server"

import { validateCollaboration } from "./museum-admin";
import type { NewCollaborationInput } from "@/types/museum";
import { addCollaboration, updateCollaboration, deleteCollaboration } from "../museums";
import { requiredAdmin } from "./sessions";

export async function addCollabo(collaboration: NewCollaborationInput) {
    await requiredAdmin();
    await validateCollaboration(collaboration);
    return await addCollaboration(collaboration);
}

export async function updateCollabo(collaboration: NewCollaborationInput) {
    await requiredAdmin();
    await validateCollaboration(collaboration);
    return updateCollaboration(collaboration);
}

export async function deleteCollabo(id: string) {
    await requiredAdmin();
    return deleteCollaboration(id);
}