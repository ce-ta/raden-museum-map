"use server"

import { FilterState } from "@/types/museum";
import { getMuseumDetail, filterMuseums } from "../museums"

export async function fetchMuseumDetail(id: string) {
    return getMuseumDetail(id);
}

export async function fetchFilterMuseums(filter: FilterState) {
    return filterMuseums(filter);
}