import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ANALYSIS_STALE_AFTER_DAYS = 14;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getAnalysisAgeInDays(lastAnalyzed: string): number | null {
  const lastAnalyzedDate = new Date(lastAnalyzed);

  if (Number.isNaN(lastAnalyzedDate.getTime())) {
    return null;
  }

  return Math.max(0, Math.floor((Date.now() - lastAnalyzedDate.getTime()) / DAY_IN_MS));
}

export const isAnalysisStale = (lastAnalyzed: string): boolean => {
  const analysisAgeInDays = getAnalysisAgeInDays(lastAnalyzed);

  return analysisAgeInDays !== null && analysisAgeInDays >= ANALYSIS_STALE_AFTER_DAYS;
};

export function getAnalysisFreshnessLabel(lastAnalyzed: string): string | null {
  const analysisAgeInDays = getAnalysisAgeInDays(lastAnalyzed);

  if (analysisAgeInDays === null) {
    return null;
  }

  if (analysisAgeInDays === 0) {
    return "Checked today";
  }

  if (analysisAgeInDays === 1) {
    return "Checked 1 day ago";
  }

  return `Checked ${analysisAgeInDays} days ago`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { style: "short" });
  const diff = timestamp - Date.now();

  const units = [
    { unit: "year", ms: 31536000000 },
    { unit: "month", ms: 2628000000 },
    { unit: "day", ms: 86400000 },
    { unit: "hour", ms: 3600000 },
    { unit: "minute", ms: 60000 },
  ];

  for (const { unit, ms } of units) {
    if (Math.abs(diff) >= ms) {
      return formatter.format(
        Math.round(diff / ms),
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return "Just now";
}

export function clampScore(
  value: number | null | undefined,
  max: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), max);
}

export function getOverallScoreDisplay(value: number | null | undefined): number {
  return Math.round(clampScore(value, 100));
}

export function getCategoryScoreDisplay(
  value: number | null | undefined,
): number {
  return clampScore(value, 10);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/\-\-+/g, '-');
}
