"use server"

import { put } from "@vercel/blob";
import { prisma } from "../prisma";

export async function fetchCreateReport({
    museumId,
    body,
    photo,
}: {
    museumId: string;
    body: string;
    photo?: File;
}) {
    let photoUrl: string | undefined;
    if (photo && photo.size > 0) {
        const blob = await put(photo.name, photo, { access: "public", addRandomSuffix: true });
        photoUrl = blob.url;
    }

    return prisma.report.create({
        data: { museumId, body, photoUrl },
    });
}
