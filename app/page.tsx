import MuseumMapClient from "@/components/museum/MuseumMapClient";
import { getMuseums } from "@/lib/museums";

export default async function Home({ searchParams }: { searchParams: Promise<{ museumId?: string }> }) {
  const museums = await getMuseums();
  const { museumId } = await searchParams;

  return <MuseumMapClient museums={museums} initialSelectedId={museumId ?? null} />;
}
