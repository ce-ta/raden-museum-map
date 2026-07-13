"use client";

import { useEffect, useState } from "react";
import { fetchMuseumDetail } from "@/lib/actions/museum";
type MuseumDetail = Awaited<ReturnType<typeof fetchMuseumDetail>>;

export default function MuseumInfo({ museumId }: { museumId: string | null }) {
    const [detail, setDetail] = useState<MuseumDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!museumId) {
            setDetail(null);
            return;
        }
        setLoading(true);
        fetchMuseumDetail(museumId).then((data) => {
            console.log(data);
            setDetail(data);
            setLoading(false);
        });
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

            <section>
                <h2 className="text-sm font-semibold mb-2">投稿</h2>
                {detail.reports.length === 0 ? (
                    <p className="text-sm text-neutral-500">投稿はまだありません</p>
                ) : (
                    <ul className="space-y-3">
                        {detail.reports.map((r) => (
                            <li key={r.id}>
                                {r.photoUrl && <img src={r.photoUrl} className="rounded mb-1" />}
                                <p className="text-sm">{r.body}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}