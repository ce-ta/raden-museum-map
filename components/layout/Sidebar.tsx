"use client";

import Link from "next/link";
import { useState } from "react";

function MapIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-6-3V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4m0 3L9 4"
            />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3M4 11h16M6 21h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );
}

function AdminIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
            />
        </svg>
    );
}

function ChevronIcon({ className, direction }: { className?: string; direction: "left" | "right" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
        </svg>
    );
}

const NAV_ITEMS = [
    { href: "/", label: "地図", Icon: MapIcon },
    { href: "/calendar", label: "カレンダー", Icon: CalendarIcon },
];

// 左側の固定ナビゲーション。開閉可能。ビュー（地図／カレンダー）を切り替える。
// TODO: usePathname() で現在のルートを取得し、該当項目に active 用のスタイルを付与する実装が必要
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav
            className={`shrink-0 border-r border-neutral-700 bg-neutral-900 p-3 flex flex-col gap-1 transition-[width] duration-150 ${isOpen ? "w-40" : "w-14"
                }`}
        >
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`mb-2 flex items-center rounded-lg p-2 text-neutral-100 hover:bg-neutral-800 cursor-pointer ${isOpen ? "self-end" : "self-center"
                    }`}
                aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
            >
                <ChevronIcon className="w-5 h-5" direction={isOpen ? "left" : "right"} />
            </button>

            {NAV_ITEMS.map(({ href, label, Icon }) => (
                <Link
                    key={href}
                    href={href}
                    title={label}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-800 ${isOpen ? "" : "justify-center"
                        }`}
                >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="truncate">{label}</span>}
                </Link>
            ))}

            <Link
                href="/admin/login"
                title="管理者"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-800 ${isOpen ? "" : "justify-center"
                    }`}
            >
                <AdminIcon className="w-5 h-5 shrink-0" />
                {isOpen && <span className="truncate">管理者</span>}
            </Link>
        </nav>
    );
}
