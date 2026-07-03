"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import {
  ArrowLeft,
  BarChart3,
  ChartNoAxesColumnIncreasing,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  LoaderCircle,
  Layers,
} from "lucide-react";

type ScoreBucket = "critical" | "poor" | "fair" | "good" | "excellent";

const BUCKET_CONFIG: Record<
  ScoreBucket,
  { label: string; range: string; color: string; barColor: string }
> = {
  critical: {
    label: "Critical",
    range: "0–19",
    color: "text-destructive",
    barColor: "bg-destructive",
  },
  poor: {
    label: "Poor",
    range: "20–39",
    color: "text-orange-500 dark:text-orange-400",
    barColor: "bg-orange-500",
  },
  fair: {
    label: "Fair",
    range: "40–59",
    color: "text-amber-500 dark:text-amber-400",
    barColor: "bg-amber-500",
  },
  good: {
    label: "Good",
    range: "60–79",
    color: "text-lime-500 dark:text-lime-400",
    barColor: "bg-lime-500",
  },
  excellent: {
    label: "Excellent",
    range: "80–100",
    color: "text-chart-1",
    barColor: "bg-chart-1",
  },
};

export default function InsightsPage() {
  const insights = useQuery(api.sites.getInsights);

  if (insights === undefined) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60dvh] gap-4">
        <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground animate-pulse">Crunching numbers...</p>
      </section>
    );
  }

  const maxBucket = insights.total > 0
    ? Math.max(
        ...Object.values(insights.scoreDistribution).map(Number),
      )
    : 1;

  const categoryMax = insights.categoryAverages.length > 0
    ? Math.max(...insights.categoryAverages.map((c) => c.avgScore), 1)
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="flex flex-col gap-6 min-h-[60dvh]">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h2 className="leading-none">Insights</h2>
          </div>
          <p className="tagline text-muted-foreground">
            See the big picture — how all analyzed sites compare across categories and score ranges.
          </p>
        </div>

        {/* Empty state */}
        {insights.total === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground"
          >
            <BarChart3 className="size-12 opacity-40" />
            <div className="max-w-sm">
              <p className="font-medium text-foreground">No data yet</p>
              <p className="text-sm">
                Analyze some sites first, then come back here to discover trends and patterns
                across the privacy landscape.
              </p>
            </div>
          </motion.div>
        )}

        {insights.total > 0 && (
          <>
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <Card className="border-b-4">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Layers className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Total</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">{insights.total}</p>
                  <p className="text-xs text-muted-foreground">analyzed sites</p>
                </CardContent>
              </Card>

              <Card className="border-b-4">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <ChartNoAxesColumnIncreasing className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Average</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">{insights.avgScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">overall /100</p>
                </CardContent>
              </Card>

              {insights.strongestCategory && (
                <Card className="border-b-4 border-chart-1/40">
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center gap-2 text-chart-1 mb-1">
                      <TrendingUp className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Strongest</span>
                    </div>
                    <p className="text-lg font-bold truncate">{insights.strongestCategory.category_name}</p>
                    <p className="text-xs text-muted-foreground">
                      avg {insights.strongestCategory.avgScore.toFixed(1)}/10
                    </p>
                  </CardContent>
                </Card>
              )}

              {insights.weakestCategory && (
                <Card className="border-b-4 border-destructive/40">
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center gap-2 text-destructive mb-1">
                      <TrendingDown className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Weakest</span>
                    </div>
                    <p className="text-lg font-bold truncate">{insights.weakestCategory.category_name}</p>
                    <p className="text-xs text-muted-foreground">
                      avg {insights.weakestCategory.avgScore.toFixed(1)}/10
                    </p>
                  </CardContent>
                </Card>
              )}

              {insights.staleCount > 0 && (
                <Card className="border-b-4 border-amber-500/40">
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                      <AlertTriangle className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Stale</span>
                    </div>
                    <p className="text-2xl font-bold tabular-nums">{insights.staleCount}</p>
                    <p className="text-xs text-muted-foreground">need refresh</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-muted-foreground" />
                  <h5>Score Distribution</h5>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                  {(Object.entries(BUCKET_CONFIG) as [ScoreBucket, typeof BUCKET_CONFIG[ScoreBucket]][]).map(
                    ([key, config]) => {
                      const count = insights.scoreDistribution[key] ?? 0;
                      const pct = insights.total > 0 ? (count / insights.total) * 100 : 0;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-20 shrink-0">
                            <span className={cn("text-xs font-medium", config.color)}>
                              {config.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground ml-1">
                              {config.range}
                            </span>
                          </div>
                          <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className={cn("h-full rounded-full transition-all", config.barColor)}
                              style={{ minWidth: count > 0 ? "4px" : undefined }}
                            />
                          </div>
                          <span className="w-12 text-right text-xs tabular-nums text-muted-foreground shrink-0">
                            {count}
                            <span className="text-[10px] ml-0.5">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </motion.div>

              {/* Category Averages */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5"
              >
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumnIncreasing className="size-4 text-muted-foreground" />
                  <h5>Category Performance</h5>
                </div>
                <Separator />
                {insights.categoryAverages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No category data available yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {insights.categoryAverages.map((cat, i) => {
                      const pct = (cat.avgScore / categoryMax) * 100;
                      const isStrongest =
                        insights.strongestCategory?.category_name === cat.category_name;
                      const isWeakest =
                        insights.weakestCategory?.category_name === cat.category_name;
                      return (
                        <div key={cat.category_name} className="flex items-center gap-3">
                          <div className="w-44 shrink-0 flex items-center gap-1.5">
                            <span className="text-xs truncate">{cat.category_name}</span>
                            {isStrongest && (
                              <TrendingUp className="size-3 text-chart-1 shrink-0" />
                            )}
                            {isWeakest && (
                              <TrendingDown className="size-3 text-destructive shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.6,
                                delay: 0.25 + i * 0.08,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={cn(
                                "h-full rounded-full transition-all",
                                isStrongest && "bg-chart-1",
                                isWeakest && "bg-destructive",
                                !isStrongest && !isWeakest && "bg-primary/60",
                              )}
                              style={{ minWidth: "4px" }}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 w-16 shrink-0 justify-end">
                            <ScoreVisualizer
                              value={cat.avgScore / 10}
                              displayNumber=""
                              size={20}
                            />
                            <span className="text-xs font-mono tabular-nums text-muted-foreground">
                              {cat.avgScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex items-center gap-3 flex-wrap text-sm"
            >
              <Link
                href="/sites"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Browse all sites &rarr;
              </Link>
              {insights.staleCount > 0 && (
                <Link
                  href="/stale"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors underline underline-offset-4"
                >
                  Refresh {insights.staleCount} stale analysis
                  {insights.staleCount !== 1 ? "es" : ""} &rarr;
                </Link>
              )}
            </motion.div>
          </>
        )}
      </section>
    </motion.div>
  );
}
