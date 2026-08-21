"use client";

import { useState } from "react";
import type { ConversationStatus } from "@chat-p-trans/shared";
import { CONVERSATION_STATUS_CONFIG, CONVERSATION_STATUS_ORDER } from "~/lib/conversation-status";

interface StatusDropdownProps {
  status: ConversationStatus;
  onChange: (status: ConversationStatus) => void;
}

export function StatusDropdown({ status, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = CONVERSATION_STATUS_CONFIG[status];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${config.textClass} ${config.bgClass}`}
      >
        {config.label}
        <span className="text-[10px]">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-9 z-20 flex w-44 flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            {CONVERSATION_STATUS_ORDER.map((option) => {
              const optionConfig = CONVERSATION_STATUS_CONFIG[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`rounded-md px-2.5 py-1.5 text-left text-xs font-semibold uppercase ${optionConfig.textClass} ${optionConfig.bgClass}`}
                >
                  {optionConfig.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
