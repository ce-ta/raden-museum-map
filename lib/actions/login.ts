"use server";

import { createSession, deleteSession } from "@/lib/sessions";
import { verifyAdmin } from "@/lib/login";
import type { LoginForm } from "@/types/admin";
import { redirect } from "next/navigation";
import getClientIp from "../clientIp";
import { isLocked, recordAttempt, clearAttempts } from "../loginAttempt";

export async function login(formData: LoginForm) {
    const ip = await getClientIp();
    const username = String(formData.username ?? "");
    const password = String(formData.password ?? "");

    if(await isLocked(ip, username)) {
        return {error: "ログイン試行回数が上限に達しました。\n時間を空けてもう1度お試しください。"};
    }

    await recordAttempt(ip, username);

    const admin = await verifyAdmin(username, password);
    if (!admin) {
        return { error: "ユーザー名またはパスワードが違います" };
    }

    await clearAttempts(username);
    await createSession(admin.id);

    return { ok: true };
}

export async function logout() {
    await deleteSession();
    redirect("/admin/login");
}