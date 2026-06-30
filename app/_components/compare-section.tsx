"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  formatRelativeTime,
  getAnalysisFreshnessLabel,
  isAnalysisStale,
  getCategoryScoreDisplay,
  getOverallScoreDisplay,
} from "@/lib/utils";
import { RequireOnly, SiteDetails } from "@/convex/lib";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import { ArrowUpRightIcon, BarChart3Icon, CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type RecentSite = {
  _id: Id<"sites">;
  normalized_base_url: string;
  site_name: string;
  overall_score: number;
  reasoning: string;
  last_analyzed: string;
  category_scores: Array<{
    category_name: string;
    category_score: number;
    reasoning: string;
  }>;
};

const COMPARE_PARAM = "compare";

function useCompareSelection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedIds = useMemo<Id<"sites">[]>(() => {
    const raw = searchParams.get(COMPARE_PARAM);
    if (!raw) return [];
    return raw.split(",").filter(Boolean) as Id<"sites">[];
  }, [searchParams]);

  const toggleId = useCallback(
    (id: Id<"sites">) => {
      const current = new Set(selectedIds);
      if (current.has(id)) {
        current.delete(id);
      } else {
        if (current.size >= 6) return;
        current.add(id);
      }
      const next = Array.from(current).join(",");
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(COMPARE_PARAM, next);
      } else {
        params.delete(COMPARE_PARAM);
      }
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [selectedIds, searchParams, router],
  );

  const clearSelection = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(COMPARE_PARAM);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [searchParams, router]);

  const isSelected = useCallback(
    (id: Id<"sites">) => selectedIds.includes(id),
    [selectedIds],
  );

  return { selectedIds, toggleId, clearSelection, isSelected };
}

export function CompareSection({ sites }: { sites: RecentSite[] }) {
  const { selectedIds, toggleId, clearSelection, isSelected } =
    useCompareSelection();

  return (
    <>
      {/* Cards for smaller screens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden xl:gap-8">
        {sites.map((site) => (
          <CompareSiteCard
            key={site._id}
            site_details={site}
            isSelected={isSelected(site._id)}
            onToggle={toggleId}
          />
        ))}
      </div>

      {/* Table for larger screens */}
      <CompareTable
        sites={sites}
        isSelected={isSelected}
        onToggle={toggleId}
      />

      {/* Floating action bar when 2+ sites selected */}
      {selectedIds.length >= 2 && (
        <CompareFloatingBar
          selectedIds={selectedIds}
          onClear={clearSelection}
        />
      )}
    </>
  );
}

function CompareToggleButton({
  siteId,
  isSelected,
  onToggle,
}: {
  siteId: Id<"sites">;
  isSelected: boolean;
  onToggle: (id: Id<"sites">) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(siteId);
      }}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 transition-all shrink-0",
        "border border-dashed",
        isSelected
          ? "bg-chart-1/10 border-chart-1/40 text-chart-1 hover:bg-chart-1/20"
          : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
      )}
      aria-label={isSelected ? "Remove from compare" : "Add to compare"}
    >
      {isSelected ? (
        <>
          <CheckIcon className="size-3" />
          Comparing
        </>
      ) : (
        <>
          <PlusIcon className="size-3" />
          Compare
        </>
      )}
    </button>
  );
}

function CompareFloatingBar({
  selectedIds,
  onClear,
}: {
  selectedIds: Id<"sites">[];
  onClear: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 bg-card border shadow-lg rounded-2xl px-5 py-3">
        <div className="flex -space-x-1.5">
          {selectedIds.slice(0, 4).map((_id, i) => (
            <div
              key={_id}
              className="size-7 rounded-full bg-accent border-2 border-background flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-muted-foreground">
                {i + 1}
              </span>
            </div>
          ))}
          {selectedIds.length > 4 && (
            <div className="size-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground">
                +{selectedIds.length - 4}
              </span>
            </div>
          )}
        </div>

        <span className="text-sm font-medium whitespace-nowrap">
          Compare {selectedIds.length} sites
        </span>

        <Link
          href={`/compare?ids=${selectedIds.join(",")}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-4 py-1.5 transition-all bg-chart-1 text-chart-1-foreground hover:bg-chart-1/90 shadow-sm"
        >
          <BarChart3Icon className="size-4" />
          Compare
        </Link>

        <button
          type="button"
          onClick={onClear}
          className="size-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Clear selection"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

function CompareTable({
  sites,
  isSelected,
  onToggle,
}: {
  sites: RecentSite[];
  isSelected: (id: Id<"sites">) => boolean;
  onToggle: (id: Id<"sites">) => void;
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border xl:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Site</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Analyzed</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => {
            const safeOverallScore = getOverallScoreDisplay(
              site.overall_score,
            );

            return (
              <TableRow
                key={site._id}
                className={cn(
                  isSelected(site._id) && "bg-chart-1/[0.03]",
                )}
              >
                <TableCell className="py-2">
                  <CompareToggleButton
                    siteId={site._id}
                    isSelected={isSelected(site._id)}
                    onToggle={onToggle}
                  />
                </TableCell>
                <TableCell className="font-medium whitespace-normal">
                  <Link
                    href={`/site/${site._id}`}
                    className="hover:underline"
                  >
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
                  {formatRelativeTime(site.last_analyzed)}
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

function CompareSiteCard({
  site_details,
  isSelected,
  onToggle,
}: {
  site_details: RecentSite;
  isSelected: boolean;
  onToggle: (id: Id<"sites">) => void;
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
        "rounded-xl transition-all",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
        "hover:border-ring hover:ring-ring/50 hover:ring-[3px]",
        isSelected && "border-chart-1/40",
      )}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle>
                  <h4>{site_name}</h4>
                </CardTitle>
                <CompareToggleButton
                  siteId={_id}
                  isSelected={isSelected}
                  onToggle={onToggle}
                />
              </div>
              <CardDescription className="flex flex-col gap-1">
                <span className="truncate">
                  {getDomainLabel(normalized_base_url)}
                </span>
                <span>Analyzed {formatRelativeTime(last_analyzed)}</span>
                {freshnessLabel ? <span>{freshnessLabel}</span> : null}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-2">
              {staleAnalysis ? (
                <Badge
                  variant="secondary"
                  className="border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                >
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
        <CardFooter />
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
