import type { Message } from "@chat-p-trans/shared";
import { formatMessageTime } from "~/lib/format-relative-time";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isManager = message.sender === "manager";

  return (
    <div className={`flex ${isManager ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
          isManager
            ? "rounded-br-sm bg-brand-navy text-white"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div
          className={`mt-1 flex items-center gap-1 text-[11px] ${isManager ? "text-white/60" : "text-slate-400"}`}
        >
          {formatMessageTime(message.createdAt)}
          {isManager && <span>{message.readAt ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
}
