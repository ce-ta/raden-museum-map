"use client"

import { useState, useEffect } from "react";
import Filter from "@/components/filter/Filter";
import MapLoader from "@/components/map/MapLoader";
import type { FilterState, MuseumMapItem } from "@/types/museum";
import { fetchFilterMuseums } from "@/lib/actions/museum";

export default function MuseumMapClient({ museums: initialMuseums }: { museums: MuseumMapItem[] }) {
    const [museums, onSetMuseums] = useState<MuseumMapItem[]>(initialMuseums);
    const [isFetching, setIsFetching] = useState(false);

    const [filterState, setFilterState] = useState<FilterState>({
        searchText: "",
        prefectureCode: null,
        hasCollaboration: true,
        hasNotCollaboration: true,
    });

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
                <MapLoader museums={museums} isFetching={isFetching} />
            </div>
        </div>
    );
}
