"use client"

import CalendarGrid from "./CalendarGrid";
import CollaborationDetailPanel from "./CollaborationDetailPanel";
import { useState } from "react";

export default function CalendarView({ collaborationsData }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const [currentMonth, setCurrentMonth] = useState(new Date(year, month, 1));

    return (
        <div className="grid grid-cols-[2fr_1fr] h-full">
            <CalendarGrid currentMonth={currentMonth} onSetCurrentMonth={setCurrentMonth} collaborationsData={collaborationsData} />
            <CollaborationDetailPanel />
        </div>
    );
}