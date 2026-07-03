"use client";

import { useState, useMemo } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import {
  cn,
  formatRelativeTime,
  getAnalysisAgeInDays,
  getOverallScoreDisplay,
  isAnalysisStale,
} from "@/lib/utils";
import {
  AlertTriangle,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  ArrowLeft,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";

export default function StaleAnalysesPage() {
  const allSites = useQuery(api.sites.getSitesBrief, { limit: 500 });
  const [batchState, setBatchState] = useState<
    "idle" | "analyzing" | "done"
  >("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [individualStates, setIndividualStates] = useState<
    Record<string, "idle" | "analyzing" | "done" | "error">
  >({});
  const reanalyze = useAction(api.actions.reanalyzeSite);

  const staleSites = useMemo(() => {
    if (!allSites) return [];
    return allSites.filter((site) =>
      isAnalysisStale(site.last_analyzed ?? ""),
    );
  }, [allSites]);

  const staleStats = useMemo(() => {
    if (staleSites.length === 0) return null;
    const avgScore =
      staleSites.reduce(
        (sum, s) => sum + getOverallScoreDisplay(s.overall_score),
        0,
      ) / staleSites.length;
    return { avgScore: Math.round(avgScore * 10) / 10 };
  }, [staleSites]);

  const oldestDays = useMemo(() => {
    if (staleSites.length === 0) return null;
    const sorted = [...staleSites].sort(
      (a, b) =>
        new Date(a.last_analyzed ?? 0).getTime() -
        new Date(b.last_analyzed ?? 0).getTime(),
    );
    return getAnalysisAgeInDays(sorted[0]?.last_analyzed ?? "");
  }, [staleSites]);

  const handleBatchReanalyze = async () => {
    setBatchState("analyzing");
    setProgress({ current: 0, total: staleSites.length });

    for (let i = 0; i < staleSites.length; i++) {
      try {
        await reanalyze({ site_id: staleSites[i]._id });
        setProgress({ current: i + 1, total: staleSites.length });
      } catch (err) {
        console.error(
          `Failed to re-analyze ${staleSites[i].site_name}:`,
          err,
        );
        // Continue with next
      }
    }

    setBatchState("done");
    setProgress({ current: staleSites.length, total: staleSites.length });
  };

  const handleIndividualReanalyze = async (siteId: Id<"sites">) => {
    setIndividualStates((prev) => ({ ...prev, [siteId]: "analyzing" }));
    try {
      await reanalyze({ site_id: siteId });
      setIndividualStates((prev) => ({ ...prev, [siteId]: "done" }));
    } catch {
      setIndividualStates((prev) => ({ ...prev, [siteId]: "error" }));
    }
  };

  // Loading state
  if (!allSites) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60dvh] gap-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading analyses...</p>
        </div>
      </section>
    );
  }

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
            <h2 className="leading-none">Stale Analyses</h2>
          </div>
          <p className="tagline text-muted-foreground">
            Analyses that are over 14 days old and may need refreshing.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-b-4 border-amber-500/40">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <AlertTriangle className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Stale
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {staleSites.length}
              </p>
              <p className="text-xs text-muted-foreground">
                of {allSites.length} total
              </p>
            </CardContent>
          </Card>

          <Card className="border-b-4">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Sites
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {allSites.length}
              </p>
              <p className="text-xs text-muted-foreground">analyzed</p>
            </CardContent>
          </Card>

          {staleStats && (
            <Card className="border-b-4">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart3 className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Avg Score
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {staleStats.avgScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  among stale sites
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-b-4">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Oldest
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {oldestDays !== null ? `${oldestDays}d` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                since last scan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Empty state */}
        {staleSites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground"
          >
            <CheckCircle2 className="size-12 text-chart-1 opacity-60" />
            <div className="max-w-sm">
              <p className="font-medium text-foreground">
                All analyses are fresh
              </p>
              <p className="text-sm">
                Every analyzed site has been checked within the last 14 days.
                Come back later as analyses age.
              </p>
            </div>
          </motion.div>
        )}

        {staleSites.length > 0 && (
          <>
            {/* Batch actions bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {staleSites.length} stale site
                {staleSites.length !== 1 ? "s" : ""} need
                {staleSites.length === 1 ? "s" : ""} refreshing
              </span>

              <div className="flex items-center gap-3">
                {batchState === "idle" && (
                  <Button
                    onClick={handleBatchReanalyze}
                    className="gap-2 shrink-0"
                  >
                    <RefreshCw className="size-4" />
                    Re-analyze All
                  </Button>
                )}

                {batchState === "analyzing" && (
                  <div className="flex items-center gap-3">
                    <Progress
                      value={(progress.current / progress.total) * 100}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                      {progress.current}/{progress.total}
                    </span>
                    <LoaderCircle className="size-4 animate-spin text-muted-foreground shrink-0" />
                  </div>
                )}

                {batchState === "done" && (
                  <Button
                    variant="outline"
                    className="gap-2 shrink-0 text-chart-1 border-chart-1/30"
                  >
                    <CheckCircle2 className="size-4" />
                    All re-analyzed
                  </Button>
                )}
              </div>
            </div>

            {/* Stale sites list */}
            <div className="grid grid-cols-1 gap-3">
              {staleSites.map((site, i) => {
                const safeScore = getOverallScoreDisplay(site.overall_score);
                const daysStale = getAnalysisAgeInDays(
                  site.last_analyzed ?? "",
                );
                const state = individualStates[site._id] ?? "idle";

                return (
                  <motion.div
                    key={site._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.03,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Card className="border-b-4 border-amber-500/30">
                      <CardContent className="pt-4 pb-3 px-5 flex items-center gap-4">
                        {/* Site info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/site/${site._id}`}
                            className="font-medium hover:underline !no-underline text-foreground"
                          >
                            {site.site_name || "Unnamed Site"}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <span className="truncate max-w-48">
                              {site.normalized_base_url
                                ? new URL(
                                    site.normalized_base_url,
                                  ).hostname.replace(/^www\./, "")
                                : "—"}
                            </span>
                            <span className="hidden xs:inline">·</span>
                            <span>
                              Analyzed{" "}
                              {formatRelativeTime(site.last_analyzed ?? "")}
                            </span>
                            {daysStale !== null && (
                              <>
                                <span>·</span>
                                <Badge
                                  variant="secondary"
                                  className="border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-[10px] px-1.5 py-0"
                                >
                                  {daysStale}d stale
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              "text-sm font-mono tabular-nums",
                              safeScore >= 70 && "text-chart-1",
                              safeScore >= 40 &&
                                safeScore < 70 &&
                                "text-chart-3",
                              safeScore < 40 && "text-destructive",
                            )}
                          >
                            {safeScore}/100
                          </span>
                          <ScoreVisualizer
                            value={safeScore / 100}
                            displayNumber=""
                            size={28}
                          />
                        </div>

                        {/* Re-analyze action */}
                        <div className="shrink-0">
                          {state === "idle" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleIndividualReanalyze(site._id)
                              }
                              className="gap-1.5"
                            >
                              <RefreshCw className="size-3.5" />
                              <span className="hidden sm:inline">
                                Re-analyze
                              </span>
                            </Button>
                          )}
                          {state === "analyzing" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="gap-1.5"
                            >
                              <LoaderCircle className="size-3.5 animate-spin" />
                              <span className="hidden sm:inline">...</span>
                            </Button>
                          )}
                          {state === "done" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-chart-1 border-chart-1/30"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span className="hidden sm:inline">Done</span>
                            </Button>
                          )}
                          {state === "error" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleIndividualReanalyze(site._id)
                              }
                              className="gap-1.5 text-destructive border-destructive/30"
                            >
                              <XCircle className="size-3.5" />
                              <span className="hidden sm:inline">Retry</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </motion.div>
  );
}
