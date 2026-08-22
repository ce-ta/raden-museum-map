"use server"

import { getFacilityTypes } from "../facilityTypes";

export async function fetchAllFacilityTypes() {
    return getFacilityTypes();
}
