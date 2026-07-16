"use client";

import { useEffect, useState } from "react";
import { fetchMuseumDetail } from "@/lib/actions/museum";
import ReportForm from "./ReportForm";
type MuseumDetail = Awaited<ReturnType<typeof fetchMuseumDetail>>;

export default function MuseumInfo({ museumId }: { museumId: string | null }) {
    const [detail, setDetail] = useState<MuseumDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadDetail = (id: string) => {
        setLoading(true);
        fetchMuseumDetail(id).then((data) => {
            setDetail(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!museumId) {
            setDetail(null);
            return;
        }
        setIsFormOpen(false);
        loadDetail(museumId);
    }, [museumId]);

    if (!museumId) return <p className="bg-neutral-800 text-neutral-100 p-4 h-full">マーカーを選択すると詳細が表示されます</p>;
    if (loading || !detail) return <p className="bg-neutral-800 text-neutral-100 p-4 h-full">読み込み中...</p>;
    return (
        <div className="bg-neutral-800 text-neutral-100 p-4 space-y-6 overflow-y-auto h-full">
            <div>
                <h1 className="text-xl font-bold">{detail.name}</h1>
                <p className="text-sm text-neutral-400">{detail.address}</p>
            </div>

            <section>
                <h2 className="text-sm font-semibold mb-2">公式サイト</h2>
                {detail.websiteUrl && (
                    <a
                        href={detail.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 underline underline-offset-2 hover:text-blue-300"
                    >
                        公式サイトを開く
                    </a>
                )}
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-2">開館時間</h2>
                <p className="text-sm text-neutral-400">{detail.openingHours}</p>
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-2">入場料</h2>
                <p className="text-sm text-neutral-400">{detail.admissionFee}</p>
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-2">公式コラボ情報</h2>
                {detail.collaborations.length === 0 ? (
                    <p className="text-sm text-neutral-500">コラボ情報はありません</p>
                ) : (
                    <ul className="space-y-3">
                        {detail.collaborations.map((c) => (
                            <li key={c.id}>
                                <p className="font-medium">{c.title}</p>
                                {c.description && <p className="text-sm text-neutral-400">{c.description}</p>}
                                <a href={c.sourceUrl} target="_blank" className="text-xs text-blue-400">出典</a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">投稿</h2>
                    {!isFormOpen && (
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-sm border border-neutral-600 text-neutral-100 cursor-pointer hover:border-neutral-400"
                            onClick={() => setIsFormOpen(true)}
                        >
                            感想を投稿する
                        </button>
                    )}
                </div>

                {isFormOpen && (
                    <div
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4"
                        onClick={() => setIsFormOpen(false)}
                    >
                        <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <ReportForm
                                museumId={museumId}
                                onCancel={() => setIsFormOpen(false)}
                                onSubmitted={() => {
                                    setIsFormOpen(false);
                                    loadDetail(museumId);
                                }}
                            />
                        </div>
                    </div>
                )}

                {detail.reports.length === 0 ? (
                    <p className="text-sm text-neutral-500">投稿はまだありません</p>
                ) : (
                    <ul className="space-y-3">
                        {detail.reports.map((r) => (
                            <li
                                key={r.id}
                                className="rounded-lg border border-neutral-700 bg-white text-neutral-900 p-3 space-y-2"
                            >
                                {r.photoUrl && (
                                    <img src={r.photoUrl} className="w-full rounded-md object-cover" />
                                )}
                                <p className="text-sm whitespace-pre-wrap">{r.body}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}