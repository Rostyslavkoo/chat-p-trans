export type ConversationStatus = "new" | "in_progress" | "waiting_client" | "closed";

export interface Conversation {
  id: string;
  siteId: string;
  status: ConversationStatus;
  clientName: string;
  clientPhone: string;
  assignedManagerId: string | null;
  sourceUrl: string;
  firstSeenAt: string;
  lastMessageAt: string;
  unreadCount: number;
}
