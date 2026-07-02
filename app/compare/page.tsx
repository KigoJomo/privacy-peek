"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import {
  cn,
  getCategoryScoreDisplay,
  getOverallScoreDisplay,
  formatRelativeTime,
} from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Plus,
  X,
  ArrowLeft,
  BarChart3Icon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

type SiteBrief = NonNullable<
  ReturnType<typeof api.sites.getSitesBrief._returnType>
>[number];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<Id<"sites">[]>([]);
  const [open, setOpen] = useState(false);

  const allSites = useQuery(api.sites.getSitesBrief, { limit: 100 });
  const selectedSites = useQuery(api.sites.getSitesByIds, {
    ids: selectedIds,
  });

  const availableSites = useMemo(() => {
    if (!allSites) return [];
    return allSites.filter(
      (s) => !selectedIds.includes(s._id as Id<"sites">),
    );
  }, [allSites, selectedIds]);

  const addSite = (id: Id<"sites">) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
    setOpen(false);
  };

  const removeSite = (id: Id<"sites">) => {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  return (
    <>
      <section className="flex flex-col gap-8 min-h-[60dvh]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h2 className="leading-none">Compare Sites</h2>
          </div>
          <p className="tagline text-muted-foreground">
            Select multiple sites to compare their privacy scores
            side-by-side.
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full max-w-md justify-between"
              disabled={!allSites || selectedIds.length >= 4}
            >
              <span className="flex items-center gap-2">
                <Plus className="size-4" />
                {selectedIds.length >= 4 ? "Maximum 4 sites" : "Add site to compare"}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search analyzed sites..." />
              <CommandList>
                <CommandEmpty>No sites found.</CommandEmpty>
                <CommandGroup>
                  {availableSites.map((site) => (
                    <CommandItem
                      key={site._id}
                      value={`${site.site_name} ${site.normalized_base_url}`}
                      onSelect={() => addSite(site._id as Id<"sites">)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedIds.includes(site._id as Id<"sites">)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-1 items-center justify-between gap-2">
                        <span className="truncate">{site.site_name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {getOverallScoreDisplay(site.overall_score)}/100
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedSites && selectedSites.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
            <BarChart3Icon className="size-12 opacity-40" />
            <div className="max-w-sm">
              <p className="font-medium text-foreground">
                No sites selected yet
              </p>
              <p className="text-sm">
                Add at least two sites to compare their privacy practices
                side-by-side and make an informed choice.
              </p>
            </div>
          </div>
        )}

        {selectedSites && selectedSites.length === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Add another site to start comparing. You can compare up to 4
              sites at once.
            </p>
            <ComparisonGrid
              sites={selectedSites}
              onRemove={removeSite}
            />
          </div>
        )}

        {selectedSites && selectedSites.length >= 2 && (
          <ComparisonGrid sites={selectedSites} onRemove={removeSite} />
        )}

        {!selectedSites && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">
              Loading sites...
            </p>
          </div>
        )}
      </section>

      <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl" />
      <div className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl" />
    </>
  );
}

function ComparisonGrid({
  sites,
  onRemove,
}: {
  sites: NonNullable<ReturnType<typeof api.sites.getSitesByIds._returnType>>;
  onRemove: (id: Id<"sites">) => void;
}) {
  const cols = Math.min(sites.length, 4);

  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-3",
        cols >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {sites.map((site) => {
        if (!site) return null;

        const safeOverallScore = getOverallScoreDisplay(site.overall_score);
        const safeCategoryScores = (site.category_scores ?? []).map((c) => ({
          ...c,
          category_score: getCategoryScoreDisplay(c.category_score),
        }));

        return (
          <Card
            key={site._id}
            className="flex flex-col border-b-4 overflow-hidden"
          >
            <CardHeader className="border-b pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate">
                    <Link
                      href={`/site/${site._id}`}
                      className="hover:underline"
                    >
                      {site.site_name}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {site.normalized_base_url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 -mr-1 -mt-1"
                  onClick={() => onRemove(site._id)}
                  aria-label={`Remove ${site.site_name} from comparison`}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-4">
              {/* Overall Score */}
              <Link
                href={`/site/${site._id}`}
                className="flex flex-col items-center gap-1 !no-underline group"
              >
                <ScoreVisualizer
                  value={safeOverallScore / 100}
                  size={96}
                  displayNumber={`${safeOverallScore}`}
                  className="transition-transform group-hover:scale-105"
                />
                <span className="text-xs text-muted-foreground">
                  Overall /100
                </span>
              </Link>

              <Separator />

              {/* Reasoning */}
              {site.reasoning && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Summary
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {site.reasoning}
                  </p>
                </div>
              )}

              {/* Category Scores */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category Scores /10
                </span>
                {safeCategoryScores.map((cat) => (
                  <div
                    key={cat.category_name}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs truncate">
                      {cat.category_name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          "text-xs font-mono tabular-nums",
                          cat.category_score >= 7 && "text-chart-1",
                          cat.category_score >= 4 &&
                            cat.category_score < 7 &&
                            "text-chart-3",
                          cat.category_score < 4 && "text-destructive",
                        )}
                      >
                        {cat.category_score}
                      </span>
                      <ScoreVisualizer
                        value={cat.category_score / 10}
                        size={24}
                        displayNumber=""
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Policy docs link */}
              {site.policy_documents_urls &&
                site.policy_documents_urls.length > 0 && (
                  <div className="flex flex-col gap-1 mt-auto pt-2 border-t">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Documents
                    </span>
                    {site.policy_documents_urls.slice(0, 2).map((url) => (
                      <Link
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs inline-flex items-center gap-1 truncate hover:underline"
                      >
                        <ExternalLink className="size-3 shrink-0" />
                        <span className="truncate">
                          {new URL(url).pathname.split("/").pop() || url}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

              {/* View full details link */}
              <Link
                href={`/site/${site._id}`}
                className="text-xs text-center text-primary hover:underline mt-1"
              >
                View full analysis &rarr;
              </Link>

              {/* Last analyzed */}
              <p className="text-[10px] text-muted-foreground text-center">
                Analyzed {formatRelativeTime(site.last_analyzed)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
