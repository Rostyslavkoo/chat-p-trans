"use client";

import { useMemo, useState } from "react";
import { TopBar } from "~/components/TopBar";
import { StarRating } from "~/components/StarRating";
import { MOCK_RATINGS } from "~/lib/mock-data";
import { useManagersStore } from "~/stores/managers.store";
import { useCurrentSiteId } from "~/hooks/useCurrentSiteId";
import { formatDate } from "~/lib/format-relative-time";

const TIME_RANGES = [
  { value: "7", label: "7 днів" },
  { value: "30", label: "30 днів" },
  { value: "90", label: "90 днів" },
];

export default function RatingsPage() {
  const siteId = useCurrentSiteId();
  const allManagers = useManagersStore((state) => state.managers);
  const [rangeDays, setRangeDays] = useState("90");
  const [managerId, setManagerId] = useState<string>("all");
  // Anchored once per mount rather than read fresh in useMemo — Date.now()
  // is impure and React forbids calling it during render (react-hooks/purity).
  const [now] = useState(() => Date.now());

  const siteManagers = useMemo(
    () => allManagers.filter((manager) => manager.siteId === siteId),
    [allManagers, siteId],
  );

  const findManagerName = (id: string) =>
    siteManagers.find((manager) => manager.id === id)?.name ?? "—";

  const filteredRatings = useMemo(() => {
    const cutoff = now - Number(rangeDays) * 24 * 60 * 60 * 1000;
    const siteManagerIds = new Set(siteManagers.map((manager) => manager.id));

    return MOCK_RATINGS.filter(
      (rating) =>
        siteManagerIds.has(rating.managerId) &&
        new Date(rating.ratedAt).getTime() >= cutoff &&
        (managerId === "all" || rating.managerId === managerId),
    ).sort((a, b) => new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime());
  }, [rangeDays, managerId, now, siteManagers]);

  const averageRating =
    filteredRatings.length > 0
      ? filteredRatings.reduce((sum, rating) => sum + rating.stars, 0) / filteredRatings.length
      : 0;

  return (
    <>
      <TopBar title="Панель підтримки" />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="mb-1 text-xl font-bold text-slate-900">Оцінки клієнтів</h1>
        <p className="mb-6 text-sm text-slate-500">Оцінки клієнтів після закриття розмов.</p>

        <div className="mb-6 flex gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Середня оцінка
            </div>
            <div className="mt-1 flex items-center gap-1 text-2xl font-bold text-slate-900">
              {averageRating.toFixed(1)} <span className="text-brand-yellow">★</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Всього оцінок
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{filteredRatings.length}</div>
          </div>
        </div>

        <div className="mb-4 flex gap-3">
          <select
            value={rangeDays}
            onChange={(event) => setRangeDays(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <select
            value={managerId}
            onChange={(event) => setManagerId(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">Усі менеджери</option>
            {siteManagers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Менеджер</th>
                <th className="px-5 py-3">Розмова</th>
                <th className="px-5 py-3">Оцінка</th>
                <th className="px-5 py-3">Коментар</th>
                <th className="px-5 py-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatings.map((rating) => (
                <tr key={rating.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {findManagerName(rating.managerId)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">#{rating.conversationId.replace("conv-", "")}</td>
                  <td className="px-5 py-3">
                    <StarRating value={rating.stars} />
                  </td>
                  <td className="px-5 py-3 text-slate-700">{rating.comment ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(rating.ratedAt)}</td>
                </tr>
              ))}
              {filteredRatings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Немає оцінок за обраний період
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
