import { useEffect } from "react";
import { useConversationStore } from "~/stores/conversation.store";

const READ_RECEIPT_DELAY_MS = 1200;
const TYPING_START_DELAY_MS = 2000;
const TYPING_DURATION_MS = 2600;

const CANNED_REPLIES = [
  "Дякую за звернення! Один момент 🙌",
  "Так, підкажу — уточнюю деталі.",
  "Прийняла, зараз відповім детальніше.",
];

/**
 * Fakes the manager side of the conversation so read receipts and the typing
 * indicator are visible without a backend: after the visitor sends a message
 * it gets marked read, the manager "types", then a canned reply arrives.
 *
 * Keyed on the last client message id, so it runs once per visitor message —
 * no extra guard, which would break under StrictMode's double-mount (the
 * first pass would claim the id and the second would skip the reply).
 *
 * TODO: delete this hook entirely once real messages arrive over a transport —
 * it exists only to demo Phase 6 behaviour.
 */
export function useMockManagerReplies(): void {
  const messages = useConversationStore((state) => state.messages);
  const isClosed = useConversationStore((state) => state.isClosed);

  const lastMessage = messages.at(-1);
  const shouldReply = !isClosed && lastMessage?.sender === "client";
  const clientMessageCount = messages.filter((message) => message.sender === "client").length;

  useEffect(() => {
    if (!shouldReply) return;

    const reply = CANNED_REPLIES[(clientMessageCount - 1) % CANNED_REPLIES.length];
    // Read from the store at fire time rather than closing over actions —
    // keeps the dependency list to the values that decide *whether* to run.
    const { markClientMessagesRead, setManagerTyping, addManagerMessage } =
      useConversationStore.getState();

    const timers = [
      setTimeout(markClientMessagesRead, READ_RECEIPT_DELAY_MS),
      setTimeout(() => setManagerTyping(true), TYPING_START_DELAY_MS),
      setTimeout(() => addManagerMessage(reply), TYPING_START_DELAY_MS + TYPING_DURATION_MS),
    ];

    return () => timers.forEach(clearTimeout);
  }, [shouldReply, clientMessageCount]);
}
