import { create } from "zustand";
import type { Site } from "@chat-p-trans/shared";
import { MOCK_SITES } from "~/lib/mock-data";

// TODO: replace with real API calls once the backend can register sites and
// issue site ids. Until then `addSite` mints an id client-side purely so the
// install-snippet flow is demonstrable — a real id must come from the backend.
interface SitesState {
  sites: Site[];
  addSite: (input: { name: string; domain: string }) => Site;
}

function generateSiteId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const suffix = crypto.randomUUID().slice(0, 6);
  return `${slug || "site"}-${suffix}`;
}

export const useSitesStore = create<SitesState>((set) => ({
  sites: MOCK_SITES,

  addSite: ({ name, domain }) => {
    const site: Site = {
      id: generateSiteId(name),
      name,
      domain,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ sites: [...state.sites, site] }));
    return site;
  },
}));
