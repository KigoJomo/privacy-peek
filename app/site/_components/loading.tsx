import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <section
        className="min-h-[90vh] flex flex-col gap-6"
        aria-busy="true"
        aria-live="polite"
      >
        <h2 className="sr-only">Loading site details…</h2>
        <div className="w-full flex items-center gap-4 justify-between">
          <Skeleton className="h-8 w-48 rounded" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      </section>
    </>
  );
}
