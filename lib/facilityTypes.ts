import { prisma } from "./prisma";

export function getFacilityTypes() {
    return prisma.facilityType.findMany();
}
