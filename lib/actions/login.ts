"use server";

import { createSession, deleteSession } from "@/lib/sessions";
import { verifyAdmin } from "@/lib/login";
import type { LoginForm } from "@/types/admin";
import { redirect } from "next/navigation";

export async function login(formData: LoginForm) {
    const username = String(formData.username ?? "");
    const password = String(formData.password ?? "");

    const admin = await verifyAdmin(username, password);
    if (!admin) {
        return { error: "ユーザー名またはパスワードが違います" };
    }

    await createSession(admin.id);

    return { ok: true };
}

export async function logout() {
    await deleteSession();
    redirect("/admin/login");
}