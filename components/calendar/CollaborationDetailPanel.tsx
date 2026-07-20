"use client"

// カレンダー画面右側の一覧⇄詳細パネル

import { format } from "date-fns";
import type { OfficialCollaboration, Museum } from "@/app/generated/prisma/client";

type CollaboDetail = OfficialCollaboration & { museum: Museum };

export default function CollaborationDetailPanel({ detailCollabo, loading }: { detailCollabo: CollaboDetail | null, loading: boolean }) {
    return (
        <div className="ml-2 h-full flex flex-col min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-row">
                    <button
                        type="button"
                        className="px-4 py-2 border border-b-0 border-neutral-600 cursor-pointer"
                    >
                        詳細
                    </button>
                </div>

                <div className="flex-1 min-h-0 bg-neutral-800 p-4 overflow-y-auto">
                    {loading ? (
                        <p className="bg-neutral-800 text-neutral-100 p-4 h-full">読み込み中...</p>
                    ) : (
                        !detailCollabo ? (
                            <p className="text-base text-neutral-500">コラボ企画を選択すると詳細が表示されます</p>
                        ) : (
                            <div className="text-neutral-100 space-y-6">
                                <div>
                                    <h1 className="text-xl font-bold">{detailCollabo.title}</h1>
                                </div>

                                <section>
                                    <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">開催{detailCollabo.museum.typeId === 1 ? "美術館" : "博物館"}</h2>
                                    <p className="text-base text-neutral-100 mt-2">
                                        {detailCollabo.museum.name}
                                        <a
                                            href={`/?museumId=${detailCollabo.museum.id}`}
                                            className="text-sm text-blue-400 underline underline-offset-2 hover:text-blue-300 ml-2"
                                        >
                                            地図で表示する
                                        </a>
                                    </p>
                                    <p className="text-base text-neutral-100 mt-2">{detailCollabo.museum.address}</p>
                                </section>

                                {detailCollabo.startDate && (
                                    <section>
                                        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">開催期間</h2>
                                        <p className="text-base text-neutral-100">
                                            {format(detailCollabo.startDate, "yyyy年M月d日")} 〜 {detailCollabo.endDate ? format(detailCollabo.endDate, "yyyy年M月d日") : ""}
                                        </p>
                                    </section>
                                )}


                                {detailCollabo.description && (
                                    <section>
                                        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">概要</h2>
                                        <p className="text-base text-neutral-100 whitespace-pre-wrap">{detailCollabo.description}</p>
                                    </section>
                                )}

                                <section>
                                    <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">コラボ情報</h2>
                                    <a
                                        href={detailCollabo.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-400 underline underline-offset-2 hover:text-blue-300"
                                    >
                                        出典を開く
                                    </a>
                                </section>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
