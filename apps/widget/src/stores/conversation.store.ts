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
// the current page view only, and the manager side is simulated locally (see
// useMockManagerReplies). Replace with real conversation API + realtime
// transport once they exist (see CLAUDE.md decisions 6 and 7).
interface ConversationState {
  hasStarted: boolean;
  clientPhone: string;
  messages: DisplayMessage[];
  isManagerTyping: boolean;
  /** Set when the manager closes the chat — triggers the rating prompt. */
  isClosed: boolean;
  /** True once the visitor rated or skipped, so the prompt isn't shown twice. */
  isRatingResolved: boolean;
  startConversation: (input: { phone: string; message: string }) => void;
  addClientMessage: (text: string) => void;
  markClientMessagesRead: () => void;
  setManagerTyping: (isTyping: boolean) => void;
  addManagerMessage: (text: string) => void;
  closeConversation: () => void;
  submitRating: (input: { stars: number; comment: string }) => void;
  skipRating: () => void;
}

function createClientMessage(text: string): DisplayMessage {
  return {
    id: crypto.randomUUID(),
    sender: "client",
    text,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
}

export const useConversationStore = create<ConversationState>((set) => ({
  hasStarted: false,
  clientPhone: "",
  messages: [],
  isManagerTyping: false,
  isClosed: false,
  isRatingResolved: false,

  startConversation: ({ phone, message }) =>
    set({
      hasStarted: true,
      clientPhone: phone,
      messages: [createClientMessage(message)],
    }),

  addClientMessage: (text) =>
    set((state) => ({ messages: [...state.messages, createClientMessage(text)] })),

  markClientMessagesRead: () =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.sender === "client" ? { ...message, isRead: true } : message,
      ),
    })),

  setManagerTyping: (isTyping) => set({ isManagerTyping: isTyping }),

  addManagerMessage: (text) =>
    set((state) => ({
      isManagerTyping: false,
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          sender: "manager",
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  closeConversation: () => set({ isClosed: true, isManagerTyping: false }),

  // TODO: POST the rating once the backend exposes an endpoint. For now it's
  // accepted locally so the flow is demonstrable end to end.
  submitRating: () => set({ isRatingResolved: true }),

  skipRating: () => set({ isRatingResolved: true }),
}));

