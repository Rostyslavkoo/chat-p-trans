import type { ConversationStatus } from "@chat-p-trans/shared";
import { CONVERSATION_STATUS_CONFIG } from "~/lib/conversation-status";

interface StatusBadgeProps {
  status: ConversationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = CONVERSATION_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${config.textClass} ${config.bgClass}`}
    >
      {config.label}
    </span>
  );
}
