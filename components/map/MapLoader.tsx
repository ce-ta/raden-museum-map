// 将来、propsを増やしてもMapLoaderを経由するだけで、中間コードを増やさないようにする
"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default MapView;