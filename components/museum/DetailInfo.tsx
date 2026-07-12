// 画面右側の詳細情報表示コンポーネント
"use client";

import { MuseumIcon, CollaboratedMuseumIcon } from "../map/MuseumIconSvg";
import MuseumInfo from "./MuseumInfo";

export default function DetailInfo({ museumId }: { museumId: string | null }) {

    return (
        <div className="ml-2">
            <div className="mb-4 flex items-center gap-8">
                <span className="flex items-center gap-2">
                    <CollaboratedMuseumIcon className="w-6 h-8" />: <span>コラボあり</span>
                </span>
                <span className="flex items-center gap-2">
                    <MuseumIcon className="w-6 h-8" />: <span>コラボなし</span>
                </span>
            </div>
            <MuseumInfo museumId={museumId} />
        </div>
    );
}