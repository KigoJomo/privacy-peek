import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequireOnly, SiteDetails } from "@/convex/lib";
import {
  cn,
  formatRelativeTime,
  getAnalysisFreshnessLabel,
  isAnalysisStale,
} from "@/lib/utils";
import Link from "next/link";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import { FunctionReturnType } from "convex/server";

type RecentSite = FunctionReturnType<typeof api.sites.getRecentSites>[number];

export default async function RecentSites() {
  const recent_sites: RecentSite[] = await fetchQuery(
    api.sites.getRecentSites,
    {limit: 32},
  );

  return (
    <section className="flex flex-col gap-2 border-t">
      <h4>Recently Analyzed</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {recent_sites &&
          recent_sites.map((site) => (
            <SiteCard key={site._id} site_details={site} />
          ))}
      </div>
    </section>
  );
}

export function SiteCard({
  site_details,
}: {
  site_details: RequireOnly<
    SiteDetails,
    | "_id"
    | "normalized_base_url"
    | "site_name"
    | "overall_score"
    | "reasoning"
    | "last_analyzed"
    | "category_scores"
  >;
}) {
  const {
    _id,
    normalized_base_url,
    site_name,
    overall_score,
    last_analyzed,
    category_scores,
  } = site_details;
  const staleAnalysis = isAnalysisStale(last_analyzed);
  const freshnessLabel = getAnalysisFreshnessLabel(last_analyzed);
  const domainLabel = normalized_base_url.replace(/^https?:\/\//, "");
  return (
    <Link
      href={`/site/${_id}`}
      className={cn(
        "!no-underline border-b-4",
        "rounded-xl transition-all",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        "hover:border-ring hover:ring-ring/50 hover:ring-[3px]",
      )}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>
                <h4>{site_name}</h4>
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="truncate">{domainLabel}</span>
                <span>Analyzed {formatRelativeTime(last_analyzed)}</span>
                {freshnessLabel ? <span>{freshnessLabel}</span> : null}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-2">
              {staleAnalysis ? (
                <Badge variant="secondary" className="border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200">
                  Stale analysis
                </Badge>
              ) : null}
              <CardAction className="flex items-center gap-2">
                <span className="text-sm">Overall Score /100</span>
                <ScoreVisualizer
                  value={(overall_score ?? 0) / 100}
                  displayNumber={overall_score.toFixed(0)}
                  className="md:mr-1"
                />
              </CardAction>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <span className="-mt-2 text-center text-muted-foreground">
            Category Scores (/10)
          </span>
          {category_scores.map((catg, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
              aria-label={`${catg.category_name} score ${catg.category_score} out of 10`}
            >
              <p className="truncate text-base!">{catg.category_name}</p>
              <ScoreVisualizer
                value={(catg.category_score ?? 0) / 10}
                size={32}
                displayNumber={catg.category_score}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </Link>
  );
}
