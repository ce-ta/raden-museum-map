// 地図上に表示する美術館1件分のマーカーコンポーネント。

import { Marker, Popup, useMap } from "react-leaflet";
import type { MuseumMapItem } from "../../types/museum";
import { museumIcon } from "./museumIcon";
import { createGoogleMapUrl } from "@/lib/googleMaps";

export default function MuseumMarker({ museums, onSelect }: { museums: MuseumMapItem[] }) {
    const map = useMap();

    return (
        <>
            {museums.map((museum) => (
                <Marker key={museum.id} position={[museum.lat, museum.lng]} icon={museumIcon}>
                    <Popup interactive>
                        <strong>美術館名: {museum.name}</strong><br />
                        <button onClick={() => map.flyTo([museum.lat, museum.lng], 16, { duration: 0.3 })}>
                            このあたりを見る
                        </button><br />
                        <a onClick={() => onSelect(museum.id)}>
                            詳細を表示
                        </a><br />
                        <a href={createGoogleMapUrl(museum.lat, museum.lng)} target="_blank">Google Mapで開く</a>
                    </Popup>
                </Marker>
            ))}
        </>
    )
}