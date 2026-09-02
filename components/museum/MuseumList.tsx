// 左パネルの美術館一覧。件数・並び替えと、美術館カードのリストを表示する。
"use client";

import { regionOfPrefecture } from "@/lib/regions";
import type { FilterState, MuseumMapItem } from "@/types/museum";

export default function MuseumList({
    museums,
    selectedId,
    onSelect,
    isFetching,
    filterState,
    onChange,
}: {
    museums: MuseumMapItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isFetching: boolean;
    filterState: FilterState;
    onChange: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
    return (
        <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
                <p className="text-[12px] text-muted">
                    <span className="text-ink">{museums.length}</span> 件の美術館
                </p>
                <label className="sr-only" htmlFor="sort">並び順</label>
                <select
                    id="sort"
                    className="border-none bg-panel text-[12px] text-muted focus:outline-none"
                    value={filterState.sortBy === "distance" ? "distance" : `${filterState.sortBy}:${filterState.sortOrder}`}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "distance") {
                            onChange((prev) => ({ ...prev, sortBy: "distance" }));
                            return;
                        }
                        const [sortBy, sortOrder] = value.split(":") as [FilterState["sortBy"], FilterState["sortOrder"]];
                        onChange((prev) => ({ ...prev, sortBy, sortOrder }));
                    }}
                >
                    <option value="name:asc">名前順</option>
                    <option value="reports:desc">感想が多い順</option>
                    <option value="distance">現在地からの距離順</option>
                </select>
            </div>

            <ul className="scroll-thin min-h-0 flex-1 divide-y divide-line overflow-y-auto">
                {isFetching ? (
                    <li className="px-6 py-14 text-center text-[13px] text-muted">読み込み中...</li>
                ) : museums.length === 0 ? (
                    <li className="px-6 py-14 text-center text-[13px] text-muted">
                        条件に合う美術館がありません
                        <br />
                        <span className="text-faint">絞り込みを見直してください</span>
                    </li>
                ) : (
                    museums.map((museum) => {
                        const region = regionOfPrefecture(museum.prefectureCode);
                        return (
                            <li key={museum.id} className="group">
                                <button
                                    type="button"
                                    onClick={() => onSelect(museum.id)}
                                    className={`flex w-full gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[.04] md:px-6 ${selectedId === museum.id ? "bg-accent-soft" : ""
                                        }`}
                                >
                                    {museum.imageUrl ? (
                                        <img src={museum.imageUrl} alt="" className="h-[68px] w-[68px] flex-none object-cover" />
                                    ) : (
                                        <span className="ph h-[68px] w-[68px] flex-none" aria-hidden="true" />
                                    )}
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[10px] tracking-[.14em] text-faint">
                                            {region ? `${region}・` : ""}{museum.address}
                                        </span>
                                        <span className="mt-1 block truncate font-serif text-[15px] text-ink">{museum.name}</span>
                                        <span className="mt-1.5 block text-[11px] text-muted">
                                            {museum.hasCollaboration ? "コラボあり" : "コラボなし（紹介のみ）"}
                                            {/* <span className="text-faint"> ・感想 {museum.reportCount}件</span> */}
                                        </span>
                                        {museum.openingHours && (
                                            <span className="mt-1 block text-[11px] text-muted">{museum.openingHours}</span>
                                        )}
                                    </span>
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
        </>
    );
}
