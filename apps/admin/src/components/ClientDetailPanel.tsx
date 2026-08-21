import type { Conversation, Manager } from "@chat-p-trans/shared";
import { Avatar } from "~/components/Avatar";
import { formatDate } from "~/lib/format-relative-time";

interface ClientDetailPanelProps {
  conversation: Conversation;
  assignedManager: Manager | null;
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span aria-hidden className="mt-0.5 text-slate-400">
        {icon}
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-900">{value}</div>
      </div>
    </div>
  );
}

export function ClientDetailPanel({ conversation, assignedManager }: ClientDetailPanelProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col gap-6 border-l border-slate-200 bg-white p-5">
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Клієнт</h2>
        <div className="flex items-center gap-3">
          <Avatar name={conversation.clientName} />
          <div>
            <div className="text-base font-bold text-slate-900">{conversation.clientName}</div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span aria-hidden>📞</span>
              {conversation.clientPhone}
            </div>
          </div>
        </div>
      </div>

      <DetailRow icon="👤" label="Менеджер" value={assignedManager?.name ?? "Не призначено"} />
      <DetailRow icon="📍" label="Джерело" value={conversation.sourceUrl} />
      <DetailRow icon="🕐" label="Вперше побачено" value={formatDate(conversation.firstSeenAt)} />
      <DetailRow icon="📝" label="Нотатки" value="—" />
    </aside>
  );
}
