export type ConversationStatus = "open" | "pending" | "closed";

export interface Conversation {
  id: string;
  siteId: string;
  status: ConversationStatus;
  managerId: string | null;
  createdAt: string;
  updatedAt: string;
}
