import dynamic from "next/dynamic";
import { getMuseums } from "@/lib/museums";
import MapLoader from "@/components/map/MapLoader";

export default async function Home() {
  const museums = await getMuseums();
  return (
    <div className="h-dvh w-dvw">
      <MapLoader museums={museums} />
    </div>
  );
}
