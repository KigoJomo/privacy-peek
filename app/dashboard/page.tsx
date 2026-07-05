"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangle,
  LoaderCircle,
  ListIcon,
  ChartNoAxesColumnIncreasing,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import {
  cn,
  getOverallScoreDisplay,
  getDomainLabel,
} from "@/lib/utils";

const DISTRIBUTION_COLORS: Record<string, string> = {
  "0-19": "hsl(var(--destructive))",
  "20-39": "hsl(var(--destructive) / 0.7)",
  "40-59": "hsl(var(--chart-3))",
  "60-79": "hsl(var(--chart-2))",
  "80-100": "hsl(var(--chart-1))",
};

const CATEGORY_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const stats = useQuery(api.sites.getDashboardStats);
  const allSites = useQuery(api.sites.getSitesBrief, { limit: 200 });

  if (!stats || !allSites) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60dvh] gap-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  const scoreDistData = [
    { name: "0-19", value: stats.scoreDistribution[0], fill: DISTRIBUTION_COLORS["0-19"] },
    { name: "20-39", value: stats.scoreDistribution[1], fill: DISTRIBUTION_COLORS["20-39"] },
    { name: "40-59", value: stats.scoreDistribution[2], fill: DISTRIBUTION_COLORS["40-59"] },
    { name: "60-79", value: stats.scoreDistribution[3], fill: DISTRIBUTION_COLORS["60-79"] },
    { name: "80-100", value: stats.scoreDistribution[4], fill: DISTRIBUTION_COLORS["80-100"] },
  ];

  const categoryData = stats.categoryAverages.map((cat, i) => ({
    name: cat.category_name,
    value: cat.avg_score,
    fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="flex flex-col gap-8 min-h-[60dvh]">
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
            <h2 className="leading-none">Privacy Dashboard</h2>
          </div>
          <p className="tagline text-muted-foreground">
            Visual overview of all analyzed sites — scores, trends, and insights at a glance.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-t-4 border-t-chart-1 shadow-sm">
            <CardContent className="pt-6 pb-4 px-5">
              <div className="flex items-center gap-2 text-chart-1 mb-2">
                <ChartNoAxesColumnIncreasing className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Sites</span>
              </div>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">analyzed to date</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-chart-2 shadow-sm">
            <CardContent className="pt-6 pb-4 px-5">
              <div className="flex items-center gap-2 text-chart-2 mb-2">
                <Shield className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Score</span>
              </div>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{Number.isFinite(stats.avgScore) ? stats.avgScore.toFixed(1) : "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-chart-3 shadow-sm">
            <CardContent className="pt-6 pb-4 px-5">
              <div className="flex items-center gap-2 text-chart-3 mb-2">
                <Globe className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Best Score</span>
              </div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-chart-3">
                {stats.bestSites.length > 0 ? getOverallScoreDisplay(stats.bestSites[0].overall_score) : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {stats.bestSites.length > 0 ? getDomainLabel(stats.bestSites[0].site_name) : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-destructive shadow-sm">
            <CardContent className="pt-6 pb-4 px-5">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {stats.staleCount > 0 ? "Stale" : "All Fresh"}
                </span>
              </div>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{stats.staleCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.staleCount === 1 ? "site needs update" : stats.staleCount > 0 ? "sites need updates" : "up to date"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Score Distribution + Category Averages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution Histogram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3Icon className="size-4 text-muted-foreground" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreDistData.some((d) => d.value > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                        formatter={(value: number) => [`${value} site${value !== 1 ? "s" : ""}`]}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                        {scoreDistData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                  No data yet — analyze a site to see distribution.
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-sm bg-[hsl(var(--destructive))]" />
                  Poor
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-sm bg-[hsl(var(--chart-3))]" />
                  Fair
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-sm bg-[hsl(var(--chart-1))]" />
                  Good
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Category Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ChartNoAxesColumnIncreasing className="size-4 text-muted-foreground" />
                Average Category Scores /10
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{ top: 8, right: 24, left: 0, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                      <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        width={130}
                        tickFormatter={(val: string) =>
                          val.length > 20 ? val.slice(0, 20) + "…" : val
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                        formatter={(value: number) => [value.toFixed(1) + " /10"]}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                  No category data yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Best and Worst Sites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUpIcon className="size-4 text-chart-1" />
                Top 5 Best
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.bestSites.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {stats.bestSites.map((site, i) => {
                    const safeScore = getOverallScoreDisplay(site.overall_score);
                    return (
                      <Link
                        key={site._id}
                        href={`/site/${site._id}`}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                          "hover:bg-accent",
                        )}
                      >
                        <span className="text-xs font-mono tabular-nums text-muted-foreground w-4 shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate text-sm font-medium">
                          {site.site_name || "Unnamed Site"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-mono tabular-nums text-chart-1">
                            {safeScore}
                          </span>
                          <ScoreVisualizer value={safeScore / 100} displayNumber="" size={24} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No sites analyzed yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Worst Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDownIcon className="size-4 text-destructive" />
                Bottom 5
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.worstSites.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {stats.worstSites.map((site, i) => {
                    const safeScore = getOverallScoreDisplay(site.overall_score);
                    return (
                      <Link
                        key={site._id}
                        href={`/site/${site._id}`}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                          "hover:bg-accent",
                        )}
                      >
                        <span className="text-xs font-mono tabular-nums text-muted-foreground w-4 shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate text-sm font-medium">
                          {site.site_name || "Unnamed Site"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-mono tabular-nums text-destructive">
                            {safeScore}
                          </span>
                          <ScoreVisualizer value={safeScore / 100} displayNumber="" size={24} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No sites analyzed yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation footer */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/sites" className="gap-1.5">
              <ListIcon className="size-3.5" />
              Browse all sites
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/compare" className="gap-1.5">
              <BarChart3Icon className="size-3.5" />
              Compare sites
            </Link>
          </Button>
          {stats.staleCount > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/stale" className="gap-1.5">
                <AlertTriangle className="size-3.5" />
                Refresh {stats.staleCount} stale
              </Link>
            </Button>
          )}
        </div>
      </section>
    </motion.div>
  );
}
