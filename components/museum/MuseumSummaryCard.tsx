// 地図上に浮かぶ、選択中の美術館の概要カード（インターセプトルート相当）。
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMuseumDetail } from "@/lib/actions/museum";
import { regionOfPrefecture } from "@/lib/regions";

type MuseumDetail = Awaited<ReturnType<typeof fetchMuseumDetail>>;

export default function MuseumSummaryCard({ museumId, onClose }: { museumId: string; onClose: () => void }) {
    const [detail, setDetail] = useState<MuseumDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setDetail(null);
        fetchMuseumDetail(museumId).then((data) => {
            setDetail(data);
            setLoading(false);
        });
    }, [museumId]);

    return (
        <section
            aria-labelledby="sumName"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 z-[600] max-h-[74%] overflow-y-auto border-t border-line bg-panel shadow-[0_-8px_32px_rgba(0,0,0,.5)] md:inset-x-auto md:bottom-4 md:left-4 md:top-4 md:max-h-none md:w-[352px] md:border md:shadow-[0_8px_32px_rgba(0,0,0,.5)]"
        >
            {loading || !detail ? (
                <p className="p-5 text-[13px] text-muted">読み込み中...</p>
            ) : (
                <>
                    <div className="relative">
                        {detail.imageUrl ? (
                            <img src={detail.imageUrl} alt="" className="h-[132px] w-full object-cover md:h-[168px]" />
                        ) : (
                            <div className="ph h-[132px] w-full md:h-[168px]" />
                        )}
                        <button
                            type="button"
                            aria-label="閉じる"
                            onClick={onClose}
                            className="absolute right-2 top-2 h-8 w-8 border border-line bg-paper/90 text-[13px] text-muted backdrop-blur hover:text-ink cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-5">
                        <p className="text-[10px] tracking-[.16em] text-faint">
                            {regionOfPrefecture(detail.prefectureCode)}・{detail.prefecture.name}
                        </p>
                        <h2 id="sumName" className="mt-1.5 font-serif text-[20px] leading-snug">{detail.name}</h2>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="border border-line px-2 py-0.5 text-[11px] text-muted">{detail.type.name}</span>
                            {detail.hasCollaboration && (
                                <span className="border border-accent/70 bg-accent-soft px-2 py-0.5 text-[11px] text-accent">
                                    コラボあり
                                </span>
                            )}
                        </div>

                        <dl className="mt-4 divide-y divide-line border-y border-line text-[12px]">
                            <div className="grid grid-cols-[64px_1fr] gap-3 py-2.5">
                                <dt className="text-faint">開館</dt>
                                <dd className="text-ink">{detail.openingHours ?? "-"}</dd>
                            </div>
                            <div className="grid grid-cols-[64px_1fr] gap-3 py-2.5">
                                <dt className="text-faint">観覧料</dt>
                                <dd className="text-muted">{detail.admissionFee ?? "-"}</dd>
                            </div>
                        </dl>

                        <h3 className="mt-5 mb-2 text-[11px] tracking-[.14em] text-faint">最近の感想</h3>
                        {detail.reports.length === 0 ? (
                            <p className="text-[12px] text-faint">投稿はまだありません</p>
                        ) : (
                            <ul className="divide-y divide-line border-t border-line">
                                {detail.reports.slice(0, 2).map((r) => (
                                    <li key={r.id} className="py-3">
                                        <p className="text-[12.5px] leading-[1.85] text-muted" style={{ textWrap: "pretty" as any }}>
                                            {r.body}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-5">
                            <Link
                                href={`/museums/${detail.id}`}
                                className="block w-full bg-accent py-2.5 text-center text-[13px] font-medium text-[#17131f] hover:bg-[#c8bbec]"
                            >
                                詳細を見る
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
