const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Formats a past ISO timestamp as "4 хв" / "2 год" / "3 дн" relative to `now`.
 * `now` must be passed explicitly (e.g. from a `useState(() => Date.now())`
 * anchor) — reading the clock inside this function would make callers that
 * invoke it during render impure (react-hooks/purity).
 */
export function formatRelativeTime(isoTimestamp: string, now: number): string {
  const diffMs = now - new Date(isoTimestamp).getTime();

  if (diffMs < MINUTE_MS) return "щойно";
  if (diffMs < HOUR_MS) return `${Math.floor(diffMs / MINUTE_MS)} хв`;
  if (diffMs < DAY_MS) return `${Math.floor(diffMs / HOUR_MS)} год`;
  return `${Math.floor(diffMs / DAY_MS)} дн`;
}

/** Formats an ISO timestamp as "HH:MM" for message bubbles. */
export function formatMessageTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

/** Formats an ISO timestamp as "DD.MM.YYYY" for tables/detail panels. */
export function formatDate(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
