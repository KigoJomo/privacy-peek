"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SearchSchema = z.object({
  search_term: z.string().min(3, "search term must be at least 3 characters."),
});

type SearchValue = z.infer<typeof SearchSchema>;

type SearchResult = {
  _id: Id<"sites">;
  site_name: string;
  normalized_base_url: string;
};

type ActionState =
  | { ok: true; message: string; results?: SearchResult[] }
  | { ok: false; message: string }
  | null;

const initialState: ActionState = null;

export default function SearchInput() {
  const form = useForm<SearchValue>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { search_term: "" },
    mode: "onSubmit",
  });

  const searchSite = useAction(api.actions.checkExistingRecord);

  const [state, submit, isPending] = useActionState(
    async (_prev: ActionState, value: SearchValue): Promise<ActionState> => {
      try {
        const searchResults = await searchSite({
          user_input: value.search_term,
        });
        return {
          ok: true,
          message: "Analysis Complete!",
          results: searchResults,
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          return { ok: false, message: error.message };
        } else {
          console.log("Failed to retrieve site analysis.");
          return { ok: false, message: "Failed to retrieve site analysis!" };
        }
      }
    },
    initialState,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((value) => {
          startTransition(() => {
            submit(value);
          });
        })}
        className={cn("w-full max-w-xl flex flex-col gap-2")}
      >
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
            variant={"outline"}
            size={"icon"}
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Search />}
          </Button>
        </div>

        {state && (
          <p
            className={cn(
              "!text-sm text-center mb-2",
              state.ok ? "text-green-600" : "text-red-600",
            )}
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        )}
      </form>

      {state?.ok && state.results && (
        <Card className={cn("w-full max-w-xl", "flex flex-col gap-2")}>
          {state.results.length > 0 ? (
            <>
              <CardHeader className="!text-sm">
                <CardTitle>
                  <h3>Results for &apos;{form.watch("search_term")}&apos;</h3>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {state.results.map((result) => (
                  <div key={result._id} className="flex flex-col gap-1">
                    <h3>{result.site_name}</h3>
                    <Link href={result.normalized_base_url} target="_blank">
                      {result.normalized_base_url}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="">
                <CardTitle>
                  <h3>Not found!</h3>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="!text-sm text-muted-foreground border-l-4 pl-2">
                  Sorry. We could not get a privacy analysis for &apos;
                  {form.watch("search_term")}&apos;
                </p>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </Form>
  );
}
