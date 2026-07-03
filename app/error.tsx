'use client';

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section
      className="min-h-[80dvh] flex flex-col items-center justify-center gap-6 px-4 text-center"
      role="alert"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <AlertTriangle className="size-16 text-destructive/60" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        Something went wrong
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-muted-foreground max-w-md"
      >
        {error.message || "An unexpected error occurred. Please try again."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <RotateCcw className="size-4" />
          Try again
        </button>
      </motion.div>
    </section>
  );
}
