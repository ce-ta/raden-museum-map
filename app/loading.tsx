import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="flex h-full flex-col md:flex-row" aria-busy="true">
            <div className="flex min-h-0 flex-1 flex-col border-line md:w-[400px] md:flex-none md:border-r">
                <div className="space-y-3 border-b border-line px-4 py-4 md:px-6">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="min-h-0 flex-1 divide-y divide-line overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-4 px-4 py-4 md:px-6">
                            <Skeleton className="h-[68px] w-[68px] flex-none" />
                            <div className="flex-1 space-y-2 pt-1">
                                <Skeleton className="h-2.5 w-1/2" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-2.5 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Skeleton className="hidden flex-1 md:block" />
        </div>
    );
}