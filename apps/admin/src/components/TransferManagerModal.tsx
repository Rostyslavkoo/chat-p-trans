"use client";

import type { Manager } from "@chat-p-trans/shared";
import { Avatar } from "~/components/Avatar";

const PRESENCE_LABELS: Record<Manager["presence"], string> = {
  online: "Онлайн",
  away: "Відійшов",
  offline: "Оффлайн",
};

interface TransferManagerModalProps {
  managers: Manager[];
  onSelect: (managerId: string) => void;
  onClose: () => void;
}

export function TransferManagerModal({ managers, onSelect, onClose }: TransferManagerModalProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Передати менеджеру</h2>
          <button type="button" onClick={onClose} aria-label="Закрити" className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {managers.map((manager) => (
            <button
              key={manager.id}
              type="button"
              onClick={() => onSelect(manager.id)}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-slate-50"
            >
              <Avatar name={manager.name} avatarUrl={manager.avatarUrl} presence={manager.presence} />
              <div>
                <div className="text-sm font-semibold text-slate-900">{manager.name}</div>
                <div className="text-xs text-slate-400">{PRESENCE_LABELS[manager.presence]}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
