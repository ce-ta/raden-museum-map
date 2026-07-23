// 地図全体を描画するクライアントコンポーネント。
// react-leaflet を使い、美術館の位置をピンで表示する。
"use client";

import "leaflet/dist/leaflet.css";
import { DomEvent } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import MuseumMarker from "./MuseumMarker";
import type { MuseumMapItem } from "@/types/museum";
import DetailInfo from "../museum/DetailInfo";
import { useEffect, useRef, useState } from "react";

// 日本全体が収まる程度の初期中心座標・ズーム。
const DEFAULT_CENTER: [number, number] = [36.2048, 138.2529];
const DEFAULT_ZOOM = 5;

// 日本周辺から大きく外れてパン・ズームアウトできないようにする範囲。
const JAPAN_BOUNDS: [[number, number], [number, number]] = [
  [20, 122],
  [46, 154],
];

export default function MapView({ museums, isFetching, initialSelectedId, location }: { museums: MuseumMapItem[], isFetching: boolean, initialSelectedId: string | null, location: { lat: number; lng: number } | null }) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [isList, setIsList] = useState(!initialSelectedId);
  const [showLocation, setShowLocation] = useState(false);

  return (
    <div className="grid grid-cols-[2fr_1fr] h-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={6}
        scrollWheelZoom
        maxBounds={JAPAN_BOUNDS}
        maxBoundsViscosity={1}
        className="map-tone-muted h-full w-full"
      >
        <label className="absolute top-3 right-3 z-[1000] flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-600 bg-neutral-900/90 text-base text-neutral-100 cursor-pointer">
          <input
            type="checkbox"
            className="accent-neutral-400 w-4 h-4"
            checked={showLocation}
            onChange={() => setShowLocation((prev) => !prev)}
          />
          現在地を表示する
        </label>
        <TileLayer
          attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        />
        <MuseumMarker museums={museums} selectedId={selectedId} onSelect={setSelectedId} setIsList={setIsList} location={location} isShowLocation={showLocation} />
      </MapContainer>
      <DetailInfo museumId={selectedId} onSelect={setSelectedId} museums={museums} isList={isList} setIsList={setIsList} isFetching={isFetching} />
    </div>
  );
}
