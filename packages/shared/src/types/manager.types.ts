export type ManagerPresence = "online" | "away" | "offline";

export interface Manager {
  id: string;
  siteId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  presence: ManagerPresence;
  todayConversationCount: number;
  averageRating: number;
}
