"use client"

import CalendarGrid from "./CalendarGrid";
import CollaborationDetailPanel from "./CollaborationDetailPanel";
import { useState, useEffect } from "react";
import type { Collaboration } from "@/types/museum";
import { fetchCollaboDetail } from "@/lib/actions/museum";

export default function CalendarView({ collaborationsData }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const [currentMonth, setCurrentMonth] = useState(new Date(year, month, 1));
    const [collaboId, setCollaboId] = useState<string | null>(null);
    const [detailCollabo, setDetailCollabo] = useState<Collaboration | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!collaboId) {
            setDetailCollabo(null);
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            const result = await fetchCollaboDetail(collaboId);
            setDetailCollabo(result);
            setIsLoading(false);
        }
        loadData();
    }, [collaboId])

    return (
        <div className="grid grid-cols-[2fr_1fr] h-full">
            <CalendarGrid currentMonth={currentMonth} onSetCurrentMonth={setCurrentMonth} collaborationsData={collaborationsData} onSelectCollabo={setCollaboId} />
            <CollaborationDetailPanel detailCollabo={detailCollabo} loading={isLoading} />
        </div>
    );
}