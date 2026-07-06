import { Skeleton } from "@/components/ui/skeleton";

export default function StaleLoading() {
  return (
    <section className="flex flex-col gap-6 min-h-[60dvh]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-9 w-44 rounded" />
        </div>
        <Skeleton className="h-5 w-64 rounded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-xl"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      <Skeleton className="h-10 w-48 rounded-lg" />

      <div className="grid grid-cols-1 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-20 rounded-xl"
            style={{ animationDelay: `${i * 0.06}s` }}
          />
        ))}
      </div>
    </section>
  );
}
