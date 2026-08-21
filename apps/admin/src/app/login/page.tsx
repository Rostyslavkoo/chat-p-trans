"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "~/stores/session.store";
import { MOCK_LOGIN_ACCOUNTS } from "~/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const logIn = useSessionStore((state) => state.logIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: call a real auth endpoint. For now the email decides who you are
    // and the password is ignored entirely.
    const account = MOCK_LOGIN_ACCOUNTS.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!account) {
      setError("Такого користувача немає. Скористайтесь демо-акаунтом нижче.");
      return;
    }

    logIn(account);
    router.push(account.role === "admin" ? "/admin/sites" : "/chats");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-bold text-brand-navy">Панель підтримки</h1>
        <p className="mb-6 text-sm text-slate-500">Увійдіть, щоб продовжити</p>

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
          placeholder="admin@chat-p-trans.com"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
          placeholder="••••••••"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Увійти
        </button>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Демо-акаунти
          </p>
          <div className="flex flex-col gap-1">
            {MOCK_LOGIN_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setError(null);
                }}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-50"
              >
                <span className="text-slate-700">{account.email}</span>
                <span className="text-slate-400">
                  {account.role === "admin" ? "адмін" : "менеджер"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
