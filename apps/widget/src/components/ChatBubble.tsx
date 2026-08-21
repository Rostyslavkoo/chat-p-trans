import { MessageCircle, UserRound } from "lucide-react";
import type { WidgetConfig } from "@chat-p-trans/shared";
import { useWidgetUiStore } from "~/stores/widget-ui.store";

interface ChatBubbleProps {
  config: WidgetConfig;
}

export function ChatBubble({ config }: ChatBubbleProps) {
  const open = useWidgetUiStore((state) => state.open);

  return (
    <button type="button" className="chat-bubble" onClick={open}>
      <span className="chat-bubble__avatar">
        {config.managerAvatarUrl ? (
          <img src={config.managerAvatarUrl} alt="" />
        ) : (
          <UserRound size={20} strokeWidth={2} />
        )}
        <span className="chat-bubble__presence" />
      </span>

      <span className="chat-bubble__text">
        Потрібна допомога?
        <br />
        Залиште повідомлення
      </span>

      <span className="chat-bubble__icon">
        <MessageCircle size={20} strokeWidth={2} />
      </span>
    </button>
  );
}
