import type { ManagerPresence } from "@chat-p-trans/shared";

const PRESENCE_DOT_CLASS: Record<ManagerPresence, string> = {
  online: "bg-presence-online",
  away: "bg-presence-away",
  offline: "bg-presence-offline",
};

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  presence?: ManagerPresence;
  size?: "sm" | "md";
}

export function Avatar({ name, avatarUrl, presence, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-brand-navy-light font-semibold text-white ${sizeClass}`}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatarUrl is arbitrary/unoptimized mock data, not a static asset
        <img src={avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        name[0]?.toUpperCase()
      )}
      {presence && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${PRESENCE_DOT_CLASS[presence]}`}
        />
      )}
    </span>
  );
}
