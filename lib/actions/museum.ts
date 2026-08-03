"use server"

import { FilterState } from "@/types/museum";
import { getMuseumDetail, filterMuseums, getMuseums } from "../museums"
import { getCollaboDetail, getCollaborations, addMuseum } from "../museums";
import type { NewMuseumInput, NewCollaborationInput } from "@/types/museum";

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

export async function createMuseum(
    museum: NewMuseumInput,
    collaboration?: NewCollaborationInput,
) {
    return addMuseum(museum, collaboration)
}