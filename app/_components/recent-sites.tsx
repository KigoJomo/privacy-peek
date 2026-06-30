import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import { CompareSection } from "./compare-section";
import { Suspense } from "react";

export default async function RecentSites() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null;
  }

  const recent_sites = await fetchQuery(api.sites.getRecentSites, {
    limit: 32,
  });

  return (
    <section className="flex flex-col gap-4 border-t pt-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h4>Recently Analyzed</h4>
          <p className="text-sm text-muted-foreground">
            {recent_sites.length > 0
              ? `${recent_sites.length} recent scans. Select two or more to compare scores side by side.`
              : "No sites have been analyzed yet. Search for a site above to get started."}
          </p>
        </div>
      </div>

      {recent_sites.length > 0 ? (
        <Suspense
          fallback={
            <div className="w-full rounded-2xl border border-dashed px-6 py-12 text-center text-muted-foreground">
              Loading sites...
            </div>
          }
        >
          <CompareSection sites={recent_sites} />
        </Suspense>
      ) : (
        <div className="w-full rounded-2xl border border-dashed px-6 py-12 text-center text-muted-foreground">
          No analyses yet. Type an app or URL above to get started.
        </div>
      )}
    </section>
  );
}
