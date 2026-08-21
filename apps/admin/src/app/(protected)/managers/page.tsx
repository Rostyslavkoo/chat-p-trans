"use client";

import { TopBar } from "~/components/TopBar";
import { Avatar } from "~/components/Avatar";
import { useManagersStore } from "~/stores/managers.store";
import { useSitesStore } from "~/stores/sites.store";
import { useCurrentSiteId } from "~/hooks/useCurrentSiteId";

const PRESENCE_LABELS = {
  online: "Онлайн",
  away: "Відійшов",
  offline: "Офлайн",
} as const;

export default function ManagersPage() {
  const siteId = useCurrentSiteId();
  const allManagers = useManagersStore((state) => state.managers);
  const sites = useSitesStore((state) => state.sites);

  const managers = allManagers.filter((manager) => manager.siteId === siteId);
  const siteName = sites.find((site) => site.id === siteId)?.name ?? "";

  return (
    <>
      <TopBar title="Панель підтримки" />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="mb-1 text-xl font-bold text-slate-900">Менеджери</h1>
        <p className="mb-6 text-sm text-slate-500">Команда підтримки {siteName}</p>

        <div className="flex flex-col gap-3">
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={manager.name} avatarUrl={manager.avatarUrl} presence={manager.presence} />
                <div>
                  <div className="text-sm font-bold text-slate-900">{manager.name}</div>
                  <div className="text-xs text-slate-500">{PRESENCE_LABELS[manager.presence]}</div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Середня оцінка
                  </div>
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-lg font-bold text-slate-900">
                    {manager.averageRating.toFixed(1)} <span className="text-brand-yellow">★</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Чатів сьогодні
                  </div>
                  <div className="mt-0.5 text-lg font-bold text-slate-900">
                    {manager.todayConversationCount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
