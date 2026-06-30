import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <section
        className="min-h-[90vh] flex flex-col gap-6 max-w-4xl mx-auto w-full"
        aria-busy="true"
        aria-live="polite"
      >
        <h2 className="sr-only">Loading site details…</h2>

        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Title and score area */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Category cards skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-36 rounded" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-3xl flex flex-col gap-3 border"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
