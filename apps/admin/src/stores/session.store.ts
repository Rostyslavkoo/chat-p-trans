import { create } from "zustand";
import type { AuthenticatedUser, ManagerPresence } from "@chat-p-trans/shared";

// TODO: replace with a real session once auth exists — the user object is set
// directly by the mock login form (see /login page), which matches an email
// against MOCK_LOGIN_ACCOUNTS and ignores the password.
interface SessionState {
  user: AuthenticatedUser | null;
  presence: ManagerPresence;
  logIn: (user: AuthenticatedUser) => void;
  logOut: () => void;
  setPresence: (presence: ManagerPresence) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  presence: "online",
  logIn: (user) => set({ user }),
  logOut: () => set({ user: null }),
  setPresence: (presence) => set({ presence }),
}));
