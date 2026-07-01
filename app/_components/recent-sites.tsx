import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequireOnly, SiteDetails } from "@/convex/lib";
import {
  cn,
  formatRelativeTime,
  getAnalysisFreshnessLabel,
  isAnalysisStale,
  getCategoryScoreDisplay,
  getOverallScoreDisplay,
} from "@/lib/utils";
import Link from "next/link";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import { FunctionReturnType } from "convex/server";
import { ArrowUpRightIcon } from "lucide-react";

type RecentSite = FunctionReturnType<typeof api.sites.getRecentSites>[number];

export default async function RecentSites() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null;
  }

  const recent_sites: RecentSite[] = await fetchQuery(
    api.sites.getRecentSites,
    { limit: 32 },
  );

  if (recent_sites.length === 0) {
    return (
      <section className="flex flex-col gap-4 border-t pt-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h4>Recently Analyzed</h4>
            <p className="text-sm text-muted-foreground">
              No sites have been analyzed yet. Search for a site above to get started.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h4>Recently Analyzed</h4>
          <p className="text-sm text-muted-foreground">
            {recent_sites.length} recent scan{recent_sites.length !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden xl:gap-6">
        {recent_sites.map((site, i) => (
          <div
            key={site._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <SiteCard site_details={site} />
          </div>
        ))}
      </div>

      <RecentSitesTable sites={recent_sites} />
    </section>
  );
}

function RecentSitesTable({ sites }: { sites: RecentSite[] }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border xl:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Analyzed</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site, i) => {
            const safeOverallScore = getOverallScoreDisplay(site.overall_score);

            return (
              <TableRow
                key={site._id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <TableCell className="font-medium whitespace-normal">
                  <Link href={`/site/${site._id}`} className="hover:underline">
                    {site.site_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={site.normalized_base_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
                  >
                    <span className="max-w-56 truncate">
                      {getDomainLabel(site.normalized_base_url)}
                    </span>
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {formatRelativeTime(site.last_analyzed)}
                    {isAnalysisStale(site.last_analyzed) && (
                      <Badge variant="secondary" className="border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-[10px] px-1.5 py-0">
                        Stale
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {safeOverallScore.toFixed(0)}/100
                    </span>
                    <ScoreVisualizer
                      value={safeOverallScore / 100}
                      displayNumber={safeOverallScore.toFixed(0)}
                      size={36}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
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

  const safeOverallScore = getOverallScoreDisplay(overall_score);
  const safeCategoryScores = (category_scores ?? []).map((category) => ({
    ...category,
    category_score: getCategoryScoreDisplay(category.category_score),
  }));
  const staleAnalysis = isAnalysisStale(last_analyzed);
  const freshnessLabel = getAnalysisFreshnessLabel(last_analyzed);

  return (
    <Link
      href={`/site/${_id}`}
      className={cn(
        "!no-underline border-b-4",
        "rounded-xl transition-all duration-200",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        "hover:border-ring hover:ring-ring/50 hover:ring-[3px]",
      )}
    >
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>
                <h4>{site_name}</h4>
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="truncate">{getDomainLabel(normalized_base_url)}</span>
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
                  value={safeOverallScore / 100}
                  displayNumber={safeOverallScore.toFixed(0)}
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
          {safeCategoryScores.map((catg, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
              aria-label={`${catg.category_name} score ${catg.category_score} out of 10`}
            >
              <p className="truncate text-base!">{catg.category_name}</p>
              <ScoreVisualizer
                value={catg.category_score / 10}
                size={32}
                displayNumber={catg.category_score}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  );
}

function getDomainLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
