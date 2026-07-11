// 地図全体を描画するクライアントコンポーネント。
// react-leaflet を使い、美術館の位置をピンで表示する。
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import MuseumMarker from "./MuseumMarker";
import type { MuseumMapItem } from "@/types/museum";

// 日本全体が収まる程度の初期中心座標・ズーム。
const DEFAULT_CENTER: [number, number] = [36.2048, 138.2529];
const DEFAULT_ZOOM = 5;

// 日本周辺から大きく外れてパン・ズームアウトできないようにする範囲。
const JAPAN_BOUNDS: [[number, number], [number, number]] = [
  [20, 122],
  [46, 154],
];

export default function MapView({ museums }: { museums: MuseumMapItem[] }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={5}
      scrollWheelZoom
      maxBounds={JAPAN_BOUNDS}
      maxBoundsViscosity={1}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MuseumMarker museums={museums} />
    </MapContainer>
  );
}
