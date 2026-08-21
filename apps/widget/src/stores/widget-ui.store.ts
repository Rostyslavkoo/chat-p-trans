import { create } from "zustand";

interface WidgetUiState {
  isOpen: boolean;
  /** The floating bubble. A host page can hide it and open the chat itself
      via window.ChatPTrans (see lib/public-api.ts). */
  isLauncherVisible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setLauncherVisible: (isVisible: boolean) => void;
}

export const useWidgetUiStore = create<WidgetUiState>((set) => ({
  isOpen: false,
  isLauncherVisible: true,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setLauncherVisible: (isVisible) => set({ isLauncherVisible: isVisible }),
}));
