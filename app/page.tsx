import MuseumMapClient from "@/components/museum/MuseumMapClient";
import { getMuseums } from "@/lib/museums";

export default async function Home() {
  const museums = await getMuseums();

  return <MuseumMapClient museums={museums} />;
}
