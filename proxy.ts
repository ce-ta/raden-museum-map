// Cookie の有無だけを見て先回りリダイレクトする「楽観的チェック」を行う

import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const hasCookie = Boolean(req.cookies.get("admin_session")?.value); // 存在確認のみ
    const isLogin = pathname === "/admin/login";

    // 未ログインで保護領域(ログイン画面)にリダイレクト
    if (!isLogin && !hasCookie) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    if (isLogin && hasCookie) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    return NextResponse.next();
}

// このマッチャに該当するURLでのみproxyを実行する（/adminとその配下すべて）
export const config = { matcher: ["/admin/:path*"] };

// TODO 総当たり攻撃への対策