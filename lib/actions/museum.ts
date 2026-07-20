"use server"

import { FilterState } from "@/types/museum";
import { getMuseumDetail, filterMuseums } from "../museums"
import { getCollaboDetail } from "../museums";

export async function fetchMuseumDetail(id: string) {
    return getMuseumDetail(id);
}

export async function fetchFilterMuseums(filter: FilterState) {
    return filterMuseums(filter);
}

export async function fetchCollaboDetail(id: string) {
    return getCollaboDetail(id);
}