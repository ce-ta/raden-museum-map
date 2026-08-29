// 詳細ページの「投稿」セクション。フォームの開閉と投稿後の再取得を扱う。
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import ReportForm from "./ReportForm";

export default function MuseumReviewsSection({
    museumId,
    reports,
}: {
    museumId: string;
    reports: { id: string; body: string; photoUrl: string | null; createdAt: Date }[];
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const router = useRouter();

    const sorted = [...reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <section id="reviewForm" className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-[17px] tracking-wide">
                    みんなの投稿 <span className="ml-1 text-[12px] text-faint">{sorted.length}</span>
                </h2>
                {/* {!isFormOpen && (
                    <button
                        type="button"
                        className="border border-accent bg-accent px-4 py-2 text-[12px] font-medium text-[#17131f] hover:bg-[#c8bbec] cursor-pointer"
                        onClick={() => setIsFormOpen(true)}
                    >
                        感想を投稿する
                    </button>
                )} */}
            </div>

            {isFormOpen && (
                <ReportForm
                    museumId={museumId}
                    onCancel={() => setIsFormOpen(false)}
                    onSubmitted={() => {
                        setIsFormOpen(false);
                        router.refresh();
                    }}
                />
            )}

            {sorted.length === 0 ? (
                <p className="text-[13px] text-faint">投稿はまだありません</p>
            ) : (
                <ul className="divide-y divide-line border-t border-line">
                    {sorted.map((r) => (
                        <li key={r.id} className="py-5 space-y-2.5">
                            <p className="text-[11px] text-faint">{format(r.createdAt, "yyyy年M月d日", { locale: ja })}</p>
                            {r.photoUrl && <img src={r.photoUrl} className="w-full object-cover" />}
                            <p className="max-w-[62ch] text-[13.5px] leading-[1.9] text-muted whitespace-pre-wrap">
                                {r.body}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
