"use client";
import dynamic from "next/dynamic";

const MuseumMiniMap = dynamic(() => import("./MuseumMiniMap"), { ssr: false });

export default MuseumMiniMap;
