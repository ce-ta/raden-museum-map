import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="grid grid-cols-[2fr_1fr] h-full" aria-busy="true">
            {/* 左：カレンダー */}
            <div className="flex flex-col h-full border-r border-neutral-700 p-4">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-32 rounded" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
                <Skeleton className="flex-1 rounded-lg" />
            </div>

            {/* 右：詳細パネル */}
            <div className="ml-2 h-full flex flex-col min-h-0">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="flex-1" />
            </div>
        </div>
    );
}