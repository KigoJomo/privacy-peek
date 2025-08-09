export const isAnalysisStale = (lastAnalyzed: string): boolean => {
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds
  const lastAnalyzedDate = new Date(lastAnalyzed);
  const currentDate = new Date();

  return currentDate.getTime() - lastAnalyzedDate.getTime() > twoWeeksInMs;
  // for testing - always return true;
  // return true;
};

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.RelativeTimeFormat('en', { style: 'short' });
    const diff = date.getTime() - Date.now();

    const units = [
      { unit: 'year', ms: 31536000000 },
      { unit: 'month', ms: 2628000000 },
      { unit: 'day', ms: 86400000 },
      { unit: 'hour', ms: 3600000 },
      { unit: 'minute', ms: 60000 },
    ];

    for (const { unit, ms } of units) {
      if (Math.abs(diff) >= ms) {
        return formatter.format(
          Math.round(diff / ms),
          unit as Intl.RelativeTimeFormatUnit
        );
      }
    }

    return 'Just now';
  } catch (error) {
    console.error('Invalid date format:', dateString, error);
    return '';
  }
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
