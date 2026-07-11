import dynamic from "next/dynamic";
import { getMuseums } from "@/lib/museums";
import MapLoader from "@/components/map/MapLoader";
import { Noto_Serif_JP } from "next/font/google";

const notoSerifJP = Noto_Serif_JP({
  weight: ["500", "700"],
  subsets: ["latin"],
});

export default async function Home() {
  const museums = await getMuseums();
  return (
    <div className="h-dvh w-dvw">
      <header className="flex items-center h-16 px-4">
        <h1 className={`${notoSerifJP.className} text-3xl font-bold text-neutral-100 tracking-wide`}>
          でん同士美術館マップ🐚
        </h1>
      </header>
      <div className="grid grid-cols-[2fr_1fr] h-dvh">
        <MapLoader museums={museums} />
        <div className="bg-neutral-800">
          <h1 className={`${notoSerifJP.className} text-neutral-100`}>詳細コンポーネント</h1>
        </div>
      </div>

    </div>
  );
}
