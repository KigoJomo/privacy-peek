"use client";

import { motion } from "framer-motion";
import { ShieldQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80dvh] flex flex-col items-center justify-center gap-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShieldQuestion className="size-16 text-muted-foreground/40" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-muted-foreground text-center max-w-md"
      >
        This site hasn&apos;t been analyzed yet, or the analysis no longer exists.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground !no-underline"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </motion.div>
    </section>
  );
}
