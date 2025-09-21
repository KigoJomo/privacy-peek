'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction, useMutation, useQuery } from 'convex/react';
import {
  LoaderCircle,
  Search,
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
} from 'lucide-react';
import Link from 'next/link';
import { startTransition, useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ResultItem } from '@/convex/actions';
import ScoreVisualizer from '@/components/ui/score-visualizer';
import { Id } from '@/convex/_generated/dataModel';
import type { AnalysisStatus } from '@/convex/lib';

const SearchSchema = z.object({
  search_term: z.string().min(3, 'search term must be at least 3 characters.'),
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
    defaultValues: { search_term: '' },
    mode: 'onSubmit',
  });

  const searchSite = useAction(api.actions.getSiteAnalysis);
  const createJob = useMutation(api.analysisJobs.createJob);
  const [jobId, setJobId] = useState<Id<'analysisJobs'> | null>(null);
  const [displayedResults, setDisplayedResults] = useState<ResultItem[] | null>(
    null
  );

  const [state, submit, isPending] = useActionState(
    async (_prev: ActionState, value: SearchValue): Promise<ActionState> => {
      setDisplayedResults([]);
      
      try {
        const analysisJobId = await createJob({
          site_input: value.search_term,
        });
        setJobId(analysisJobId);

        const searchResults = await searchSite({
          user_input: value.search_term,
          job_id: analysisJobId,
        });

        setDisplayedResults(searchResults);

        return {
          ok: true,
          message: 'Analysis Complete!',
          results: searchResults,
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          return { ok: false, message: error.message };
        } else {
          console.log('Failed to retrieve site analysis.');
          return { ok: false, message: 'Failed to retrieve site analysis!' };
        }
      } finally {
        setTimeout(() => {
          setJobId(null);
        }, 3000);
      }
    },
    initialState
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((value) => {
          startTransition(() => {
            submit(value);
          });
        })}
        className={cn('w-full max-w-xl flex flex-col gap-2')}>
        <div className="w-full flex items-end gap-1">
          <FormField
            control={form.control}
            name="search_term"
            render={({ field }) => (
              <FormItem className="flex-1 gap-4">
                <FormLabel className="pl-2">
                  Search an app or website to see how it performs.
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name or url." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            variant={'outline'}
            size={'icon'}>
            {isPending ? <LoaderCircle className="animate-spin" /> : <Search />}
          </Button>
        </div>

        {jobId && <JobStatus job_id={jobId} />}

        {state && !state.ok && (
          <p
            className={cn('!text-sm text-center', 'text-red-600')}
            role="alert">
            {state.message}
          </p>
        )}
      </form>

      {displayedResults && displayedResults.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-2 -mt-8">
          {displayedResults.map((site) => (
            <div key={site._id} className="">
              <ResultCard site={site} />
            </div>
          ))}
        </div>
      )}
    </Form>
  );
}

function JobStatus({ job_id }: { job_id: Id<'analysisJobs'> }) {
  const ongoingJob = useQuery(api.analysisJobs.getJob, { job_id });
  const status = ongoingJob?.status;

  type StatusColor =
    | 'text-muted-foreground'
    | 'text-accent-foreground'
    | 'text-destructive'
    | 'text-chart-1';

  const STATUS_DISPLAY: Record<
    AnalysisStatus,
    { icon: LucideIcon; text: string; color: StatusColor }
  > = {
    queued: {
      icon: Clock,
      text: 'Queued',
      color: 'text-muted-foreground',
    },
    checking_recent: {
      icon: History,
      text: 'Checking recent analyses ...',
      color: 'text-muted-foreground',
    },
    getting_site_info: {
      icon: Globe,
      text: 'Getting site information ...',
      color: 'text-accent-foreground',
    },
    reading_policies: {
      icon: BookOpenText,
      text: 'Reading policy documents ...',
      color: 'text-accent-foreground',
    },
    categorizing_and_scoring: {
      icon: Gauge,
      text: 'Categorizing and scoring ...',
      color: 'text-accent-foreground',
    },
    computing_overall_score: {
      icon: Calculator,
      text: 'Computing overall score ...',
      color: 'text-accent-foreground',
    },
    finalizing: {
      icon: Settings2,
      text: 'Finalizing',
      color: 'text-accent-foreground',
    },
    complete: {
      icon: CheckCircle2,
      text: 'Analysis complete',
      color: 'text-chart-1',
    },
    error: {
      icon: AlertTriangle,
      text: 'Something went wrong',
      color: 'text-destructive',
    },
  };

  if (!ongoingJob || !status) {
    return <></>;
  }

  const display = STATUS_DISPLAY[status];

  return (
    <>
      <div className="w-full flex items-center gap-2">
        <display.icon className={cn(display.color)} size={12} />
        <span className={cn(display.color, 'text-sm')}>{display.text}</span>
      </div>
    </>
  );
}

export function ResultCard({ site }: { site: ResultItem }) {
  const { site_name, overall_score, reasoning } = site;
  return (
    <Link
      href={`/site/${site._id}`}
      target="_blank"
      className={cn(
        '!no-underline shrink-0 group',
        'outline-none',
        'rounded-xl transition-all'
      )}>
      <Card
        className={cn(
          'w-full max-w-xl',
          'flex flex-col gap-2',
          'group-focus-visible:border-ring group-focus-visible:ring-ring/50 group-focus-visible:ring-[3px] outline-none',
          'group-hover:border-ring group-hover:ring-ring/50 group-hover:ring-[3px]',
          'transition-all'
        )}>
        <CardHeader className="">
          <CardTitle className="h-full flex items-center row-span-2">
            <h4>{site_name}</h4>
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <span className="text-sm">Overall Score /100</span>
            <ScoreVisualizer
              value={(overall_score ?? 0) / 100}
              displayNumber={Math.round(overall_score)}
              className="md:mr-1"
              size={48}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="text-muted-foreground">{reasoning}</span>

          <span className="text-accent-foreground text-sm">
            Click for more details.
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
