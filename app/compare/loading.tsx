import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <section className="flex flex-col gap-8 min-h-[60dvh]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-9 w-44 rounded" />
        </div>
        <Skeleton className="h-5 w-72 rounded" />
      </div>

      <Skeleton className="h-10 w-full max-w-md rounded-xl" />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
    </section>
  );
}
