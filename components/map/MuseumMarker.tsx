// 地図上に表示する美術館1件分のマーカーコンポーネント。

import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import type L from "leaflet";
import type { MuseumMapItem } from "../../types/museum";
import { museumIcon, collaboratedMuseumIcon } from "./museumIcon";
import { createGoogleMapUrl } from "@/lib/googleMaps";

export default function MuseumMarker({
    museums,
    selectedId,
    onSelect,
    setIsList
}: {
    museums: MuseumMapItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    setIsList: any;
}) {
    const map = useMap();

    return (
        <>
            {museums.map((museum) => (
                <MuseumMarkerItem
                    key={museum.id}
                    museum={museum}
                    isSelected={museum.id === selectedId}
                    onSelect={onSelect}
                    setIsList={setIsList}
                    map={map}
                />
            ))}
        </>
    )
}

function MuseumMarkerItem({
    museum,
    isSelected,
    onSelect,
    map,
    setIsList
}: {
    museum: MuseumMapItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
    map: L.Map;
    setIsList: any
}) {
    const markerRef = useRef<L.Marker>(null);

    useEffect(() => {
        const el = markerRef.current?.getElement();
        el?.classList.toggle("museum-marker-selected", isSelected);

        if (!isSelected) {
            markerRef.current?.closePopup();
        }
    }, [isSelected]);

    return (
        <Marker
            ref={markerRef}
            position={[museum.lat, museum.lng]}
            icon={museum.hasCollaboration ? collaboratedMuseumIcon : museumIcon}
            eventHandlers={{
                click: () => {
                    onSelect(museum.id);
                    setIsList(false);
                }
            }}
        >
            <Popup interactive>
                <strong>美術館名: {museum.name}</strong><br />
                <button onClick={() => map.flyTo([museum.lat, museum.lng], 16, { duration: 0.3 })}>
                    このあたりを見る
                </button><br />
                <a href={createGoogleMapUrl(museum.name, museum.address)} target="_blank">Google Mapで開く</a>
            </Popup>
        </Marker>
    );
}
