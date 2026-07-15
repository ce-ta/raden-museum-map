// 画面右側の詳細情報表示コンポーネント
"use client";

import { MuseumIcon, CollaboratedMuseumIcon } from "../map/MuseumIconSvg";
import MuseumInfo from "./MuseumInfo";
import MuseumList from "./MuseumList";
import type { MuseumMapItem } from "@/types/museum";

export default function DetailInfo({
    museumId,
    onSelect,
    museums,
    isList,
    setIsList,
    isFetching
}:
    {
        museumId: string | null,
        onSelect: any,
        museums: MuseumMapItem[],
        isList: boolean,
        setIsList: any,
        isFetching: boolean
    }) {
    return (
        <div className="ml-2 h-full flex flex-col min-h-0">
            <div className="mb-4 flex items-center gap-8">
                <span className="flex items-center gap-2">
                    <CollaboratedMuseumIcon className="w-6 h-8" />: <span>コラボあり</span>
                </span>
                <span className="flex items-center gap-2">
                    <MuseumIcon className="w-6 h-8" />: <span>コラボなし</span>
                </span>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-row">
                    <button
                        type="button"
                        className={`px-4 py-2 border border-b-0 border-neutral-600 cursor-pointer ${isList ? "bg-neutral-700 font-bold" : ""}`}
                        onClick={() => setIsList(true)}
                    >
                        一覧
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 border border-b-0 border-neutral-600 cursor-pointer ${!isList ? "bg-neutral-700 font-bold" : ""}`}
                        onClick={() => setIsList(false)}
                    >
                        詳細
                    </button>
                </div>

                <div className="flex-1 min-h-0">
                    {isList ? (
                        <MuseumList museums={museums} onSelect={onSelect} setIsList={setIsList} isFetching={isFetching} />
                    ) : (
                        <MuseumInfo museumId={museumId} />
                    )}
                </div>
            </div>
        </div>
    );
}