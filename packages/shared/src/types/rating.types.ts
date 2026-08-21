export interface ConversationRating {
  id: string;
  conversationId: string;
  managerId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  ratedAt: string;
}
