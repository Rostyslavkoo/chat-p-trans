"use client";

import { useState } from "react";
import { TopBar } from "~/components/TopBar";
import { EmbedSnippet } from "~/components/EmbedSnippet";
import { useSitesStore } from "~/stores/sites.store";
import { formatDate } from "~/lib/format-relative-time";

export default function SitesPage() {
  const sites = useSitesStore((state) => state.sites);
  const addSite = useSitesStore((state) => state.addSite);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    addSite({ name: name.trim(), domain: domain.trim() });
    setName("");
    setDomain("");
    setIsFormOpen(false);
  };

  return (
    <>
      <TopBar title="Адміністрування" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-xl font-bold text-slate-900">Сайти</h1>
            <p className="text-sm text-slate-500">
              Кожен сайт має власний код для вставки. Додайте сайт, скопіюйте його код і вставте
              перед закриваючим тегом &lt;/body&gt; — усі звернення з цього сайту потраплятимуть у
              ваші чати.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="shrink-0 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isFormOpen ? "Скасувати" : "Додати сайт"}
          </button>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="site-name">
                Назва
              </label>
              <input
                id="site-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="P-Trans"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="site-domain">
                Домен
              </label>
              <input
                id="site-domain"
                type="text"
                required
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-navy transition hover:opacity-90"
            >
              Створити
            </button>
          </form>
        )}

        <div className="flex flex-col gap-3">
          {sites.map((site) => (
            <div key={site.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">{site.name}</div>
                  <div className="text-xs text-slate-500">{site.domain}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Site ID
                  </div>
                  <div className="mt-0.5 font-mono text-sm text-slate-900">{site.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Створено
                  </div>
                  <div className="mt-0.5 text-sm text-slate-900">{formatDate(site.createdAt)}</div>
                </div>
              </div>

              <EmbedSnippet siteId={site.id} />
            </div>
          ))}

          {sites.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
              Ще немає жодного сайту. Додайте перший, щоб отримати код для вставки.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
