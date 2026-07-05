"use client";
import { motion } from 'framer-motion';
import RecentSites from './_components/recent-sites';
import SearchComponent from './_components/SearchComponent';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Home() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="flex flex-col items-center gap-10 md:gap-14">
        <motion.div
          variants={childVariants}
          className="w-full flex flex-col items-center gap-3 text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent/50 px-3.5 py-1 text-xs font-medium text-accent-foreground tracking-wide">
            <span className="size-1.5 rounded-full bg-accent-foreground" />
            Privacy Policy Scanner
          </span>
          <h1 className="capitalize leading-none">
            your privacy matters
          </h1>
          <p className="tagline">
            Get clear insights into how websites handle your personal data
          </p>
        </motion.div>

        <motion.div variants={childVariants} className="w-full flex justify-center">
          <SearchComponent />
        </motion.div>
      </section>

      <motion.div
        variants={childVariants}
        className="mt-10 md:mt-16"
      >
        <RecentSites />
      </motion.div>
    </motion.div>
  );
}
