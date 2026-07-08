"use client";

import dynamic from "next/dynamic";

// Leaflet は window に依存するため SSR を無効化して読み込む。
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="h-dvh w-dvw">
      <MapView />
    </div>
  );
}
