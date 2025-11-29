"use client";

import ScoreVisualizer from "@/components/ui/score-visualizer";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useQuery } from "convex/react";
import { QuoteIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface SitePageProps {
  params: Promise<{
    id: Id<"sites">;
  }>;
}

export default function SitePage({ params }: SitePageProps) {
  const { id } = use(params);

  const full_site_details = useQuery(api.sites.getFullSiteDetails, {
    site_id: id,
  });

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

  return (
    <>
      <section
        className={cn("", "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-24")}
      >
        <div className="w-full md:col-span-2 flex flex-col gap-6">
          <div className="title flex flex-col items-center md:items-start gap-2">
            <ScoreVisualizer
              value={overall_score / 100}
              size={128}
              displayNumber={`${overall_score.toFixed(0)}`}
              className="md:hidden mx-auto"
            />
            <h2 className="leading-16">{site_name}</h2>
            <Link href={normalized_base_url} target="_blank">
              {normalized_base_url}
            </Link>
            <span className="">
              Last analysed {formatRelativeTime(last_analyzed)}.
            </span>
          </div>

          <Separator />

          <div className="category-scores w-full flex flex-col gap-3">
            <h4>Category Scores</h4>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={`${category_scores[0].category_name}`}
            >
              {category_scores.map((c) => (
                <AccordionItem
                  key={c.category_name}
                  value={c.category_name}
                  className="bg-card p-4 rounded-3xl mb-3 flex flex-col gap-3 border-b-4"
                >
                  <div className="w-full flex items-center gap-4 justify-between">
                    <h5 className="font-semibold">{c.category_name}</h5>
                    <div className="flex items-center gap-2">
                      <ScoreVisualizer
                        value={c.category_score / 10}
                        size={48}
                        displayNumber={`${c.category_score} /10`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {c.category_score > 4 ? "Good" : "Bad"}
                      </span>
                    </div>
                  </div>

                  <p className="text-base! text-muted-foreground pl-1">
                    {c.reasoning}
                  </p>

                  <Separator className="" />
                  <AccordionTrigger className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <QuoteIcon className="size-6 stroke-primary" />
                      <span className="">Supporting Clauses</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <ul className="list-disc px-6 flex flex-col gap-2">
                      {c.supporting_clauses.map((cl, index) => (
                        <li
                          key={index}
                          className="text-sm! text-muted-foreground italic"
                        >
                          &quot;{cl}&quot;
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="w-full h-fit md:col-span-1 flex flex-col items-center gap-6 sticky top-24">
          <ScoreVisualizer
            value={overall_score / 100}
            size={256}
            displayNumber={`${overall_score.toFixed(0)}`}
            className="hidden md:flex"
          />
          <span className="text-sm -mt-3 hidden md:flex">Overall Score</span>

          <Separator />

          <div className="w-full flex flex-col gap-3">
            <h5>Policy Documents</h5>
            {policy_documents_urls.map((url) => (
              <Link key={url} href={url} target="_blank">
                {url}
              </Link>
            ))}
          </div>
        </div>
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
        aria-live="polite"
      >
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
