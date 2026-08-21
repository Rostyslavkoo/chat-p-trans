"use client";

import { useState } from "react";
import type { Conversation, Manager } from "@chat-p-trans/shared";
import { useConversationsStore } from "~/stores/conversations.store";
import { useSessionStore } from "~/stores/session.store";
import { Avatar } from "~/components/Avatar";
import { StatusDropdown } from "~/components/StatusDropdown";
import { MessageBubble } from "~/components/MessageBubble";
import { MessageComposer } from "~/components/MessageComposer";
import { TransferManagerModal } from "~/components/TransferManagerModal";

interface ConversationThreadProps {
  conversation: Conversation;
  managers: Manager[];
}

export function ConversationThread({ conversation, managers }: ConversationThreadProps) {
  const messages = useConversationsStore(
    (state) => state.messagesByConversationId[conversation.id] ?? [],
  );
  const setStatus = useConversationsStore((state) => state.setStatus);
  const assignManager = useConversationsStore((state) => state.assignManager);
  const sendMessage = useConversationsStore((state) => state.sendMessage);
  const currentUserId = useSessionStore((state) => state.user?.id ?? null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const isUnassigned = conversation.assignedManagerId === null;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={conversation.clientName} size="sm" />
          <div>
            <div className="text-sm font-bold text-slate-900">{conversation.clientName}</div>
            <div className="text-xs text-slate-500">{conversation.clientPhone}</div>
          </div>
          <StatusDropdown status={conversation.status} onChange={(status) => setStatus(conversation.id, status)} />
        </div>

        <div className="flex items-center gap-2">
          {isUnassigned && currentUserId && (
            <button
              type="button"
              onClick={() => assignManager(conversation.id, currentUserId)}
              className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-navy transition hover:opacity-90"
            >
              Взяти в роботу
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            👤➜ Передати
          </button>
          <button
            type="button"
            onClick={() => setStatus(conversation.id, "closed")}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            ✕ Закрити
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageComposer onSend={(text) => sendMessage(conversation.id, text)} />

      {isTransferOpen && (
        <TransferManagerModal
          managers={managers.filter((manager) => manager.id !== currentUserId)}
          onClose={() => setIsTransferOpen(false)}
          onSelect={(managerId) => {
            assignManager(conversation.id, managerId);
            setIsTransferOpen(false);
          }}
        />
      )}
    </div>
  );
}
