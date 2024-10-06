/**
 * Convert a date to a relative time string, such as "a minute ago", "in 2 hours",
 * "yesterday", "3 months ago", etc. using Intl.RelativeTimeFormat.
 * REF: https://www.builder.io/blog/relative-time
 */
export function formatRelativeTime(
  date: Date | number,
  lang = navigator.language
): string {
  const timeMs = typeof date === "number" ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export const formatUTCDate = (date: string) => new Date(date).toDateString();

export const pluralise = (count: number, noun: string, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const enumToArray = (enumObj: Record<string, string>) =>
  Object.keys(enumObj).map((key) => ({ key, value: enumObj[key] }));
