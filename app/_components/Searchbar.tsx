// app/_components/Searchbar.tsx
'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuickSearchSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  AnalyzeState,
  analyzeWebsiteAction,
  SearchResult,
} from './search_action';
import { Loader2Icon } from 'lucide-react';

interface SearchBarProps {
  onSearchResult?: (result: SearchResult) => void;
}

export function Searchbar({ onSearchResult }: SearchBarProps) {
  const [state, formAction, isPending] = useActionState(analyzeWebsiteAction, {
    isLoading: false,
  } as AnalyzeState);

  const form = useForm<z.infer<typeof QuickSearchSchema>>({
    resolver: zodResolver(QuickSearchSchema),
    defaultValues: { search_term: '' },
  });

  useEffect(() => {
    if (state.result && onSearchResult) {
      onSearchResult(state.result);
    }
  }, [state.result, onSearchResult]);

  return (
    <Form {...form}>
      <form action={formAction} className="w-full flex items-end gap-2">
        <FormField
          control={form.control}
          name="search_term"
          render={({ field }) => (
            <FormItem className="flex-1 gap-4">
              <FormLabel className="text-muted-foreground">
                Enter a website url or name to see it&apos;s privacy score.
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., google.com, or, Google"
                  {...field}
                  className="py-6 px-6"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>

      {state.isLoading ? (
        <>
          <Loader2Icon size={32} className="animate-spin mx-auto" />
        </>
      ) : state.error ? (
        <>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{state.error}</p>
          </div>
        </>
      ) : null}
    </Form>
  );
}
