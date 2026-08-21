"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "~/stores/session.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

// TODO: this is a client-side mock guard — once real auth exists, move this
// check into Next.js middleware (see CLAUDE.md's Middleware Pattern) so
// unauthenticated requests never render protected pages at all.
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return children;
}
