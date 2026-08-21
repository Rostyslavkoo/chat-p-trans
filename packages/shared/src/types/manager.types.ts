export type ManagerPresence = "online" | "away" | "offline";

export interface Manager {
  id: string;
  name: string;
  avatarUrl: string | null;
  presence: ManagerPresence;
  todayConversationCount: number;
  averageRating: number;
}
