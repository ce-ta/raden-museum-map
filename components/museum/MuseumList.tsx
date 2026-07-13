// 画面右側の一覧タブに表示する美術館カードリスト。
"use client";

import { MuseumIcon, CollaboratedMuseumIcon } from "../map/MuseumIconSvg";
import type { MuseumMapItem } from "@/types/museum";

export default function MuseumList({ museums }: { museums: MuseumMapItem[] }) {
    return (
        <div className="bg-neutral-800 p-4 overflow-y-auto h-full">
            <ul className="space-y-3">
                {museums.map((museum) => (
                    <li key={museum.id}>
                        <button
                            type="button"
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-900 text-left text-neutral-100 transition-transform duration-150 ease-out hover:scale-[1.03] hover:border-neutral-500 cursor-pointer"
                        >
                            {museum.hasCollaboration ? (
                                <CollaboratedMuseumIcon className="w-6 h-8 shrink-0" />
                            ) : (
                                <MuseumIcon className="w-6 h-8 shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="font-medium truncate">{museum.name}</p>
                                <p className="text-sm text-neutral-400 truncate">{museum.address}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
