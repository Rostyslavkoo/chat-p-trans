import { create } from "zustand";
import type { Conversation, ConversationStatus, Message } from "@chat-p-trans/shared";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "~/lib/mock-data";

// TODO: this store holds mock conversation/message state client-side so the
// inbox UI (take/transfer/close, send message) is interactive without a
// backend. Replace with real API calls + realtime updates once the backend
// and transport exist — see CLAUDE.md decisions 6 and 7. Deliberately not
// wired to the widget app (see CLAUDE.md's "Current implementation status").
interface ConversationsState {
  conversations: Conversation[];
  messagesByConversationId: Record<string, Message[]>;
  selectedConversationId: string | null;
  selectConversation: (conversationId: string) => void;
  setStatus: (conversationId: string, status: ConversationStatus) => void;
  assignManager: (conversationId: string, managerId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  // Holds every site's conversations, the way a backend would; callers filter
  // by the signed-in manager's siteId (see useSiteConversations).
  conversations: MOCK_CONVERSATIONS,
  messagesByConversationId: MOCK_MESSAGES,
  selectedConversationId: null,

  selectConversation: (conversationId) => set({ selectedConversationId: conversationId }),

  setStatus: (conversationId, status) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, status } : conversation,
      ),
    })),

  assignManager: (conversationId, managerId) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, assignedManagerId: managerId, status: "in_progress" }
          : conversation,
      ),
    })),

  sendMessage: (conversationId, text) =>
    set((state) => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversationId,
        sender: "manager",
        text,
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      return {
        messagesByConversationId: {
          ...state.messagesByConversationId,
          [conversationId]: [...(state.messagesByConversationId[conversationId] ?? []), newMessage],
        },
        conversations: state.conversations.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, lastMessageAt: newMessage.createdAt }
            : conversation,
        ),
      };
    }),
}));
