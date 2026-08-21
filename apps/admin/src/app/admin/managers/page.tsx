"use client";

import { useState } from "react";
import { TopBar } from "~/components/TopBar";
import { Avatar } from "~/components/Avatar";
import { useManagersStore } from "~/stores/managers.store";
import { useSitesStore } from "~/stores/sites.store";

export default function AdminManagersPage() {
  const sites = useSitesStore((state) => state.sites);
  const managers = useManagersStore((state) => state.managers);
  const addManager = useManagersStore((state) => state.addManager);
  const removeManager = useManagersStore((state) => state.removeManager);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !siteId) return;

    addManager({ name: name.trim(), email: email.trim(), siteId });
    setName("");
    setEmail("");
    setIsFormOpen(false);
  };

  return (
    <>
      <TopBar title="Адміністрування" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-xl font-bold text-slate-900">Менеджери</h1>
            <p className="text-sm text-slate-500">
              Кожен менеджер прив&apos;язаний до одного сайту й бачить лише його чати.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            disabled={sites.length === 0}
            className="shrink-0 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {isFormOpen ? "Скасувати" : "Додати менеджера"}
          </button>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="manager-name">
                Ім&apos;я
              </label>
              <input
                id="manager-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Анна Ковальчук"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="manager-email">
                Email
              </label>
              <input
                id="manager-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="anna@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="manager-site">
                Сайт
              </label>
              <select
                id="manager-site"
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-navy transition hover:opacity-90"
            >
              Створити
            </button>
          </form>
        )}

        <div className="flex flex-col gap-6">
          {sites.map((site) => {
            const siteManagers = managers.filter((manager) => manager.siteId === site.id);

            return (
              <section key={site.id}>
                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                  {site.name}
                  <span className="ml-2 font-normal text-slate-400">{site.domain}</span>
                </h2>

                <div className="flex flex-col gap-2">
                  {siteManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={manager.name} avatarUrl={manager.avatarUrl} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{manager.name}</div>
                          <div className="text-xs text-slate-500">{manager.email}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeManager(manager.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Видалити
                      </button>
                    </div>
                  ))}

                  {siteManagers.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-6 text-center text-sm text-slate-400">
                      Для цього сайту ще немає менеджерів
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
