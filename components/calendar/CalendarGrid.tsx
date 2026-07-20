import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, format, isSameDay } from "date-fns";
import type { Collaboration } from "@/types/museum";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

function getWeekSegment(week: Date[], collab: Collaboration) {
    if (!collab.startDate || !collab.endDate) return null;
    const weekStart = week[0];
    const weekEnd = week[6];
    if (collab.endDate < weekStart || collab.startDate > weekEnd) return null;

    const segStart = collab.startDate < weekStart ? weekStart : collab.startDate;
    const segEnd = collab.endDate > weekEnd ? weekEnd : collab.endDate;

    return {
        collab,
        startCol: week.findIndex((d) => isSameDay(d, segStart)),
        endCol: week.findIndex((d) => isSameDay(d, segEnd)),
    };
}

export default function CalendarGrid({ currentMonth, onSetCurrentMonth, collaborationsData, onSelectCollabo }: { currentMonth: Date, onSetCurrentMonth: any, collaborationsData: Collaboration[], onSelectCollabo: any }) {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 日曜始まり
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    const weeks: Date[][] = [];

    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // 月全体で開始日順に並べ、空いているレーンを使い回しながら「コラボごとに固定のレーン番号」を割り当てる
    const laneByCollabId = new Map<string, number>();
    const laneEndDate: Date[] = [];

    collaborationsData
        .filter((c) => c.startDate && c.endDate)
        .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime())
        .forEach((collab) => {
            let lane = laneEndDate.findIndex((endDate) => endDate < collab.startDate!);
            if (lane === -1) {
                lane = laneEndDate.length;
            }
            laneEndDate[lane] = collab.endDate!;
            laneByCollabId.set(collab.id, lane);
        });

    return (
        <div className="flex flex-col h-full border-r border-neutral-700 bg-neutral-900 p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm border border-neutral-600 text-neutral-100 cursor-pointer hover:border-neutral-400"
                    onClick={() => onSetCurrentMonth(subMonths(currentMonth, 1))}
                >
                    ＜ 前月
                </button>
                <h2 className="text-lg font-bold text-neutral-100"><span>{currentMonth.getFullYear()}</span>年<span>{currentMonth.getMonth() + 1}</span>月</h2>
                <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm border border-neutral-600 text-neutral-100 cursor-pointer hover:border-neutral-400"
                    onClick={() => onSetCurrentMonth(addMonths(currentMonth, 1))}
                >
                    次月 ＞
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-neutral-400 mb-2">
                {WEEKDAYS.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-1">
                {weeks.map((week, weekIndex) => {
                    const segments = week
                        ? collaborationsData
                            .map((collab) => getWeekSegment(week, collab))
                            .filter((s) => s !== null)
                        : [];

                    return (
                        <div key={weekIndex} className="relative flex-1 grid grid-cols-7 gap-1">
                            {week.map((day, dayIndex) => {
                                const inMonth = isSameMonth(day, currentMonth);
                                return (
                                    <div
                                        key={dayIndex}
                                        className={`rounded-lg border border-neutral-700 p-2 text-sm ${inMonth
                                            ? "bg-neutral-800 text-neutral-100"
                                            : "bg-neutral-900 text-neutral-700"
                                            }`}
                                    >
                                        {format(day, "d")}
                                    </div>
                                );
                            })}

                            {/* 帯レイヤー（日付セルの上に重ねる） */}
                            <div className="absolute inset-x-0 top-9 grid grid-cols-7 gap-1 pointer-events-none">
                                {segments.map(({ collab, startCol, endCol }) => {
                                    const lane = laneByCollabId.get(collab.id)!;
                                    return (
                                        <div
                                            key={collab.id}
                                            className="pointer-events-auto flex items-center h-7 bg-white text-neutral-900 text-xs truncate rounded px-1"
                                            style={{ gridColumn: `${startCol + 1} / ${endCol + 2}`, gridRow: lane + 1 }}
                                            title={collab.title}
                                            onClick={() => onSelectCollabo(collab.id)}
                                        >
                                            {collab.title}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
