"use client";

import { useState } from "react";

const MAX_LENGTH = 1000;

interface MessageComposerProps {
  onSend: (text: string) => void;
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value.slice(0, MAX_LENGTH))}
        onKeyDown={handleKeyDown}
        placeholder="Напишіть відповідь..."
        rows={2}
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          {/* TODO: entry points only — behavior isn't specified in the reference
              screenshots (never shown open). See docs/implementation-plan.md's
              "Explicitly Out of Scope" section before implementing these. */}
          <button type="button" className="flex items-center gap-1 hover:text-slate-700">
            ⚡ Швидкі відповіді
          </button>
          <button type="button" className="flex items-center gap-1 hover:text-slate-700">
            📅 Створити бронювання
          </button>
          <button type="button" className="flex items-center gap-1 hover:text-slate-700">
            📄 Внутрішня нотатка
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {draft.length}/{MAX_LENGTH}
          </span>
          <button
            type="button"
            onClick={handleSend}
            aria-label="Надіслати"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white transition hover:opacity-90"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
