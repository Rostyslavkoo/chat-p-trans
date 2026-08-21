import { create } from "zustand";
import type { ManagerPresence } from "@chat-p-trans/shared";

// TODO: replace with a real session once auth exists — `isAuthenticated`
// is set directly by the mock login form for now (see /login page).
interface SessionState {
  isAuthenticated: boolean;
  managerName: string;
  managerAvatarUrl: string | null;
  presence: ManagerPresence;
  logIn: (managerName: string) => void;
  logOut: () => void;
  setPresence: (presence: ManagerPresence) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  managerName: "",
  managerAvatarUrl: null,
  presence: "online",
  logIn: (managerName) => set({ isAuthenticated: true, managerName }),
  logOut: () => set({ isAuthenticated: false, managerName: "" }),
  setPresence: (presence) => set({ presence }),
}));
