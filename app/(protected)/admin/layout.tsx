// (protected) ルートグループの共通レイアウト。
// セッションが無ければレンダリング前に/admin/loginへリダイレクトする

import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession(); // JWT を検証。無効なら null
    if (!session) redirect("/admin/login");
    return <>{children}</>;
}
