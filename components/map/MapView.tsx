// 地図全体を描画するクライアントコンポーネント。
// react-leaflet を使い、美術館の位置をピンで表示する。
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MuseumMarker from "./MuseumMarker";
import type { MuseumMapItem } from "@/types/museum";
import { useState } from "react";

// 日本全体が収まる程度の初期中心座標・ズーム。
const DEFAULT_CENTER: [number, number] = [36.2048, 138.2529];
const DEFAULT_ZOOM = 5;

// 日本周辺から大きく外れてパン・ズームアウトできないようにする範囲。
const JAPAN_BOUNDS: [[number, number], [number, number]] = [
  [20, 122],
  [46, 154],
];

export default function MapView({
  museums,
  selectedId,
  onSelect,
  location,
}: {
  museums: MuseumMapItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  location: { lat: number; lng: number } | null;
}) {
  const [showLocation, setShowLocation] = useState(false);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={6}
      scrollWheelZoom
      maxBounds={JAPAN_BOUNDS}
      maxBoundsViscosity={1}
      className="map-tone-muted absolute inset-0"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[500] flex items-start justify-end gap-2 p-3 md:p-4">
        <label className="pointer-events-auto flex items-center gap-2 border border-line bg-panel/90 px-3 py-2 text-[11px] tracking-[.1em] text-muted shadow-sm backdrop-blur cursor-pointer">
          <input
            type="checkbox"
            className="accent-accent w-3.5 h-3.5"
            checked={showLocation}
            onChange={() => setShowLocation((prev) => !prev)}
          />
          現在地を表示する
        </label>
      </div>
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>'
        url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
      />
      <MuseumMarker museums={museums} selectedId={selectedId} onSelect={onSelect} location={location} isShowLocation={showLocation} />
    </MapContainer>
  );
}
