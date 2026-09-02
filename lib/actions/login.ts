"use server";

import { cookies } from "next/headers";
import { verifyAdmin } from "@/lib/login";
import type { LoginForm } from "@/types/admin";

export async function login(formData: LoginForm) {
    const username = String(formData.username ?? "");
    const password = String(formData.password ?? "");

    const admin = await verifyAdmin(username, password);
    if (!admin) {
        return { error: "ユーザー名またはパスワードが違います" };
    }

    // 認証成功 → セッションを張る（下記は最小例。実際は署名付きトークン推奨）
    (await cookies()).set("admin_session", admin.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
    });

    return { ok: true };
}