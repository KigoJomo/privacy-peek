import { Skeleton } from "@/components/ui/skeleton";

export default function SitesLoading() {
  return (
    <section className="flex flex-col gap-6 min-h-[60dvh]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-9 w-28 rounded" />
        </div>
        <Skeleton className="h-5 w-72 rounded" />
      </div>

      <Skeleton className="h-12 w-full max-w-md rounded-xl" />

      <div className="flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      <div className="hidden xl:block overflow-hidden rounded-xl border">
        <div className="divide-y">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-5 w-48 rounded" style={{ animationDelay: `${i * 0.04}s` }} />
              <Skeleton className="h-5 w-24 rounded" style={{ animationDelay: `${i * 0.04}s` }} />
              <Skeleton className="h-5 w-20 rounded ml-auto" style={{ animationDelay: `${i * 0.04}s` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:hidden">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-24 rounded-xl"
            style={{ animationDelay: `${i * 0.06}s` }}
          />
        ))}
      </div>
    </section>
  );
}
