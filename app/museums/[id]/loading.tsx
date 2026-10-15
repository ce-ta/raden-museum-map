import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-[1180px] px-4 pb-24 md:px-8 h-full overflow-y-auto" aria-busy="true">
            <Skeleton className="my-4 h-3 w-48 md:my-6" />
            <section className="grid gap-3 md:grid-cols-[1.9fr_1fr]">
                <Skeleton className="aspect-[16/10] w-full md:aspect-[16/9]" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    <Skeleton className="aspect-[4/3] md:aspect-auto md:h-full" />
                    <Skeleton className="aspect-[4/3] md:aspect-auto md:h-full" />
                </div>
            </section>
            <Skeleton className="mt-8 h-7 w-64" />
            <Skeleton className="mt-4 h-4 w-full max-w-[62ch]" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-[62ch]" />
        </div>
    );
}
