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
import { useAction } from 'convex/react';
import { ExternalLinkIcon, LoaderCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ResultItem } from '@/convex/actions';
import ScoreVisualizer from '@/components/ui/score-visualizer';

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

  const [state, submit, isPending] = useActionState(
    async (_prev: ActionState, value: SearchValue): Promise<ActionState> => {
      try {
        const searchResults = await searchSite({
          user_input: value.search_term,
        });
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
              <FormItem className="flex-1">
                <FormLabel className="pl-2">
                  Enter a website url or name to see it&apos;s privacy score.
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. google" {...field} />
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

        {state && !state.ok && (
          <p
            className={cn('!text-sm text-center', 'text-red-600')}
            role="alert">
            {state.message}
          </p>
        )}
      </form>

      {state?.ok && state.results && state.results.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-2 -mt-8">
          {state.results.map((site) => (
            <div key={site._id} className="">
              <ResultCard site={site} />
            </div>
          ))}
        </div>
      )}
    </Form>
  );
}

export function ResultCard({ site }: { site: ResultItem }) {
  const { site_name, normalized_base_url, overall_score, reasoning } = site;
  return (
    <Link
      href={`/site/${site._id}`}
      target="_blank"
      className={cn(
        '!no-underline',
        'rounded-xl transition-all',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
        'hover:border-ring hover:ring-ring/50 hover:ring-[3px]'
      )}>
      <Card
        className={cn(
          'w-full max-w-xl',
          'flex flex-col gap-2',
        )}>
        <CardHeader className="">
          <CardTitle className="h-full flex items-center row-span-2">
            <Link
              href={normalized_base_url}
              target="_blank"
              className="flex items-center gap-2">
              <h4>{site_name}</h4>
              <ExternalLinkIcon size={16} className="stroke-primary" />
            </Link>
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
        <CardContent>
          <span className="text-muted-foreground">{reasoning}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
