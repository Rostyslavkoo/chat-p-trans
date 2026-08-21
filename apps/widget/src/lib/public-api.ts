import { useWidgetUiStore } from "~/stores/widget-ui.store";
import { useConversationStore } from "~/stores/conversation.store";

/**
 * The one global the widget is allowed to define. Host pages use it to open
 * the chat from their own UI (e.g. a chat icon in a mobile header) instead of
 * relying on the floating bubble:
 *
 *   <button onclick="window.ChatPTrans.open()">…</button>
 *
 * Also lets a host hide the bubble entirely and drive the widget itself.
 */
export interface ChatPTransApi {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  /** Hides the floating bubble; the host is then responsible for opening. */
  hideLauncher: () => void;
  showLauncher: () => void;
  /**
   * Ends the conversation and shows the rating prompt.
   *
   * TODO: this belongs to the manager, and will arrive over the realtime
   * transport once one exists. Exposed here so the closed/rating flow is
   * testable without a backend.
   */
  closeConversation: () => void;
}

declare global {
  interface Window {
    ChatPTrans?: ChatPTransApi;
  }
}

export function exposePublicApi(): void {
  const api: ChatPTransApi = {
    open: () => useWidgetUiStore.getState().open(),
    close: () => useWidgetUiStore.getState().close(),
    toggle: () => useWidgetUiStore.getState().toggle(),
    isOpen: () => useWidgetUiStore.getState().isOpen,
    hideLauncher: () => useWidgetUiStore.getState().setLauncherVisible(false),
    showLauncher: () => useWidgetUiStore.getState().setLauncherVisible(true),
    closeConversation: () => useConversationStore.getState().closeConversation(),
  };

  window.ChatPTrans = api;
}
