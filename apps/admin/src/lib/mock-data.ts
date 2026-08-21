import type { Conversation, ConversationRating, Manager, Message } from "@chat-p-trans/shared";

// TODO: replace with real API calls once the backend exposes conversation/
// manager/rating endpoints. Kept isolated here — swap this module's exports
// for real fetches later without touching call sites (same pattern as
// apps/widget/src/lib/widget-config-api.ts).

export const MOCK_MANAGERS: Manager[] = [
  {
    id: "manager-anna",
    name: "Анна Ковальчук",
    avatarUrl: null,
    presence: "online",
    todayConversationCount: 12,
    averageRating: 4.8,
  },
  {
    id: "manager-maksym",
    name: "Максим Петренко",
    avatarUrl: null,
    presence: "online",
    todayConversationCount: 8,
    averageRating: 4.6,
  },
  {
    id: "manager-olha",
    name: "Ольга Шевчук",
    avatarUrl: null,
    presence: "away",
    todayConversationCount: 5,
    averageRating: 4.9,
  },
  {
    id: "manager-dmytro",
    name: "Дмитро Іваненко",
    avatarUrl: null,
    presence: "offline",
    todayConversationCount: 0,
    averageRating: 4.4,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-iryna",
    siteId: "p-trans-devs",
    status: "new",
    clientName: "Ірина М.",
    clientPhone: "+380671234567",
    assignedManagerId: null,
    sourceUrl: "/routes/kyiv-warsaw",
    firstSeenAt: "2026-07-30T00:00:00.000Z",
    lastMessageAt: "2026-08-21T12:30:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-piotr",
    siteId: "p-trans-devs",
    status: "in_progress",
    clientName: "Piotr K.",
    clientPhone: "+48501234567",
    assignedManagerId: "manager-anna",
    sourceUrl: "/routes/warsaw-krakow",
    firstSeenAt: "2026-07-15T00:00:00.000Z",
    lastMessageAt: "2026-08-21T12:09:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-maria",
    siteId: "p-trans-devs",
    status: "in_progress",
    clientName: "Марія Т.",
    clientPhone: "+380671112233",
    assignedManagerId: "manager-anna",
    sourceUrl: "/routes/lviv-berlin",
    firstSeenAt: "2026-07-20T00:00:00.000Z",
    lastMessageAt: "2026-08-21T11:49:00.000Z",
    unreadCount: 1,
  },
  {
    id: "conv-john",
    siteId: "p-trans-devs",
    status: "waiting_client",
    clientName: "John D.",
    clientPhone: "+447911123456",
    assignedManagerId: "manager-maksym",
    sourceUrl: "/routes/berlin-antwerp",
    firstSeenAt: "2026-06-01T00:00:00.000Z",
    lastMessageAt: "2026-08-21T10:34:00.000Z",
    unreadCount: 0,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-iryna": [
    {
      id: "msg-iryna-1",
      conversationId: "conv-iryna",
      sender: "client",
      text: "Вітаю, чи є місця на Київ-Варшаву на суботу?",
      createdAt: "2026-08-21T12:29:00.000Z",
      readAt: "2026-08-21T12:29:30.000Z",
    },
    {
      id: "msg-iryna-2",
      conversationId: "conv-iryna",
      sender: "client",
      text: "І скільки коштує?",
      createdAt: "2026-08-21T12:30:00.000Z",
      readAt: "2026-08-21T12:30:15.000Z",
    },
  ],
  "conv-piotr": [
    {
      id: "msg-piotr-1",
      conversationId: "conv-piotr",
      sender: "client",
      text: "Czy mogę zabrać rower na pokład?",
      createdAt: "2026-08-21T11:55:00.000Z",
      readAt: "2026-08-21T11:55:20.000Z",
    },
    {
      id: "msg-piotr-2",
      conversationId: "conv-piotr",
      sender: "manager",
      text: "Sprawdzam dostępność, moment 🙏",
      createdAt: "2026-08-21T12:09:00.000Z",
      readAt: null,
    },
  ],
  "conv-maria": [
    {
      id: "msg-maria-1",
      conversationId: "conv-maria",
      sender: "client",
      text: "Чи можна з велосипедом?",
      createdAt: "2026-08-21T11:49:00.000Z",
      readAt: null,
    },
  ],
  "conv-john": [
    {
      id: "msg-john-1",
      conversationId: "conv-john",
      sender: "client",
      text: "What's the baggage allowance?",
      createdAt: "2026-08-21T10:20:00.000Z",
      readAt: "2026-08-21T10:20:30.000Z",
    },
    {
      id: "msg-john-2",
      conversationId: "conv-john",
      sender: "manager",
      text: "1 suitcase up to 20kg + hand luggage. Extra bags can be added at booking.",
      createdAt: "2026-08-21T10:34:00.000Z",
      readAt: "2026-08-21T10:35:00.000Z",
    },
  ],
};

export const MOCK_RATINGS: ConversationRating[] = [
  {
    id: "rating-1",
    conversationId: "conv-31314",
    managerId: "manager-anna",
    stars: 5,
    comment: "Bardzo szybka pomoc, dziękuję!",
    ratedAt: "2026-07-29T00:00:00.000Z",
  },
  {
    id: "rating-2",
    conversationId: "conv-31315",
    managerId: "manager-olha",
    stars: 4,
    comment: "Все чітко.",
    ratedAt: "2026-07-28T00:00:00.000Z",
  },
  {
    id: "rating-3",
    conversationId: "conv-31316",
    managerId: "manager-anna",
    stars: 5,
    comment: null,
    ratedAt: "2026-07-25T00:00:00.000Z",
  },
  {
    id: "rating-4",
    conversationId: "conv-31317",
    managerId: "manager-maksym",
    stars: 3,
    comment: "Довго чекав відповіді",
    ratedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "rating-5",
    conversationId: "conv-31318",
    managerId: "manager-anna",
    stars: 5,
    comment: null,
    ratedAt: "2026-07-18T00:00:00.000Z",
  },
  {
    id: "rating-6",
    conversationId: "conv-31319",
    managerId: "manager-olha",
    stars: 5,
    comment: "Super!",
    ratedAt: "2026-07-10T00:00:00.000Z",
  },
];
