import { create } from "zustand";

interface WidgetUiState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useWidgetUiStore = create<WidgetUiState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
