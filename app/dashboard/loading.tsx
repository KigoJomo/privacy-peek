import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <section className="flex flex-col gap-8 min-h-[60dvh]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-9 w-52 rounded" />
        </div>
        <Skeleton className="h-5 w-80 rounded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-xl"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-80 rounded-xl"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-64 rounded-xl"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </section>
  );
}
