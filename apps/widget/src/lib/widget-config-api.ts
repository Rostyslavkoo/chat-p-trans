import type { WidgetConfig } from "@chat-p-trans/shared";

// TODO: replace with a real request to the backend once it exposes a
// GET /sites/:siteId/widget-config endpoint. Kept isolated here so that's
// a one-file change — nothing else should know this is mocked.
export async function fetchWidgetConfig(siteId: string): Promise<WidgetConfig> {
  return {
    siteId,
    managerName: "Анна",
    managerAvatarUrl: null,
    welcomeMessage: "Вітаю! 👋 Мене звати Анна, я з підтримки P-Trans. Чим можу допомогти?",
    colors: {
      primary: "#10193f",
      accent: "#f6c915",
    },
    position: "bottom-right",
  };
}
