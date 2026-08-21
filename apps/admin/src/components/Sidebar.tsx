"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@chat-p-trans/shared";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { href: "/admin/sites", label: "Сайти", icon: "🌐" },
    { href: "/admin/managers", label: "Менеджери", icon: "👥" },
  ],
  manager: [
    { href: "/chats", label: "Чати", icon: "💬" },
    { href: "/ratings", label: "Оцінки", icon: "⭐" },
    { href: "/managers", label: "Менеджери", icon: "👥" },
  ],
};

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white p-3">
      {NAV_ITEMS[role].map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
