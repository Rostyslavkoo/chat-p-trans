"use client";

import { TopBar } from "~/components/TopBar";
import { ConversationList } from "~/components/ConversationList";
import { ConversationThread } from "~/components/ConversationThread";
import { ClientDetailPanel } from "~/components/ClientDetailPanel";
import { useConversationsStore } from "~/stores/conversations.store";
import { MOCK_MANAGERS } from "~/lib/mock-data";

export default function ChatsPage() {
  const conversations = useConversationsStore((state) => state.conversations);
  const selectedConversationId = useConversationsStore((state) => state.selectedConversationId);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null;
  const assignedManager = selectedConversation
    ? (MOCK_MANAGERS.find((m) => m.id === selectedConversation.assignedManagerId) ?? null)
    : null;

  return (
    <>
      <TopBar title="Панель підтримки" />
      <div className="flex min-h-0 flex-1">
        <ConversationList />

        {selectedConversation ? (
          <>
            <ConversationThread conversation={selectedConversation} managers={MOCK_MANAGERS} />
            <ClientDetailPanel conversation={selectedConversation} assignedManager={assignedManager} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            Оберіть розмову зі списку
          </div>
        )}
      </div>
    </>
  );
}
