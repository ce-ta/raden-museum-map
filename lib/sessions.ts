// セッションの実体は「署名付きJWT」をhttpOnlyCookieに入れたもの（ステートレスセッション）

import "server-only"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

// JWT の署名・検証に使う秘密鍵。環境変数から読みTextEncoderでUint8Array化（jose の要求形式に変換）
const key = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET);

// セッションを格納するCookie名。proxy.tsで同じ名前を参照
const COOKIE = "admin_session";
const MAX_SESSION_TIME = 60 * 60 * 8; // 8時間

// ログイン成功時に、管理者IDを署名付きトークンとしてCookieにセット
export async function createSession(adminId: string) {
    const token = await new SignJWT({ adminId })
        .setProtectedHeader({ alg: "HS256" }) // HMAC-SHA256 で署名
        .setIssuedAt()                        // iat（発行時刻）を付与
        .setExpirationTime("8h")              // exp（失効時刻）。これを過ぎるとjwtVerifyが例外を投げる
        .sign(key);

    // httpOnly:  JS から読めないようにする（XSS対策）
    // secure:    本番のみhttpsでのアクセスを必須（ローカルではhttpでも動くように分岐させる）
    // sameSite:  lax。通常遷移では送信、クロスサイトのPOST等では送らない（CSRF 緩和）
    // path:      "/" でサイト全体に送信
    // maxAge:    セッション保持時間
    (await cookies()).set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: MAX_SESSION_TIME,
    });
}

export async function getSession(): Promise<{ adminId: string } | null> {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    try {
        // 署名が鍵と一致し、失効していなければ、payloadを取り出せる
        const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
        return { adminId: payload.adminId as string };
    } catch {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete(COOKIE);
}
