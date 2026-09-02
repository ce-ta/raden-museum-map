import Link from "next/link";
import { notFound } from "next/navigation";
import { getMuseumDetail, getMuseums } from "@/lib/museums";
import { createGoogleMapUrl } from "@/lib/googleMaps";
import { distanceKm } from "@/lib/geo";
import MuseumMiniMap from "@/components/museum/MuseumMiniMapLoader";
import MuseumReviewsSection from "@/components/museum/MuseumReviewsSection";

export default async function MuseumDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [museum, allMuseums] = await Promise.all([getMuseumDetail(id), getMuseums()]);

    if (!museum) notFound();

    const nearby = allMuseums
        .filter((m) => m.id !== museum.id)
        .map((m) => ({ ...m, distance: distanceKm(museum, m) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    return (
        <div className="mx-auto max-w-[1180px] px-4 pb-24 md:px-8 h-full overflow-y-auto">
            <nav aria-label="パンくず" className="flex items-center gap-2 py-4 text-[11px] text-faint md:py-6">
                <Link href="/" className="text-muted hover:text-ink">マップ</Link>
                <span>/</span>
                <span className="text-muted">{museum.prefecture.name}</span>
                <span>/</span>
                <span className="text-ink">{museum.name}</span>
            </nav>

            <section className="grid gap-3 md:grid-cols-[1.9fr_1fr] md:gap-3">
                {museum.imageUrl ? (
                    <img
                        src={museum.imageUrl}
                        alt={museum.name}
                        className="aspect-[16/10] w-full object-cover md:aspect-[16/9]"
                    />
                ) : (
                    <div className="ph relative aspect-[16/10] w-full md:aspect-[16/9]">
                        <p className="absolute bottom-3 left-3 bg-paper/80 px-2 py-1 font-mono text-[10px] tracking-wider text-muted">
                            画像未登録
                        </p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    <div className="ph relative aspect-[4/3] md:aspect-auto md:h-full" />
                    <div className="ph relative aspect-[4/3] md:aspect-auto md:h-full" />
                </div>
            </section>

            <div className="mt-8 grid gap-12 md:mt-12 md:grid-cols-[1fr_340px] md:gap-14">
                <div className="min-w-0">
                    <p className="text-[11px] tracking-[.16em] text-faint">{museum.prefecture.name}</p>
                    <h1 className="mt-2 font-serif text-[28px] leading-tight tracking-tight md:text-[38px]">
                        {museum.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="border border-accent/70 bg-accent-soft px-2.5 py-1 text-[12px] text-accent">
                            {museum.type.name}
                        </span>
                        {museum.hasCollaboration && (
                            <span className="border border-line px-2.5 py-1 text-[12px] text-muted">
                                公式コラボあり
                            </span>
                        )}
                    </div>

                    <h2 className="mt-12 mb-4 font-serif text-[17px] tracking-wide">基本情報</h2>
                    <dl className="divide-y divide-line border-y border-line text-[13px]">
                        <div className="grid grid-cols-[92px_1fr] gap-4 py-3.5 md:grid-cols-[128px_1fr]">
                            <dt className="text-faint">住所</dt>
                            <dd className="text-ink">{museum.address}</dd>
                        </div>
                        {museum.phone && (
                            <div className="grid grid-cols-[92px_1fr] gap-4 py-3.5 md:grid-cols-[128px_1fr]">
                                <dt className="text-faint">電話</dt>
                                <dd className="text-muted">{museum.phone}</dd>
                            </div>
                        )}
                        <div className="grid grid-cols-[92px_1fr] gap-4 py-3.5 md:grid-cols-[128px_1fr]">
                            <dt className="text-faint">観覧料</dt>
                            <dd className="text-muted">{museum.admissionFee ?? "-"}</dd>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] gap-4 py-3.5 md:grid-cols-[128px_1fr]">
                            <dt className="text-faint">公式サイト</dt>
                            <dd>
                                {museum.websiteUrl ? (
                                    <a
                                        href={museum.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-[#d1c6f0]"
                                    >
                                        {museum.websiteUrl}
                                    </a>
                                ) : (
                                    <span className="text-faint">-</span>
                                )}
                            </dd>
                        </div>
                    </dl>

                    <h2 className="mt-12 mb-4 font-serif text-[17px] tracking-wide">開館時間</h2>
                    <p className="border-y border-line py-3.5 text-[13px] text-muted">
                        {museum.openingHours ?? "情報が登録されていません"}
                    </p>

                    <h2 className="mt-12 mb-4 font-serif text-[17px] tracking-wide">公式コラボ情報</h2>
                    {museum.collaborations.length === 0 ? (
                        <p className="text-[13px] text-faint">コラボ情報はありません</p>
                    ) : (
                        <ul className="divide-y divide-line border-y border-line text-[13px]">
                            {museum.collaborations.map((c) => (
                                <li key={c.id} className="py-3.5 space-y-1">
                                    <p className="text-ink">{c.title}</p>
                                    {c.description && <p className="text-muted leading-relaxed">{c.description}</p>}
                                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] text-accent hover:text-[#d1c6f0]">
                                        出典
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-14">
                        <MuseumReviewsSection museumId={museum.id} reports={museum.reports} />
                    </div>
                </div>

                <aside className="md:sticky md:top-24 md:self-start">
                    <div className="border border-line bg-panel">
                        <MuseumMiniMap lat={museum.lat} lng={museum.lng} name={museum.name} />
                        <div className="border-t border-line p-4">
                            <p className="text-[13px] text-ink">{museum.address}</p>
                            <div className="mt-3 flex gap-2">
                                <Link
                                    href={`/?museumId=${museum.id}`}
                                    className="flex-1 border border-line py-2 text-center text-[12px] text-muted hover:border-ink/30 hover:text-ink"
                                >
                                    マップで見る
                                </Link>
                                <a
                                    href={createGoogleMapUrl(museum.name, museum.address)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 border border-line py-2 text-center text-[12px] text-muted hover:border-ink/30 hover:text-ink"
                                >
                                    GoogleMapで開く
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
                <Link
                    href={`/?museumId=${museum.id}`}
                    className="w-28 border border-line py-3 text-center text-[13px] text-muted"
                >
                    地図で見る
                </Link>
                <a href="#reviewForm" className="flex-1 bg-accent py-3 text-center text-[13px] font-medium text-[#17131f]">
                    感想を書く
                </a>
            </div>
        </div>
    );
}
