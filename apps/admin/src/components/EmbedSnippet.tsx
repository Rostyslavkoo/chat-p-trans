"use client";

import { useState } from "react";

// TODO: point this at the real CDN/host once widget.js is deployed somewhere.
// Local dev serves it from the widget workspace (`npm run dev:widget:embed`).
const WIDGET_SCRIPT_URL = "http://localhost:5173/widget.js";

interface EmbedSnippetProps {
  siteId: string;
}

export function EmbedSnippet({ siteId }: EmbedSnippetProps) {
  const [isCopied, setIsCopied] = useState(false);

  const snippet = `<script src="${WIDGET_SCRIPT_URL}" data-site-id="${siteId}" async defer></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Код для вставки
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          {isCopied ? "Скопійовано ✓" : "Копіювати"}
        </button>
      </div>
      <code className="block overflow-x-auto whitespace-pre text-xs text-slate-700">{snippet}</code>
    </div>
  );
}
