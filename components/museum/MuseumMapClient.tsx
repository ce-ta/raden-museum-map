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
        <>
            <Filter filterState={filterState} onChange={setFilterState} />
            <MapLoader museums={museums} isFetching={isFetching} />
        </>
    );
}
