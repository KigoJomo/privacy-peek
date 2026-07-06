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

  const ageMs = Date.now() - lastAnalyzedDate.getTime();
  // Future dates produce negative age — return null (can't be stale from the future)
  if (ageMs < 0) return null;

  return Math.floor(ageMs / DAY_IN_MS);
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

export function getCategoryScoreLabel(score: number): "Good" | "Fair" | "Poor" {
  if (score >= 7) return "Good";
  if (score >= 4) return "Fair";
  return "Poor";
}

export function getCategoryScoreToneClass(score: number): string {
  const label = getCategoryScoreLabel(score);

  if (label === "Good") return "text-chart-1";
  if (label === "Fair") return "text-chart-3";
  return "text-destructive";
}

export function getDomainLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Filter out malformed or non-http(s) URLs */
export function filterValidUrls(urls: (string | undefined | null)[]): string[] {
  return (urls ?? []).filter((u): u is string => {
    if (!u || typeof u !== "string") return false;
    try {
      const parsed = new URL(u);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  });
}

/** Provide a safe fallback for site names */
export function safeSiteName(
  name: string | undefined | null,
  baseUrl?: string | undefined | null,
): string {
  return name?.trim()
    ? name
    : baseUrl?.trim()
      ? getDomainLabel(baseUrl)
      : "Unnamed Site";
}

/** Provide a safe fallback for relative timestamps */
export function safeRelativeTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "Unknown";
  try {
    return formatRelativeTime(dateStr);
  } catch {
    return "Unknown";
  }
}

/** Safely extract the last path segment from a URL, or return the raw url as fallback if it's malformed. */
export function getUrlFilename(url: string): string {
  try {
    return new URL(url).pathname.split("/").pop() || url;
  } catch {
    return url;
  }
}

/**
 * Validate and sanitize a URL for use in an `<a href>` or `<Link href>`.
 * Returns "#" for malformed, missing, or non-http(s) URLs so the browser
 * never treats a relative path as an external link.
 */
export function safeUrl(url: string | undefined | null): string {
  if (!url) return "#";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : "#";
  } catch {
    return "#";
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
