export type MessageSender = "client" | "manager";

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
}
