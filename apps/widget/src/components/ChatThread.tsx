import { useState } from "react";
import { SendHorizontal, UserRound, Check, CheckCheck } from "lucide-react";
import type { WidgetConfig } from "@chat-p-trans/shared";
import { useConversationStore } from "~/stores/conversation.store";
import { formatMessageTime } from "~/lib/format-time";

interface ChatThreadProps {
  config: WidgetConfig;
}

export function ChatThread({ config }: ChatThreadProps) {
  const messages = useConversationStore((state) => state.messages);
  const addClientMessage = useConversationStore((state) => state.addClientMessage);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    addClientMessage(text);
    setDraft("");
  };

  return (
    <>
      <div className="chat-panel__messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message chat-message--${message.sender}`}>
            {message.sender === "manager" && (
              <span className="chat-message__avatar">
                {config.managerAvatarUrl ? (
                  <img src={config.managerAvatarUrl} alt="" />
                ) : (
                  <UserRound size={18} strokeWidth={2} />
                )}
              </span>
            )}

            <span className="chat-message__bubble">
              {message.text}
              <span className="chat-message__meta">
                {formatMessageTime(message.createdAt)}
                {message.sender === "client" &&
                  (message.isRead ? (
                    <CheckCheck size={14} strokeWidth={2} />
                  ) : (
                    <Check size={14} strokeWidth={2} />
                  ))}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="chat-panel__footer">
        <input
          className="chat-panel__input"
          type="text"
          placeholder="Напишіть повідомлення..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSend()}
        />
        <button
          type="button"
          className="chat-panel__send"
          onClick={handleSend}
          aria-label="Надіслати"
          disabled={!draft.trim()}
        >
          <SendHorizontal size={18} strokeWidth={2} />
        </button>
      </div>
    </>
  );
}
