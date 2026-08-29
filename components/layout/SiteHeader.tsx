import Link from "next/link";

const NAV_ITEMS = [
    { href: "/", label: "マップ" },
    { href: "/calendar", label: "コラボカレンダー" },
];

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-line bg-paper/95 px-4 backdrop-blur md:h-16 md:px-6">
            <Link href="/" className="flex items-baseline gap-2 text-ink hover:text-ink">
                <span className="font-serif text-[17px] font-medium tracking-[.14em] md:text-[19px]">
                    でん同士美術館マップ🐚
                </span>
            </Link>
            <nav aria-label="メイン" className="ml-auto hidden items-center gap-7 text-[13px] text-muted md:flex">
                {NAV_ITEMS.map(({ href, label }) => (
                    <Link key={href} href={href} className="hover:text-ink">
                        {label}
                    </Link>
                ))}
            </nav>
            {/* <Link
                href="/admin/login"
                className="ml-auto flex h-9 items-center gap-2 border border-line bg-panel px-3 text-[12px] text-muted hover:border-ink/30 hover:text-ink md:ml-0"
            >
                管理者ログイン
            </Link> */}
        </header>
    );
}
