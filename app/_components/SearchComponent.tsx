"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { cn, getOverallScoreDisplay, safeSiteName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  LoaderCircle,
  Search,
  X,
  LucideIcon,
  AlertTriangle,
  BookOpenText,
  Calculator,
  CheckCircle2,
  Clock,
  Gauge,
  Globe,
  History,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import z from "zod";
import { ResultItem } from "@/convex/actions";
import ScoreVisualizer from "@/components/ui/score-visualizer";
import { Id } from "@/convex/_generated/dataModel";
import type { AnalysisStatus } from "@/convex/lib";

const SearchSchema = z.object({
  search_term: z
    .string()
    .trim()
    .min(3, "search term must be at least 3 characters.")
    .max(500, "search term must be less than 500 characters."),
});

type SearchValue = z.infer<typeof SearchSchema>;

type ActionState =
  | { ok: true; message: string; results?: ResultItem[] }
  | { ok: false; message: string }
  | null;

const initialState: ActionState = null;

export default function SearchComponent() {
  const form = useForm<SearchValue>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { search_term: "" },
    mode: "onSubmit",
  });

  const searchSite = useAction(api.actions.getSiteAnalysis);
  const createJob = useMutation(api.analysisJobs.createJob);
  const [jobId, setJobId] = useState<Id<"analysisJobs"> | null>(null);
  const [displayedResults, setDisplayedResults] = useState<ResultItem[] | null>(
    null,
  );
  const ongoingJob = useQuery(
    api.analysisJobs.getJob,
    jobId ? { job_id: jobId } : "skip",
  );

  // Track the latest submission to avoid stale results from racing requests
  const latestRequestId = useRef(0);

  const [state, submit, isPending] = useActionState(
    async (_prev: ActionState, value: SearchValue): Promise<ActionState> => {
      const normalizedSearchTerm = value.search_term.trim();
      const requestId = ++latestRequestId.current;

      setDisplayedResults([]);

      try {
        const analysisJobId = await createJob({
          site_input: normalizedSearchTerm,
        });
        // Only set jobId if this request is still the latest
        if (requestId === latestRequestId.current) {
          setJobId(analysisJobId);
        }

        const searchResults = await searchSite({
          user_input: normalizedSearchTerm,
          job_id: analysisJobId,
        });

        // Only update results if this request is still the latest
        if (requestId === latestRequestId.current) {
          setDisplayedResults(searchResults);
        }

        return {
          ok: true,
          message: "Analysis Complete!",
          results: searchResults,
        };
      } catch (error: unknown) {
        // Only show error for the latest request
        if (requestId !== latestRequestId.current) {
          return _prev;
        }
        if (error instanceof Error) {
          console.error(error.message);
          return { ok: false, message: error.message };
        } else {
          console.error("Failed to retrieve site analysis.");
          return { ok: false, message: "Failed to retrieve site analysis!" };
        }
      }
    },
    initialState,
  );

  useEffect(() => {
    if (!jobId) return;

    const status = ongoingJob?.status;
    if (status !== "complete" && status !== "error") return;

    const timeout = window.setTimeout(() => {
      setJobId(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [jobId, ongoingJob?.status]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((value) => {
          const normalizedValue = {
            ...value,
            search_term: value.search_term.trim(),
          };

          form.setValue("search_term", normalizedValue.search_term, {
            shouldDirty: true,
            shouldTouch: true,
          });

          startTransition(() => {
            submit(normalizedValue);
          });
        })}
        className={cn("w-full max-w-xl flex flex-col gap-2")}
      >
        <div className="w-full flex items-end gap-2">
          <FormField
            control={form.control}
            name="search_term"
            render={({ field }) => (
              <FormItem className="flex-1 gap-4 relative">
                <FormLabel className="sr-only">
                  Search an app or website to see how it performs.
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Enter a name or url..."
                      className="text-lg! h-fit! py-3! rounded-full pl-12! pr-10!"
                      {...field}
                    />
                  </div>
                </FormControl>
                {form.formState.errors.search_term && (
                  <p className="text-sm text-destructive text-center" role="alert">
                    {form.formState.errors.search_term.message}
                  </p>
                )}
                {field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue("search_term", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setDisplayedResults(null);
                      setJobId(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            className="aspect-square! h-fit! px-3.5! py-3! rounded-full shrink-0"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin size-5" />
            ) : (
              <Search className="size-5" />
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {jobId && (
            <motion.div
              key="job-status"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <JobStatus job_id={jobId} />
            </motion.div>
          )}
        </AnimatePresence>

        {state && !state.ok && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="!text-sm text-center text-destructive"
            role="alert"
          >
            {state.message}
          </motion.p>
        )}
      </form>

      <AnimatePresence mode="wait">
        {displayedResults && displayedResults.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl flex flex-col gap-3"
            role="region"
            aria-live="polite"
            aria-label="Search results"
          >
            {displayedResults.map((site, i) => (
              <motion.div
                key={site._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ResultCard site={site} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {displayedResults && displayedResults.length === 0 && !isPending && state?.ok && (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl rounded-2xl border border-dashed px-6 py-8 text-center text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            No matching analysis yet. Try a different app name or paste the full site URL.
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}

function JobStatus({ job_id }: { job_id: Id<"analysisJobs"> }) {
  const ongoingJob = useQuery(api.analysisJobs.getJob, { job_id });
  const status = ongoingJob?.status;

  type StatusColor =
    | "text-muted-foreground"
    | "text-accent-foreground"
    | "text-destructive"
    | "text-chart-1";

  const STATUS_DISPLAY: Record<
    AnalysisStatus,
    { icon: LucideIcon; text: string; color: StatusColor }
  > = {
    queued: {
      icon: Clock,
      text: "Queued",
      color: "text-muted-foreground",
    },
    checking_recent: {
      icon: History,
      text: "Checking recent analyses ...",
      color: "text-muted-foreground",
    },
    getting_site_info: {
      icon: Globe,
      text: "Getting site information ...",
      color: "text-accent-foreground",
    },
    reading_policies: {
      icon: BookOpenText,
      text: "Reading policy documents ...",
      color: "text-accent-foreground",
    },
    categorizing_and_scoring: {
      icon: Gauge,
      text: "Categorizing and scoring ...",
      color: "text-accent-foreground",
    },
    computing_overall_score: {
      icon: Calculator,
      text: "Computing overall score ...",
      color: "text-accent-foreground",
    },
    finalizing: {
      icon: Settings2,
      text: "Finalizing",
      color: "text-accent-foreground",
    },
    complete: {
      icon: CheckCircle2,
      text: "Analysis complete",
      color: "text-chart-1",
    },
    error: {
      icon: AlertTriangle,
      text: "Something went wrong",
      color: "text-destructive",
    },
  };

  if (!ongoingJob || !status) {
    return <></>;
  }

  const display = STATUS_DISPLAY[status];
  if (!display) {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-1">
        <Clock className="size-3 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Processing...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center gap-2 py-1">
      <display.icon className={cn(display.color, "size-3")} />
      <span className={cn(display.color, "text-sm")}>{display.text}</span>
    </div>
  );
}

export function ResultCard({ site }: { site: ResultItem }) {
  const { site_name, overall_score, reasoning } = site;
  const displayScore =
    typeof overall_score === "number" && Number.isFinite(overall_score)
      ? getOverallScoreDisplay(overall_score)
      : "—";

  return (
    <Link
      href={`/site/${site._id}`}
      className={cn(
        "!no-underline shrink-0 group",
        "outline-none",
        "rounded-xl transition-all",
      )}
    >
      <Card
        className={cn(
          "w-full max-w-xl",
          "flex flex-col gap-2",
          "group-focus-visible:border-ring group-focus-visible:ring-ring/50 group-focus-visible:ring-[3px] outline-none",
          "group-hover:border-ring group-hover:ring-ring/50 group-hover:ring-[3px]",
          "transition-all duration-200",
        )}
      >
        <CardHeader>
          <CardTitle className="h-full flex items-center row-span-2">
            <h4>{safeSiteName(site_name)}</h4>
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <span className="text-sm">Overall Score /100</span>
            <ScoreVisualizer
              value={typeof displayScore === "number" ? displayScore / 100 : 0}
              displayNumber={displayScore}
              className="md:mr-1"
              size={48}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="text-foreground/80">
            {reasoning || "No analysis summary available."}
          </span>

          <span className="text-accent-foreground text-sm font-medium">
            Click for more details &rarr;
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
