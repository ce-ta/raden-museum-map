"use server"

import { getPrefecture } from "../prefecture";

export async function fetchAllPrefecture() {
    return getPrefecture();
}