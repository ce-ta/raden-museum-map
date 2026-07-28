"use client"

import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import { useState } from "react";
import type { Content } from "@/types/admin"

type NavItems = {
    label: string,
    content: Content
}

const NAV_ITEMS: NavItems[] = [
    { label: "美術館一覧", content: "museum" },
    { label: "コラボ情報", content: "collaboration" },
];

export default function AdminPage() {
    const [content, setContent] = useState<Content | null>(null);
    return (
        <div className="flex h-screen">
            <aside className="w-56 shrink-0 border-r border-neutral-700 bg-neutral-900 p-4 text-neutral-100">
                <h1 className="mb-6 text-lg font-semibold">管理者用画面</h1>
                <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map(({ label, content }) => (
                        <a
                            key={label}
                            onClick={() => {
                                setContent(content)
                            }}
                            className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-800"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 bg-neutral-950 p-6 text-neutral-100">
                <h1 className="mb-4 text-xl font-semibold">ダッシュボード</h1>
                {content == null ? (
                    <p className="text-sm text-neutral-400">
                        左のメニューから管理する項目を選択してください。
                    </p>
                ) : (
                    <AdminDashboardContent content={content} />
                )}
            </main>
        </div>
    );
}
