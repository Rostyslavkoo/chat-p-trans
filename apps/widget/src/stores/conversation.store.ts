import { create } from "zustand";

export interface DisplayMessage {
  id: string;
  sender: "manager" | "client";
  text: string;
  createdAt: string;
  /** Client messages only: undefined for manager messages. */
  isRead?: boolean;
}

// TODO: none of this reaches a backend yet — messages are held in memory for
// the current page view only. Replace with real conversation API + realtime
// transport once they exist (see CLAUDE.md decisions 6 and 7).
interface ConversationState {
  hasStarted: boolean;
  clientPhone: string;
  messages: DisplayMessage[];
  startConversation: (input: { phone: string; message: string }) => void;
  addClientMessage: (text: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  hasStarted: false,
  clientPhone: "",
  messages: [],

  startConversation: ({ phone, message }) =>
    set({
      hasStarted: true,
      clientPhone: phone,
      messages: [
        {
          id: crypto.randomUUID(),
          sender: "client",
          text: message,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    }),

  addClientMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          sender: "client",
          text,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    })),
}));
