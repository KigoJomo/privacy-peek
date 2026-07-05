import ScoreVisualizer from "@/components/ui/score-visualizer";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  cn,
  formatRelativeTime,
  getCategoryScoreDisplay,
  getOverallScoreDisplay,
  isAnalysisStale,
} from "@/lib/utils";
import { QuoteIcon, GitCompareArrowsIcon, AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import Loading from "../_components/loading";
import NotFound from "../_components/not-found";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { ReanalyzeButton } from "@/components/reanalyze-button";

interface SitePageProps {
  params: Promise<{
    id: Id<"sites">;
  }>;
}

export default async function SitePage({ params }: SitePageProps) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <NotFound />;
  }

  const { id } = await params;

  // Validate the site ID format before querying — catches malformed/injected IDs early
  const isLikelyValidId = (str: string): boolean => {
    // Convex IDs are 28-character base64url strings
    return /^[a-zA-Z0-9_-]{28}$/.test(str);
  };
  if (!isLikelyValidId(id)) {
    return <NotFound />;
  }

  const full_site_details = await fetchQuery(api.sites.getFullSiteDetails, {
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
  const safeOverallScore = getOverallScoreDisplay(overall_score);
  const safeCategoryScores = (category_scores ?? []).map((category) => ({
    ...category,
    category_score: getCategoryScoreDisplay(category.category_score),
    supporting_clauses: category.supporting_clauses ?? [],
  }));
  const safePolicyDocuments = policy_documents_urls ?? [];
  const stale = isAnalysisStale(last_analyzed);

  return (
    <>
      <section className={cn("flex flex-col gap-6")}>
        {stale && (
          <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-amber-800 dark:text-amber-200">
            <AlertTriangleIcon className="size-5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Stale analysis</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                This analysis is over 14 days old. Privacy policies may have changed since it was last analyzed.
              </p>
            </div>
          </div>
        )}

        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-24")}>
        <div className="w-full md:col-span-2 flex flex-col gap-6">
          <div className="animate-fade-in-up title flex flex-col items-center md:items-start gap-2">
            <ScoreVisualizer
              value={safeOverallScore / 100}
              size={128}
              displayNumber={`${safeOverallScore}`}
              className="md:hidden mx-auto"
            />
            <h2>{site_name || "Unnamed Site"}</h2>
            {normalized_base_url ? (
              <Link href={normalized_base_url} target="_blank">
                {normalized_base_url}
              </Link>
            ) : (
              <span className="text-muted-foreground">No URL available</span>
            )}
            <span className="">
              Last analysed {formatRelativeTime(last_analyzed)}.
            </span>
          </div>

          <Separator className="animate-fade-in" style={{ animationDelay: "0.1s" }} />

          <div className="category-scores w-full flex flex-col gap-3">
            <h4 className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>Category Scores</h4>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={safeCategoryScores[0]?.category_name}
            >
              {safeCategoryScores.map((c, i) => (
                <AccordionItem
                  key={c.category_name}
                  value={c.category_name}
                  className={cn(
                    "animate-fade-in-up bg-card p-4 rounded-3xl mb-3 flex flex-col gap-3 border-b-4",
                  )}
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  <div className="w-full flex items-center gap-4 justify-between">
                    <h5 className="font-semibold">{c.category_name}</h5>
                    <div className="flex items-center gap-2">
                      <ScoreVisualizer
                        value={c.category_score / 10}
                        size={48}
                        displayNumber={`${c.category_score} /10`}
                      />
                      <span className={cn(
                        "text-sm",
                        c.category_score >= 7 && "text-chart-1",
                        c.category_score >= 4 && c.category_score < 7 && "text-chart-3",
                        c.category_score < 4 && "text-destructive",
                      )}>
                        {c.category_score >= 7 ? "Good" : c.category_score >= 4 ? "Fair" : "Poor"}
                      </span>
                    </div>
                  </div>

                  <p className="text-base! text-muted-foreground pl-1">
                    {c.reasoning}
                  </p>

                  <Separator />
                  <AccordionTrigger className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <QuoteIcon className="size-6 stroke-primary" />
                      <span>Supporting Clauses</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <ul className="list-disc px-6 flex flex-col gap-2">
                      {c.supporting_clauses.length > 0 ? (
                        c.supporting_clauses.map((cl, index) => (
                          <li
                            key={index}
                            className="text-sm! text-muted-foreground italic"
                          >
                            &quot;{cl}&quot;
                          </li>
                        ))
                      ) : (
                        <li className="text-sm! text-muted-foreground italic">
                          No supporting clauses were stored for this category.
                        </li>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="animate-fade-in-up w-full h-fit md:col-span-1 flex flex-col items-center gap-6 sticky top-24">
          <ScoreVisualizer
            value={safeOverallScore / 100}
            size={256}
            displayNumber={`${safeOverallScore}`}
            className="hidden md:flex"
          />
          <span className="text-sm -mt-3 hidden md:flex">Overall Score</span>

          <Separator />

          <div className="w-full flex flex-col gap-3">
            <h5>Policy Documents</h5>
            {safePolicyDocuments.length > 0 ? (
              safePolicyDocuments.map((url) => (
                <Link key={url} href={url} target="_blank" className="text-sm truncate hover:underline">
                  {url}
                </Link>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No policy document links were stored for this analysis.
              </span>
            )}
          </div>

          <Separator />

          <Link
            href={`/compare?add=${id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground !no-underline"
          >
            <GitCompareArrowsIcon className="size-4" />
            Compare with another site
          </Link>

          {stale && (
            <div className="w-full border-t pt-4">
              <ReanalyzeButton siteId={id} />
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return [];
  }

  const all_ids = await fetchQuery(api.sites.getAllSiteIds);
  return all_ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return {
      title: "Privacy Peek",
      description: "Full privacy policy analysis.",
      metadataBase: new URL("https://privacy-peek.vercel.app"),
    };
  }

  const { id } = await params;

  const site = await fetchQuery(api.sites.getFullSiteDetails, { site_id: id });

  return {
    title: site ? `${site.site_name} Analysis | Privacy Peek` : "Privacy Peek",
    description: site
      ? `Full privacy policy analysis for ${site?.site_name}`
      : "Full privacy policy analysis.",
    creator: "Roci",
    keywords: ["privacy peek", "privacy", "policy analysis", "online privacy"],
    metadataBase: new URL("https://privacy-peek.vercel.app"),
    authors: [
      { name: "Roci", url: "https://jomo.aqutte.co.ke" },
      { name: "Privacy Peek" },
    ],
    applicationName: "Privacy Peek",
  };
}
