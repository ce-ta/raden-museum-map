"use server"

import { getSession } from "@/lib/sessions";

export async function requiredAdmin(): Promise<{ adminId: string }> {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}