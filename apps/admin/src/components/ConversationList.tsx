"use client";

import { useMemo, useState } from "react";
import type { Conversation } from "@chat-p-trans/shared";
import { useConversationsStore } from "~/stores/conversations.store";
import { Avatar } from "~/components/Avatar";
import { StatusBadge } from "~/components/StatusBadge";
import { formatRelativeTime } from "~/lib/format-relative-time";

type TabKey = "new" | "mine" | "active" | "closed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "new", label: "Нові" },
  { key: "mine", label: "Моі" },
  { key: "active", label: "Активні" },
  { key: "closed", label: "Закриті" },
];

function matchesTab(conversation: Conversation, tab: TabKey, currentManagerId: string | null): boolean {
  switch (tab) {
    case "new":
      return conversation.status === "new";
    case "mine":
      return conversation.assignedManagerId === currentManagerId;
    case "active":
      return conversation.status !== "closed";
    case "closed":
      return conversation.status === "closed";
  }
}

export function ConversationList() {
  const conversations = useConversationsStore((state) => state.conversations);
  const selectedConversationId = useConversationsStore((state) => state.selectedConversationId);
  const selectConversation = useConversationsStore((state) => state.selectConversation);
  const messagesByConversationId = useConversationsStore((state) => state.messagesByConversationId);
  // TODO: there's no real manager id in the mock session yet — using the
  // first mock manager as a stand-in so the "Мої" tab has something to show.
  const currentManagerId = "manager-anna";

  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [search, setSearch] = useState("");
  // Anchored once per mount — Date.now() may not be called during render
  // (react-hooks/purity). Good enough for a "4 хв"/"2 год" label; it won't
  // auto-refresh without a re-render, which is acceptable for this UI.
  const [now] = useState(() => Date.now());

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map(({ key }) => [key, conversations.filter((c) => matchesTab(c, key, currentManagerId)).length]),
      ) as Record<TabKey, number>,
    [conversations, currentManagerId],
  );

  const visibleConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return conversations
      .filter((c) => matchesTab(c, activeTab, currentManagerId))
      .filter(
        (c) =>
          !term || c.clientName.toLowerCase().includes(term) || c.clientPhone.toLowerCase().includes(term),
      )
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations, activeTab, currentManagerId, search]);

  return (
    <div className="flex w-96 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="p-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Пошук за телефоном, іменем, повід..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="flex gap-1 border-b border-slate-200 px-3 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-brand-navy text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab.label} {tabCounts[tab.key]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {visibleConversations.map((conversation) => {
          const lastMessage = messagesByConversationId[conversation.id]?.at(-1);
          const isSelected = conversation.id === selectedConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => selectConversation(conversation.id)}
              className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition ${
                isSelected ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <Avatar name={conversation.clientName} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {conversation.clientName}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatRelativeTime(conversation.lastMessageAt, now)}
                  </span>
                </div>
                <p className="truncate text-sm text-slate-500">
                  {lastMessage?.sender === "manager" ? "Ви: " : ""}
                  {lastMessage?.text ?? "—"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={conversation.status} />
                  {conversation.unreadCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-brand-navy">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
