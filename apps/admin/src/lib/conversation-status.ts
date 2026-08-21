import type { ConversationStatus } from "@chat-p-trans/shared";

interface StatusConfig {
  label: string;
  textClass: string;
  bgClass: string;
}

export const CONVERSATION_STATUS_CONFIG: Record<ConversationStatus, StatusConfig> = {
  new: { label: "Нова", textClass: "text-status-new", bgClass: "bg-status-new-bg" },
  in_progress: {
    label: "В роботі",
    textClass: "text-status-in-progress",
    bgClass: "bg-status-in-progress-bg",
  },
  waiting_client: {
    label: "Очікує клієнта",
    textClass: "text-status-waiting",
    bgClass: "bg-status-waiting-bg",
  },
  closed: { label: "Закрита", textClass: "text-status-closed", bgClass: "bg-status-closed-bg" },
};

export const CONVERSATION_STATUS_ORDER: ConversationStatus[] = [
  "new",
  "in_progress",
  "waiting_client",
  "closed",
];
