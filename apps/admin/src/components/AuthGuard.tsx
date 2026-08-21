"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@chat-p-trans/shared";
import { useSessionStore } from "~/stores/session.store";

interface AuthGuardProps {
  role: UserRole;
  children: React.ReactNode;
}

// TODO: this is a client-side mock guard — once real auth exists, move this
// check into Next.js middleware (see CLAUDE.md's Middleware Pattern) so
// unauthorised requests never render protected pages at all.
export function AuthGuard({ role, children }: AuthGuardProps) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      // Signed in, but on the wrong side of the app — bounce to their own home.
      router.replace(user.role === "admin" ? "/admin/sites" : "/chats");
    }
  }, [user, role, router]);

  if (!user || user.role !== role) return null;

  return children;
}
