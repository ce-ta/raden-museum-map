"use client"

import { useState, useEffect } from "react";
import { fetchAllPrefecture } from "@/lib/actions/prefecture";
import type { FilterState } from "@/types/museum";

type Prefecture = {
    code: number;
    name: string
}

export default function Filter({ filterState, onChange }: { filterState: FilterState, onChange: React.Dispatch<React.SetStateAction<FilterState>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [prefectureList, setPrefectureList] = useState<Prefecture[]>([]);

    useEffect(() => {
        const load = async () => {
            const result = await fetchAllPrefecture();
            setPrefectureList(result);
        }
        load();
    }, []);

    return (
        <div className="border-b border-neutral-700 bg-neutral-800">
            <div className="flex items-center gap-2 p-3">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="美術館を検索"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-600 bg-neutral-900 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-neutral-400"
                        onChange={(e) => {
                            onChange((prev) => ({
                                ...prev,
                                searchText: e.target.value,
                            }))
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors hover:border-neutral-400 hover:bg-neutral-800 ${isOpen ? "border-neutral-400 bg-neutral-800 text-neutral-100" : "border-neutral-600 bg-neutral-900 text-neutral-100"}`}
                >
                    <svg
                        className="w-4 h-4 text-neutral-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M10 12h4M11 16h2" />
                    </svg>
                    フィルター
                </button>
            </div>

            {isOpen && (
                <div className="p-3 mb-3 rounded-md border-t border-neutral-700 bg-neutral-900 space-y-3">
                    <div>
                        <p className="text-xs text-neutral-400 mb-2">コラボあり/なし
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-600 bg-neutral-900 text-sm text-neutral-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-neutral-400"
                                    checked={filterState.hasCollaboration}
                                    onChange={() => {
                                        onChange((prev) => ({
                                            ...prev,
                                            hasCollaboration: !prev.hasCollaboration
                                        }))
                                    }}
                                />
                                コラボあり
                            </label>
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-600 bg-neutral-900 text-sm text-neutral-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-neutral-400"
                                    checked={filterState.hasNotCollaboration}
                                    onChange={() => {
                                        onChange((prev) => ({
                                            ...prev,
                                            hasNotCollaboration: !prev.hasNotCollaboration
                                        }))
                                    }}
                                />
                                コラボなし
                            </label>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-neutral-400 mb-2">都道府県</p>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-neutral-600 bg-neutral-900 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            value={filterState.prefectureCode ?? ""}
                            onChange={(e) => {
                                onChange((prev) => ({
                                    ...prev,
                                    prefectureCode: e.target.value === "" ? null : Number(e.target.value)
                                }))
                            }}
                        >
                            <option value="">すべて</option>
                            {prefectureList.map((p) => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 cursor-pointer hover:text-neutral-100"
                        >
                            リセット
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    )
}
