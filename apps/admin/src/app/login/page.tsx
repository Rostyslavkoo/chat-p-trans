"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "~/stores/session.store";

export default function LoginPage() {
  const router = useRouter();
  const logIn = useSessionStore((state) => state.logIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: call a real auth endpoint once the backend exists. For now,
    // any non-empty email/password "logs in" as a mock manager.
    const managerName = email.split("@")[0] || "Менеджер";
    logIn(managerName);
    router.push("/chats");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-bold text-brand-navy">Панель підтримки</h1>
        <p className="mb-6 text-sm text-slate-500">Увійдіть, щоб побачити ваші розмови</p>

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
          placeholder="manager@p-trans.com"
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
          className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
