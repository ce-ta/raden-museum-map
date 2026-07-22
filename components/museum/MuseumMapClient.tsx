"use client"

import { useState, useEffect } from "react";
import Filter from "@/components/filter/Filter";
import MapLoader from "@/components/map/MapLoader";
import type { FilterState, MuseumMapItem } from "@/types/museum";
import { fetchFilterMuseums } from "@/lib/actions/museum";
import { distanceKm } from "@/lib/geo";

export default function MuseumMapClient({ museums: initialMuseums, initialSelectedId }: { museums: MuseumMapItem[], initialSelectedId: string | null }) {
    const [museums, onSetMuseums] = useState<MuseumMapItem[]>(initialMuseums);
    const [isFetching, setIsFetching] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const [filterState, setFilterState] = useState<FilterState>({
        searchText: "",
        prefectureCode: null,
        hasCollaboration: true,
        hasNotCollaboration: true,
        sortBy: 'name'
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

    return (
        <div className="flex flex-col h-full min-h-0">
            <Filter filterState={filterState} onChange={setFilterState} />
            <div className="flex-1 min-h-0">
                <MapLoader museums={displayMuseums} isFetching={isFetching} initialSelectedId={initialSelectedId} />
            </div>
        </div>
    );
}
