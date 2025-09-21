'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ScoreVisualizer from '@/components/ui/score-visualizer';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
// import { SiteDetails } from '@/convex/lib';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useQuery } from 'convex/react';
import {
  ExternalLinkIcon,
  InfoIcon,
  QuoteIcon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { use, useMemo, useState } from 'react';

interface SitePageProps {
  params: Promise<{
    id: Id<'sites'>;
  }>;
}

export default function SitePage({ params }: SitePageProps) {
  const { id } = use(params);

  const full_site_details = useQuery(api.sites.getFullSiteDetails, {
    site_id: id,
  });

  // Hooks must be called before any early returns
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const categoriesLength = full_site_details?.category_scores?.length ?? 0;
  const hasCategories = categoriesLength > 0;
  const safeIndex = useMemo(() => {
    if (!hasCategories) return -1;
    return Math.min(Math.max(0, selectedIndex), categoriesLength - 1);
  }, [hasCategories, selectedIndex, categoriesLength]);

  if (full_site_details === undefined) {
    return <Loading />;
  }

  if (full_site_details === null) {
    return <NotFound />;
  }

  const {
    normalized_base_url,
    site_name,
    policy_documents_urls,
    last_analyzed,
    overall_score,
    category_scores,
  } = full_site_details;

  const selectedCategory =
    hasCategories && safeIndex !== -1 ? category_scores[safeIndex] : null;

  return (
    <>
      <section className={cn('', 'flex flex-col gap-6')}>
        <div className="w-full flex gap-6 justify-between">
          <div className="flex items-center gap-6">
            <ScoreVisualizer
              value={(overall_score ?? 0) / 100}
              displayNumber={overall_score.toFixed(0)}
              size={128}
            />
            <div className="flex flex-col gap-1">
              <h2>{site_name}</h2>
              <Link
                href={normalized_base_url}
                target="_blank"
                className="flex items-center gap-1">
                {normalized_base_url}
                <ExternalLinkIcon size={16} />
              </Link>
              {policy_documents_urls?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {policy_documents_urls.slice(0, 3).map((url, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="max-w-[18rem] truncate">
                      {new URL(url).hostname.replace(/^www\./, '')}
                    </Badge>
                  ))}
                  {policy_documents_urls.length > 3 && (
                    <Badge variant="outline">
                      +{policy_documents_urls.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="h-fit my-auto flex items-center">
            <span className="text-muted-foreground">
              Last analyzed {formatRelativeTime(last_analyzed)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Two-pane layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-6">
          {/* Left: Category List */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Categories</CardTitle>
              <CardDescription>
                Explore how this site performs across key privacy dimensions.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="max-h-[520px]">
                <ul
                  role="listbox"
                  aria-label="Privacy categories"
                  className="divide-y">
                  {hasCategories ? (
                    category_scores.map((cat, idx) => {
                      const selected = idx === safeIndex;
                      return (
                        <li
                          key={cat.category_name}
                          role="option"
                          aria-selected={selected}>
                          <button
                            type="button"
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                              selected
                                ? 'bg-primary/10 hover:bg-primary/15'
                                : 'hover:bg-muted'
                            )}>
                            {/* <ScoreVisualizer
                              value={cat.category_score / 10}
                              size={44}
                              displayNumber={`${Math.round(
                                cat.category_score * 10
                              )}%`}
                              className="shrink-0"
                            /> */}
                            <div className="flex min-w-0 flex-col">
                              <span className="font-medium text-base truncate">
                                {cat.category_name}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                Score {cat.category_score.toFixed(0)} / 10
                              </span>
                            </div>

                            <div className="ml-auto flex items-center gap-2">
                              <Badge
                                variant={
                                  cat.category_score >= 7
                                    ? 'default'
                                    : cat.category_score >= 4
                                    ? 'secondary'
                                    : 'destructive'
                                }>
                                {cat.category_score >= 7
                                  ? 'Good'
                                  : cat.category_score >= 4
                                  ? 'Average'
                                  : 'Poor'}
                              </Badge>
                              <ChevronRight className="size-4 text-muted-foreground" />
                            </div>
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-4 py-6 text-sm text-muted-foreground">
                      No categories available.
                    </li>
                  )}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: Selected Category Details */}
          <div>
            {selectedCategory ? (
              <Card>
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>
                        <h4 className="leading-tight">
                          {selectedCategory.category_name}
                        </h4>
                      </CardTitle>
                      <CardDescription>
                        Deep dive into how we scored this category.
                      </CardDescription>
                    </div>
                    <div className="h-12 w-[1px] bg-foreground/15" />
                    <ScoreVisualizer
                      value={selectedCategory.category_score / 10}
                      size={64}
                      displayNumber={`${selectedCategory.category_score.toFixed(
                        0
                      )}/10`}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-accent-foreground">
                    <ShieldCheck className="size-4" />
                    <h5 className="text-sm font-medium">Why this score</h5>
                  </div>
                  <p className="!text-base leading-relaxed">
                    {selectedCategory.reasoning}
                  </p>

                  {selectedCategory.supporting_clauses && (
                    <>
                      <Separator />

                      <div className="flex items-center gap-2 text-accent-foreground">
                        <InfoIcon className="size-4" />
                        <h5 className="text-sm font-medium">
                          Featured clauses
                        </h5>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        {selectedCategory.supporting_clauses.map((c, i) => (
                          <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center gap-2">
                                <QuoteIcon className="size-4 shrink-0" />
                                <span className="truncate">
                                  Representative clause #{i}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="text-sm bg-primary/5 border border-border rounded-md p-4 leading-relaxed">
                                {c}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Category details</CardTitle>
                  <CardDescription>
                    Select a category on the left to see details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />
      </section>
    </>
  );
}

/**
 *
 *
 *
 */

function NotFound() {
  return (
    <>
      <section className="min-h-[90vh] flex flex-col items-center justify-center gap-12">
        <h1>Oops!</h1>

        <h3>The requested site was not found.</h3>

        <Link href="/">Click here to go back to the home page.</Link>
      </section>
    </>
  );
}

function Loading() {
  return (
    <>
      <section
        className="min-h-[90vh] flex flex-col gap-6"
        aria-busy="true"
        aria-live="polite">
        <h2 className="sr-only">Loading site details…</h2>
        <div className="w-full flex items-center gap-4 justify-between">
          <Skeleton className="h-8 w-48 rounded" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      </section>
    </>
  );
}
