/** Formats an ISO timestamp as "HH:MM" for message bubbles. */
export function formatMessageTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
