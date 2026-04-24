import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAnalysisStale = (lastAnalyzed: string): boolean => {
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000
  const lastAnalyzedDate = new Date(lastAnalyzed)

  if (Number.isNaN(lastAnalyzedDate.getTime())) {
    return false
  }

  return Date.now() - lastAnalyzedDate.getTime() > twoWeeksInMs
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const formatter = new Intl.RelativeTimeFormat('en', { style: 'short' })
  const diff = date.getTime() - Date.now()

  const units = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
  ]

  for (const { unit, ms } of units) {
    if (Math.abs(diff) >= ms) {
      return formatter.format(
        Math.round(diff / ms),
        unit as Intl.RelativeTimeFormatUnit,
      )
    }
  }

  return 'Just now'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
