import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <section className="flex flex-col items-center gap-10 md:gap-14">
      <div className="w-full flex flex-col items-center gap-3 text-center">
        <Skeleton className="h-7 w-44 rounded-full" />
        <Skeleton className="h-14 w-72 rounded-lg" />
        <Skeleton className="h-5 w-96 rounded" />
      </div>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-xl"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      <div className="w-full">
        <Skeleton className="h-6 w-44 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-48 rounded-xl"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
