"use client"

import { useEffect, useState } from "react";
import { fetchAllFacilityTypes } from "@/lib/actions/facilityType";
import { REGIONS, type Region } from "@/lib/regions";
import type { FilterState } from "@/types/museum";

type FacilityType = { id: number; name: string };

const INITIAL_FILTER: FilterState = {
    searchText: "",
    regions: [...REGIONS],
    typeIds: [1, 2],
    hasCollaboration: true,
    hasNotCollaboration: true,
    sortBy: "name",
    sortOrder: "asc",
};

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`border px-2.5 py-1 text-[12px] transition-colors cursor-pointer ${active
                ? "border-accent/70 bg-accent-soft text-accent"
                : "border-line text-muted hover:border-ink/30 hover:text-ink"
                }`}
        >
            {label}
        </button>
    );
}

export default function Filter({ filterState, onChange }: { filterState: FilterState, onChange: React.Dispatch<React.SetStateAction<FilterState>> }) {
    const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);

    useEffect(() => {
        fetchAllFacilityTypes().then(setFacilityTypes);
    }, []);

    const toggleRegion = (region: Region) => {
        onChange((prev) => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter((r) => r !== region)
                : [...prev.regions, region],
        }));
    };

    const toggleType = (typeId: number) => {
        onChange((prev) => ({
            ...prev,
            typeIds: prev.typeIds.includes(typeId)
                ? prev.typeIds.filter((t) => t !== typeId)
                : [...prev.typeIds, typeId],
        }));
    };

    return (
        <div className="border-b border-line px-4 pb-4 pt-4 md:px-6 md:pt-6">
            <label htmlFor="q" className="mb-2 block text-[11px] tracking-[.14em] text-faint">キーワード</label>
            <div className="flex items-center gap-2 border-b border-ink/20 pb-2 focus-within:border-accent">
                <input
                    id="q"
                    type="search"
                    placeholder="美術館名・地名で検索"
                    value={filterState.searchText}
                    onChange={(e) => onChange((prev) => ({ ...prev, searchText: e.target.value }))}
                    className="w-full bg-transparent text-[15px] placeholder:text-faint focus:outline-none"
                />
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-faint" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>

            <fieldset className="mt-5">
                <legend className="mb-2 text-[11px] tracking-[.14em] text-faint">地域</legend>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="地域で絞り込む">
                    {REGIONS.map((region) => (
                        <Chip key={region} label={region} active={filterState.regions.includes(region)} onClick={() => toggleRegion(region)} />
                    ))}
                </div>
            </fieldset>

            <fieldset className="mt-4">
                <legend className="mb-2 text-[11px] tracking-[.14em] text-faint">種別</legend>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="種別で絞り込む">
                    {facilityTypes.map((t) => (
                        <Chip key={t.id} label={t.name} active={filterState.typeIds.includes(t.id)} onClick={() => toggleType(t.id)} />
                    ))}
                </div>
            </fieldset>

            <fieldset className="mt-4">
                <legend className="mb-2 text-[11px] tracking-[.14em] text-faint">コラボ</legend>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="コラボの有無で絞り込む">
                    <Chip
                        label="コラボあり"
                        active={filterState.hasCollaboration}
                        onClick={() => onChange((prev) => ({ ...prev, hasCollaboration: !prev.hasCollaboration }))}
                    />
                    <Chip
                        label="コラボなし（紹介のみ）"
                        active={filterState.hasNotCollaboration}
                        onClick={() => onChange((prev) => ({ ...prev, hasNotCollaboration: !prev.hasNotCollaboration }))}
                    />
                </div>
            </fieldset>

            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => onChange(INITIAL_FILTER)}
                    className="text-[12px] text-muted underline decoration-line underline-offset-4 hover:text-ink cursor-pointer"
                >
                    条件をクリア
                </button>
            </div>
        </div>
    );
}
