"use server"

import { getCollaboDetail, getCollaborations } from "../museums";

export async function fetchCollaboration() {
    return getCollaborations();
}

export async function fetchCollaboDetail(id: string) {
    return getCollaboDetail(id);
}