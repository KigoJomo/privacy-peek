import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartNoAxesColumnIncreasing,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { getOverallScoreDisplay } from "@/lib/utils";

export default async function QuickStats() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null;
  }

  let stats: {
    total: number;
    avgScore: number;
    staleCount: number;
    scoreDistribution: number[];
    categoryAverages: { category_name: string; avg_score: number }[];
    bestSites: { _id: string; site_name: string; overall_score: number }[];
    worstSites: { _id: string; site_name: string; overall_score: number }[];
  };

  try {
    stats = await fetchQuery(api.sites.getDashboardStats);
  } catch {
    console.warn(
      "Failed to fetch dashboard stats — Convex may be unreachable.",
    );
    return null;
  }

  if (stats.total === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4>Privacy Snapshot</h4>
        <p className="text-sm text-muted-foreground">
          Quick overview of all analyzed sites.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Sites */}
        <Card className="border-t-4 border-t-chart-1 shadow-sm">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 text-chart-1 mb-2">
              <ChartNoAxesColumnIncreasing className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">
              {stats.total}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              sites analyzed
            </p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card className="border-t-4 border-t-chart-2 shadow-sm">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 text-chart-2 mb-2">
              <Shield className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Avg Score
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">
              {Number.isFinite(stats.avgScore)
                ? stats.avgScore.toFixed(1)
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">out of 100</p>
          </CardContent>
        </Card>

        {/* Stale Count */}
        <Card className="border-t-4 border-t-destructive shadow-sm">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Stale
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">
              {stats.staleCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stats.staleCount === 1
                ? "site needs update"
                : stats.staleCount > 0
                  ? "sites need updates"
                  : "all up to date"}
            </p>
          </CardContent>
        </Card>

        {/* Best Score */}
        <Card className="border-t-4 border-t-chart-3 shadow-sm">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 text-chart-3 mb-2">
              <TrendingUp className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Best Score
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-chart-3">
              {stats.bestSites.length > 0
                ? getOverallScoreDisplay(stats.bestSites[0].overall_score)
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-full">
              {stats.bestSites.length > 0
                ? stats.bestSites[0].site_name
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick navigation links */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/sites"
          className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          Browse all sites &rarr;
        </Link>
        <span className="text-muted-foreground/30">·</span>
        <Link
          href="/dashboard"
          className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          View full dashboard &rarr;
        </Link>
        {stats.staleCount > 0 && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <Link
              href="/stale"
              className="text-xs inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              <AlertTriangle className="size-3" />
              Refresh {stats.staleCount} stale
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
