// 地図上に表示する美術館1件分のマーカーコンポーネント。

import { useEffect, useRef } from "react";
import { Marker, useMap, Tooltip } from "react-leaflet";
import type L from "leaflet";
import type { MuseumMapItem } from "../../types/museum";
import { museumIcon, collaboratedMuseumIcon, currentLocationIcon } from "./museumIcon";
import { createGoogleMapUrl } from "@/lib/googleMaps";
import { checkCollaboration } from "@/lib/collaboration";

export default function MuseumMarker({
    museums,
    selectedId,
    onSelect,
    location,
    isShowLocation
}: {
    museums: MuseumMapItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    location: { lat: number; lng: number } | null,
    isShowLocation: boolean
}) {
    const map = useMap();

    return (
        <>
            {(location && isShowLocation) && (
                <Marker
                    position={[location.lat, location.lng]}
                    icon={currentLocationIcon}
                    interactive={false}
                    zIndexOffset={-1000}
                />
            )}
            {museums.map((museum) => (
                <MuseumMarkerItem
                    key={museum.id}
                    museum={museum}
                    isSelected={museum.id === selectedId}
                    onSelect={onSelect}
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
}: {
    museum: MuseumMapItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
    map: L.Map;
}) {
    const markerRef = useRef<L.Marker>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const el = markerRef.current?.getElement();
        el?.classList.toggle("museum-marker-selected", isSelected);

        if (!isSelected) {
            markerRef.current?.closePopup();
        }
    }, [isSelected]);

    // Tooltipへカーソルを移動する間は閉じず、マーカー・Tooltipの両方から
    // カーソルが離れたときだけ少し遅らせて閉じる
    useEffect(() => {
        const marker = markerRef.current;
        if (!marker) return;

        const clearCloseTimer = () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };

        const scheduleClose = () => {
            clearCloseTimer();
            closeTimerRef.current = setTimeout(() => {
                marker.closeTooltip();
            }, 150);
        };

        const handleMarkerOver = () => {
            clearCloseTimer();
            marker.openTooltip();
            const tooltipEl = marker.getTooltip()?.getElement();
            tooltipEl?.addEventListener("mouseenter", clearCloseTimer);
            tooltipEl?.addEventListener("mouseleave", scheduleClose);
        };

        marker.off("mouseover mouseout");
        marker.on("mouseover", handleMarkerOver);
        marker.on("mouseout", scheduleClose);

        return () => {
            clearCloseTimer();
            marker.off("mouseover", handleMarkerOver);
            marker.off("mouseout", scheduleClose);
        };
    }, []);

    return (
        <Marker
            ref={markerRef}
            position={[museum.lat, museum.lng]}
            icon={checkCollaboration(museum) ? collaboratedMuseumIcon : museumIcon}
            eventHandlers={{
                click: () => {
                    onSelect(museum.id);
                }
            }}
        >
            <Tooltip direction="top" offset={[0, -34]} opacity={1} interactive className="museum-marker-tooltip">
                <div className="p-1 text-[13px]">
                    <p className="font-serif text-ink">{museum.name}</p>
                    <p className="text-muted">{museum.address}</p>
                    <a href={createGoogleMapUrl(museum.name, museum.address)} target="_blank" className="text-accent">Google Mapで開く</a>
                </div>
            </Tooltip>
        </Marker>
    );
}
