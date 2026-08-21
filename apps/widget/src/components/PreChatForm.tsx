import { useState } from "react";
import { UserRound } from "lucide-react";
import type { WidgetConfig } from "@chat-p-trans/shared";
import { useConversationStore } from "~/stores/conversation.store";
import {
  MESSAGE_MAX_LENGTH,
  validatePreChat,
  type PreChatErrors,
} from "~/lib/validate-pre-chat";

interface PreChatFormProps {
  config: WidgetConfig;
}

export function PreChatForm({ config }: PreChatFormProps) {
  const startConversation = useConversationStore((state) => state.startConversation);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<PreChatErrors>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validatePreChat({ phone, message });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startConversation({ phone: phone.trim(), message: message.trim() });
  };

  return (
    <div className="pre-chat">
      <div className="chat-message chat-message--manager">
        <span className="chat-message__avatar">
          {config.managerAvatarUrl ? (
            <img src={config.managerAvatarUrl} alt="" />
          ) : (
            <UserRound size={18} strokeWidth={2} />
          )}
        </span>
        <span className="chat-message__bubble">{config.welcomeMessage}</span>
      </div>

      <form className="pre-chat__form" onSubmit={handleSubmit} noValidate>
        <div className="pre-chat__field">
          <label className="pre-chat__label" htmlFor="chat-phone">
            Номер телефону
          </label>
          <input
            id="chat-phone"
            type="tel"
            className={`pre-chat__input ${errors.phone ? "pre-chat__input--invalid" : ""}`}
            placeholder="Введіть номер телефону"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {errors.phone && <p className="pre-chat__error">{errors.phone}</p>}
        </div>

        <div className="pre-chat__field">
          <label className="pre-chat__label" htmlFor="chat-message">
            Ваше повідомлення
          </label>
          <textarea
            id="chat-message"
            className={`pre-chat__textarea ${errors.message ? "pre-chat__input--invalid" : ""}`}
            placeholder="Опишіть, чим ми можемо допомогти"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          />
          <div className="pre-chat__meta">
            {errors.message && <p className="pre-chat__error">{errors.message}</p>}
            <span className="pre-chat__counter">
              {message.length}/{MESSAGE_MAX_LENGTH}
            </span>
          </div>
        </div>

        <button type="submit" className="pre-chat__submit">
          Почати чат
        </button>
      </form>
    </div>
  );
}
