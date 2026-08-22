// 詳細ページのサイドバーに表示する、単一マーカーのミニマップ。
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { museumIcon } from "../map/museumIcon";

export default function MuseumMiniMap({
    lat,
    lng,
    name,
}: {
    lat: number;
    lng: number;
    name: string;
}) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            attributionControl={true}
            className="map-tone-muted h-[200px] w-full"
        >
            <TileLayer
                attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={museumIcon} alt={name} interactive={false} />
        </MapContainer>
    );
}
