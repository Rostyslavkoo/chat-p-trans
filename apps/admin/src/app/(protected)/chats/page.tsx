"use client";

import { useEffect, useMemo } from "react";
import { TopBar } from "~/components/TopBar";
import { ConversationList } from "~/components/ConversationList";
import { ConversationThread } from "~/components/ConversationThread";
import { ClientDetailPanel } from "~/components/ClientDetailPanel";
import { useConversationsStore } from "~/stores/conversations.store";
import { useManagersStore } from "~/stores/managers.store";
import { useCurrentSiteId } from "~/hooks/useCurrentSiteId";

export default function ChatsPage() {
  const siteId = useCurrentSiteId();
  const allConversations = useConversationsStore((state) => state.conversations);
  const selectedConversationId = useConversationsStore((state) => state.selectedConversationId);
  const selectConversation = useConversationsStore((state) => state.selectConversation);
  const allManagers = useManagersStore((state) => state.managers);

  const conversations = useMemo(
    () => allConversations.filter((conversation) => conversation.siteId === siteId),
    [allConversations, siteId],
  );

  const siteManagers = useMemo(
    () => allManagers.filter((manager) => manager.siteId === siteId),
    [allManagers, siteId],
  );

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  // Land on the first conversation of this manager's site, and recover if the
  // selected one belongs to another site (or was filtered away).
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      selectConversation(conversations[0].id);
    }
  }, [selectedConversation, conversations, selectConversation]);

  const assignedManager = selectedConversation
    ? (siteManagers.find((manager) => manager.id === selectedConversation.assignedManagerId) ?? null)
    : null;

  return (
    <>
      <TopBar title="Панель підтримки" />
      <div className="flex min-h-0 flex-1">
        <ConversationList conversations={conversations} />

        {selectedConversation ? (
          <>
            <ConversationThread conversation={selectedConversation} managers={siteManagers} />
            <ClientDetailPanel conversation={selectedConversation} assignedManager={assignedManager} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            {conversations.length === 0 ? "Поки немає жодної розмови" : "Оберіть розмову зі списку"}
          </div>
        )}
      </div>
    </>
  );
}
