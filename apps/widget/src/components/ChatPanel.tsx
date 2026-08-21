import type { WidgetConfig } from "@chat-p-trans/shared";
import { Phone, X, UserRound } from "lucide-react";
import { useWidgetUiStore } from "~/stores/widget-ui.store";
import { useConversationStore } from "~/stores/conversation.store";
import { PreChatForm } from "~/components/PreChatForm";
import { ChatThread } from "~/components/ChatThread";

interface ChatPanelProps {
  config: WidgetConfig;
}

export function ChatPanel({ config }: ChatPanelProps) {
  const close = useWidgetUiStore((state) => state.close);
  const hasStarted = useConversationStore((state) => state.hasStarted);

  return (
    <div className={`chat-panel ${hasStarted ? "chat-panel--thread" : ""}`}>
      <header className="chat-panel__header">
        <div className="chat-panel__manager">
          <span className="chat-panel__avatar">
            {config.managerAvatarUrl ? (
              <img src={config.managerAvatarUrl} alt="" />
            ) : (
              <UserRound size={20} strokeWidth={2} />
            )}
            <span className="chat-panel__presence" />
          </span>
          <div>
            <div className="chat-panel__manager-name">{config.managerName}</div>
            <div className="chat-panel__manager-status">Підтримка P-Trans</div>
          </div>
        </div>

        <div className="chat-panel__actions">
          <a href="tel:" className="chat-panel__icon-button" aria-label="Зателефонувати">
            <Phone size={18} strokeWidth={2} />
          </a>
          <button
            type="button"
            className="chat-panel__icon-button"
            onClick={close}
            aria-label="Закрити чат"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
      </header>

      {hasStarted ? <ChatThread config={config} /> : <PreChatForm config={config} />}
    </div>
  );
}
