"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Loading() {
  return (
    <motion.section
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-24"
      aria-busy="true"
      aria-live="polite"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="sr-only">Loading site details...</h2>

      <div className="w-full md:col-span-2 flex flex-col gap-6">
        {/* Title area */}
        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start gap-3">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Skeleton className="h-px w-full" />
        </motion.div>

        {/* Category scores */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32 rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="h-24 w-full rounded-3xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </motion.div>
      </div>

      {/* Sidebar skeleton */}
      <motion.div variants={itemVariants} className="w-full md:col-span-1 flex flex-col items-center gap-6">
        <Skeleton className="size-64 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </motion.div>
    </motion.section>
  );
}
