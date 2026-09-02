"use server"

import { validateCollaboration } from "./museum"
import type { NewCollaborationInput } from "@/types/museum"
import { addCollaboration, updateCollaboration, deleteCollaboration } from "../museums";


export async function addCollabo(collaboration: NewCollaborationInput) {
    await validateCollaboration(collaboration);
    return await addCollaboration(collaboration);
}

export async function updateCollabo(collaboration: NewCollaborationInput) {
    await validateCollaboration(collaboration);
    return updateCollaboration(collaboration);
}

export async function deleteCollabo(id: string) {
    return deleteCollaboration(id);
}