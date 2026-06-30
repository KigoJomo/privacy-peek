import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  getOverallScoreDisplay,
  getCategoryScoreDisplay,
} from "@/lib/utils";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h3>Comparison unavailable</h3>
        <p className="text-muted-foreground text-center max-w-md">
          The comparison feature requires the database to be connected.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to home
        </Link>
      </section>
    );
  }

  const { ids } = await searchParams;

  if (!ids) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h3>No sites selected</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Select sites from the home page to compare their privacy scores
          side by side.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Browse recent analyses
        </Link>
      </section>
    );
  }

  const siteIds = ids.split(",").filter(Boolean) as Id<"sites">[];

  if (siteIds.length < 2) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h3>Compare at least 2 sites</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Select two or more sites to see their privacy scores side by side.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to home
        </Link>
      </section>
    );
  }

  let sites;
  try {
    sites = await Promise.all(
      siteIds.map((id) =>
        fetchQuery(api.sites.getFullSiteDetails, { site_id: id }),
      ),
    );
  } catch {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h3>Could not load comparison</h3>
        <p className="text-muted-foreground text-center max-w-md">
          The analysis service may be unavailable. Try refreshing the page.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to home
        </Link>
      </section>
    );
  }

  const validSites = sites.filter(
    (s): s is NonNullable<typeof s> => s !== undefined && s !== null,
  );

  if (validSites.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h3>Sites not found</h3>
        <p className="text-muted-foreground">
          None of the selected sites could be loaded.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to home
        </Link>
      </section>
    );
  }

  const gridCols =
    validSites.length <= 2
      ? "md:grid-cols-2"
      : validSites.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2 xl:grid-cols-4";

  // Find the best overall score for highlighting
  const bestScore = Math.max(
    ...validSites.map((s) => getOverallScoreDisplay(s.overall_score)),
  );

  return (
    <>
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-10 shrink-0",
            )}
            aria-label="Back to home"
          >
            <ArrowLeftIcon className="size-5" />
          </Link>
          <div>
            <h2>Privacy Score Comparison</h2>
            <p className="text-muted-foreground text-sm">
              Side-by-side comparison of {validSites.length} site
              {validSites.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 gap-4 md:gap-6", gridCols)}>
          {validSites.map((site) => {
            const safeOverall = getOverallScoreDisplay(site.overall_score);
            const isWinner = safeOverall === bestScore;
            const safeCategories = (site.category_scores ?? []).map((c) => ({
              ...c,
              category_score: getCategoryScoreDisplay(c.category_score),
            }));

            return (
              <div
                key={site._id}
                className={cn(
                  "relative bg-card rounded-3xl border p-6 flex flex-col gap-5 transition-shadow",
                  "hover:shadow-lg",
                  isWinner && validSites.length > 1 && "border-chart-1/40",
                )}
              >
                {isWinner && validSites.length > 1 && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-chart-1 text-white dark:text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Best
                  </span>
                )}

                <div className="flex flex-col items-center gap-2 pt-1">
                  <ScoreVisualizer
                    value={safeOverall / 100}
                    size={112}
                    displayNumber={`${safeOverall}`}
                  />
                  <Link
                    href={`/site/${site._id}`}
                    className="hover:underline text-center leading-tight"
                  >
                    <h4 className="!leading-tight">{site.site_name}</h4>
                  </Link>
                  <Link
                    href={site.normalized_base_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground truncate max-w-full hover:underline"
                  >
                    {site.normalized_base_url
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Score: {safeOverall}/100
                  </span>
                </div>

                <div className="space-y-1.5 border-t pt-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Category Breakdown
                  </p>
                  {safeCategories.map((cat) => (
                    <div
                      key={cat.category_name}
                      className="flex items-center justify-between gap-2 py-0.5"
                    >
                      <span className="text-xs text-muted-foreground truncate">
                        {cat.category_name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${cat.category_score * 10}%`,
                              backgroundColor:
                                cat.category_score > 6
                                  ? "hsl(142, 76%, 36%)"
                                  : cat.category_score > 4
                                    ? "hsl(38, 92%, 50%)"
                                    : "hsl(0, 84%, 60%)",
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums w-8 text-right text-muted-foreground">
                          {cat.category_score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl animate-blob-pulse" />
      <div className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl animate-blob-pulse" style={{ animationDelay: '-4s' }} />
    </>
  );
}
