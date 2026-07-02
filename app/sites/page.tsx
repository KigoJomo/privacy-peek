"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import {
  cn,
  getOverallScoreDisplay,
  formatRelativeTime,
} from "@/lib/utils";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  GitCompareArrowsIcon,
  ListIcon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type SortField = "site_name" | "overall_score" | "last_analyzed";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

export default function SitesDirectory() {
  const allSites = useQuery(api.sites.getSitesBrief, { limit: 200 });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("last_analyzed");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "site_name" ? "asc" : "desc");
    }
    setPage(1);
  };

  const filteredSites = useMemo(() => {
    if (!allSites) return [];
    if (!searchQuery.trim()) return allSites;

    const q = searchQuery.toLowerCase().trim();
    return allSites.filter(
      (site) =>
        site.site_name?.toLowerCase().includes(q) ||
        site.normalized_base_url?.toLowerCase().includes(q),
    );
  }, [allSites, searchQuery]);

  const sortedSites = useMemo(() => {
    const sorted = [...filteredSites];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortField === "site_name") {
        cmp = (a.site_name ?? "").localeCompare(b.site_name ?? "");
      } else if (sortField === "overall_score") {
        cmp = (a.overall_score ?? 0) - (b.overall_score ?? 0);
      } else if (sortField === "last_analyzed") {
        cmp =
          new Date(a.last_analyzed ?? 0).getTime() -
          new Date(b.last_analyzed ?? 0).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filteredSites, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedSites.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedSites = sortedSites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="size-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="size-3" />
    ) : (
      <ArrowDown className="size-3" />
    );
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1); }}>
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (start > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => { e.preventDefault(); setPage(i); }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => { e.preventDefault(); setPage(totalPages); }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <>
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
            <h2 className="leading-none">All Sites</h2>
          </div>
          <p className="tagline text-muted-foreground">
            Browse, search, and sort through all analyzed sites.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by site name or domain..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        {/* Loading state */}
        {!allSites && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">
              Loading sites...
            </p>
          </div>
        )}

        {/* Empty state */}
        {allSites && paginatedSites.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
            <ListIcon className="size-12 opacity-40" />
            <div className="max-w-sm">
              <p className="font-medium text-foreground">
                {searchQuery
                  ? "No sites match your search"
                  : "No sites analyzed yet"}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? "Try a different search term or browse all sites."
                  : "Search for a site on the home page to get started."}
              </p>
            </div>
          </div>
        )}

        {/* Results info */}
        {allSites && paginatedSites.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {sortedSites.length} site{sortedSites.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            {totalPages > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Desktop table */}
        {allSites && paginatedSites.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl border xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => toggleSort("site_name")}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Site
                        <SortIcon field="site_name" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => toggleSort("last_analyzed")}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Analyzed
                        <SortIcon field="last_analyzed" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button
                        onClick={() => toggleSort("overall_score")}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors ml-auto"
                      >
                        Score
                        <SortIcon field="overall_score" />
                      </button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSites.map((site) => {
                    const safeScore = getOverallScoreDisplay(site.overall_score);
                    return (
                      <TableRow key={site._id}>
                        <TableCell className="font-medium whitespace-normal">
                          <Link
                            href={`/site/${site._id}`}
                            className="hover:underline"
                          >
                            {site.site_name}
                          </Link>
                          <div className="text-xs text-muted-foreground truncate max-w-72">
                            {getDomainLabel(site.normalized_base_url)}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatRelativeTime(site.last_analyzed)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-mono tabular-nums",
                                safeScore >= 70 && "text-chart-1",
                                safeScore >= 40 && safeScore < 70 && "text-chart-3",
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
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/compare?add=${site._id}`}
                              className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              aria-label={`Compare ${site.site_name}`}
                            >
                              <GitCompareArrowsIcon className="size-3.5" />
                            </Link>
                            <Link
                              href={site.normalized_base_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              aria-label={`Visit ${site.site_name}`}
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-3 xl:hidden">
              {paginatedSites.map((site) => {
                const safeScore = getOverallScoreDisplay(site.overall_score);
                return (
                  <Link
                    key={site._id}
                    href={`/site/${site._id}`}
                    className={cn(
                      "!no-underline border-b-4 rounded-xl transition-all",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                      "hover:border-ring hover:ring-ring/50 hover:ring-[3px]",
                    )}
                  >
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate">
                              {site.site_name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground truncate">
                              {getDomainLabel(site.normalized_base_url)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={cn(
                                "text-sm font-mono tabular-nums",
                                safeScore >= 70 && "text-chart-1",
                                safeScore >= 40 && safeScore < 70 && "text-chart-3",
                                safeScore < 40 && "text-destructive",
                              )}
                            >
                              {safeScore}
                            </span>
                            <ScoreVisualizer
                              value={safeScore / 100}
                              displayNumber=""
                              size={32}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Analyzed {formatRelativeTime(site.last_analyzed)}
                        </span>
                        <GitCompareArrowsIcon className="size-3.5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(1, currentPage - 1));
                      }}
                      className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.min(totalPages, currentPage + 1));
                      }}
                      className={cn(
                        currentPage >= totalPages && "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>

      <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl" />
      <div className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl" />
    </>
  );
}

function getDomainLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
