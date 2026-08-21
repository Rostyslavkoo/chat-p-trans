import { create } from "zustand";
import type { Manager } from "@chat-p-trans/shared";
import { MOCK_MANAGERS } from "~/lib/mock-data";

// TODO: replace with real API calls once the backend can create manager
// accounts. `addManager` mints an id client-side purely so the admin flow is
// demonstrable; a real account (and its credentials) must come from the backend.
interface ManagersState {
  managers: Manager[];
  addManager: (input: { name: string; email: string; siteId: string }) => Manager;
  removeManager: (managerId: string) => void;
}

export const useManagersStore = create<ManagersState>((set) => ({
  managers: MOCK_MANAGERS,

  addManager: ({ name, email, siteId }) => {
    const manager: Manager = {
      id: `manager-${crypto.randomUUID().slice(0, 8)}`,
      siteId,
      name,
      email,
      avatarUrl: null,
      presence: "offline",
      todayConversationCount: 0,
      averageRating: 0,
    };
    set((state) => ({ managers: [...state.managers, manager] }));
    return manager;
  },

  removeManager: (managerId) =>
    set((state) => ({ managers: state.managers.filter((manager) => manager.id !== managerId) })),
}));
