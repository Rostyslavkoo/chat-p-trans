import { useState } from "react";
import type { WidgetConfig } from "@chat-p-trans/shared";
import { useWidgetUiStore } from "~/stores/widget-ui.store";

interface DisplayMessage {
  id: string;
  sender: "manager" | "client";
  text: string;
}

interface ChatPanelProps {
  config: WidgetConfig;
}

export function ChatPanel({ config }: ChatPanelProps) {
  const close = useWidgetUiStore((state) => state.close);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: "welcome", sender: "manager", text: config.welcomeMessage },
  ]);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "client", text }]);
    setDraft("");
  };

  return (
    <div className="chat-panel">
      <header className="chat-panel__header">
        <div className="chat-panel__manager">
          <span className="chat-panel__avatar">
            {config.managerAvatarUrl ? <img src={config.managerAvatarUrl} alt="" /> : "👩"}
          </span>
          <div>
            <div className="chat-panel__manager-name">{config.managerName}</div>
            <div className="chat-panel__manager-status">Підтримка P-Trans</div>
          </div>
        </div>
        <button type="button" className="chat-panel__close" onClick={close} aria-label="Закрити чат">
          ✕
        </button>
      </header>

      <div className="chat-panel__messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message chat-message--${message.sender}`}>
            {message.text}
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
        <button type="button" className="chat-panel__send" onClick={handleSend} aria-label="Надіслати">
          ➤
        </button>
      </div>
    </div>
  );
}
