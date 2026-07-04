"use client";

import { useState, useEffect, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { LoaderCircle, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ReanalyzeButton({ siteId }: { siteId: Id<"sites"> }) {
  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const reanalyze = useAction(api.actions.reanalyzeSite);
  const router = useRouter();
  const mountedRef = useRef(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const handleReanalyze = async () => {
    setState("analyzing");
    setError(null);
    try {
      await reanalyze({ site_id: siteId });
      if (!mountedRef.current) return;
      setState("done");
      // Give the user a moment to see the success state, then refresh
      refreshTimerRef.current = setTimeout(() => {
        if (mountedRef.current) router.refresh();
      }, 1500);
    } catch (err) {
      if (!mountedRef.current) return;
      setState("error");
      setError(err instanceof Error ? err.message : "Re-analysis failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        onClick={handleReanalyze}
        disabled={state === "analyzing" || state === "done"}
        variant={state === "done" ? "default" : "outline"}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 transition-all",
          state === "done" && "bg-chart-1 text-white hover:bg-chart-1/90 border-chart-1"
        )}
      >
        {state === "idle" && (
          <>
            <RefreshCw className="size-4" />
            Re-analyze
          </>
        )}
        {state === "analyzing" && (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Re-analyzing...
          </>
        )}
        {state === "done" && (
          <>
            <CheckCircle2 className="size-4" />
            Analysis updated!
          </>
        )}
        {state === "error" && (
          <>
            <AlertTriangle className="size-4 text-destructive" />
            Failed — try again
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
