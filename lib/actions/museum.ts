"use server"

import { getMuseumDetail } from "../museums"

export async function fetchMuseumDetail(id: string) {
    return getMuseumDetail(id);
}