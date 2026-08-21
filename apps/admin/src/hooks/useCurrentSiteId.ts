import { useSessionStore } from "~/stores/session.store";

/**
 * The signed-in manager's site. Everything a manager sees is scoped to it.
 *
 * Returns "" when there is no manager session (admins have no site, and
 * unauthenticated users never reach manager pages — `AuthGuard` redirects
 * first), which filters down to an empty list rather than leaking another
 * site's data.
 */
export function useCurrentSiteId(): string {
  return useSessionStore((state) => state.user?.siteId ?? "");
}
