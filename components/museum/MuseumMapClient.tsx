"use client"

import { useState, useEffect } from "react";
import Filter from "@/components/filter/Filter";
import MuseumList from "@/components/museum/MuseumList";
import MuseumSummaryCard from "@/components/museum/MuseumSummaryCard";
import MapLoader from "@/components/map/MapLoader";
import type { FilterState, MuseumMapItem } from "@/types/museum";
import { fetchFilterMuseums } from "@/lib/actions/museum";
import { distanceKm } from "@/lib/geo";
import { REGIONS } from "@/lib/regions";

export default function MuseumMapClient({ museums: initialMuseums, initialSelectedId }: { museums: MuseumMapItem[], initialSelectedId: string | null }) {
    const [museums, onSetMuseums] = useState<MuseumMapItem[]>(initialMuseums);
    const [isFetching, setIsFetching] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
    const [showMapMobile, setShowMapMobile] = useState(!!initialSelectedId);

    const [filterState, setFilterState] = useState<FilterState>({
        searchText: "",
        regions: [...REGIONS],
        typeIds: [1, 2],
        hasCollaboration: true,
        hasNotCollaboration: true,
        sortBy: 'name',
        sortOrder: 'asc'
    });

    useEffect(() => {
        if (filterState.sortBy !== "distance" || userLocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => {
                setFilterState((prev) => ({ ...prev, sortBy: "name" }));
            }
        );
    }, [filterState.sortBy, userLocation]);

    const displayMuseums = filterState.sortBy === "distance" && userLocation
        ? [...museums].sort((a, b) => distanceKm(userLocation, a) - distanceKm(userLocation, b))
        : museums;

    useEffect(() => {
        const load = async () => {
            setIsFetching(true);
            const result = await fetchFilterMuseums(filterState);
            onSetMuseums(result);
            setIsFetching(false);
        }
        load();
    }, [filterState])

    const handleSelect = (id: string) => {
        setSelectedId(id);
        setShowMapMobile(true);
    };

    return (
        <div className="flex h-full flex-col md:flex-row">
            <aside
                id="panel"
                className={`min-h-0 flex-1 flex-col border-line bg-panel md:flex md:w-[400px] md:flex-none md:border-r ${showMapMobile ? "hidden md:flex" : "flex"
                    }`}
            >
                <Filter filterState={filterState} onChange={setFilterState} />
                <MuseumList
                    museums={displayMuseums}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    isFetching={isFetching}
                    filterState={filterState}
                    onChange={setFilterState}
                />
            </aside>

            <main className={`relative min-h-0 flex-1 ${showMapMobile ? "block" : "hidden md:block"}`}>
                <MapLoader museums={displayMuseums} selectedId={selectedId} onSelect={handleSelect} location={userLocation} />

                {selectedId && (
                    <MuseumSummaryCard
                        museumId={selectedId}
                        onClose={() => setSelectedId(null)}
                    />
                )}

                <div className="absolute bottom-4 left-1/2 z-[500] flex -translate-x-1/2 overflow-hidden border border-line bg-panel shadow-sm md:hidden">
                    <button
                        type="button"
                        onClick={() => setShowMapMobile(false)}
                        className={`px-4 py-2 text-[12px] cursor-pointer ${!showMapMobile ? "bg-accent text-[#17131f] font-medium" : "text-muted"}`}
                    >
                        一覧
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMapMobile(true)}
                        className={`border-l border-line px-4 py-2 text-[12px] cursor-pointer ${showMapMobile ? "bg-accent text-[#17131f] font-medium" : "text-muted"}`}
                    >
                        地図
                    </button>
                </div>
            </main>
        </div>
    );
}
