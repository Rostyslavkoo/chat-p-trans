"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ManagerPresence } from "@chat-p-trans/shared";
import { useSessionStore } from "~/stores/session.store";

const PRESENCE_LABELS: Record<ManagerPresence, string> = {
  online: "Онлайн",
  away: "Відійшов",
  offline: "Офлайн",
};

const PRESENCE_DOT_CLASS: Record<ManagerPresence, string> = {
  online: "bg-presence-online",
  away: "bg-presence-away",
  offline: "bg-presence-offline",
};

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const presence = useSessionStore((state) => state.presence);
  const setPresence = useSessionStore((state) => state.setPresence);
  const logOut = useSessionStore((state) => state.logOut);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isManager = user?.role === "manager";

  const handleLogOut = () => {
    logOut();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>

      <div className="relative flex items-center gap-4">
        {isManager && (
          <button type="button" aria-label="Звук сповіщень" className="text-slate-500 hover:text-slate-700">
            🔊
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-slate-100"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-light text-sm text-white">
            {user?.name ? user.name[0].toUpperCase() : "?"}
            {isManager && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${PRESENCE_DOT_CLASS[presence]}`}
              />
            )}
          </span>
          <span className="text-sm font-medium text-slate-700">
            {isManager ? PRESENCE_LABELS[presence] : user?.name}
          </span>
          <span className="text-xs text-slate-400">▾</span>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 top-12 z-20 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {isManager &&
                (Object.keys(PRESENCE_LABELS) as ManagerPresence[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setPresence(option);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span className={`h-2 w-2 rounded-full ${PRESENCE_DOT_CLASS[option]}`} />
                    {PRESENCE_LABELS[option]}
                  </button>
                ))}

              {isManager && <div className="my-1 border-t border-slate-200" />}

              <button
                type="button"
                onClick={handleLogOut}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Вийти
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
