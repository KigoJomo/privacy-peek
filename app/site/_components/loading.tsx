import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-24"
      aria-busy="true"
      aria-live="polite"
    >
      <h2 className="sr-only">Loading site details…</h2>

      <div className="w-full md:col-span-2 flex flex-col gap-6">
        {/* Title area */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Category scores */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32 rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))}
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="w-full md:col-span-1 flex flex-col items-center gap-6">
        <Skeleton className="size-64 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </section>
  );
}
