import { useWidgetUiStore } from "~/stores/widget-ui.store";
import { useWidgetConfig } from "~/hooks/useWidgetConfig";
import { ChatBubble } from "~/components/ChatBubble";
import { ChatPanel } from "~/components/ChatPanel";

interface AppProps {
  siteId: string | null;
}

export function App({ siteId }: AppProps) {
  const isOpen = useWidgetUiStore((state) => state.isOpen);
  const isLauncherVisible = useWidgetUiStore((state) => state.isLauncherVisible);
  const { config, pending, error } = useWidgetConfig(siteId);

  // Nothing to show yet, and nothing sensible to show for a misconfigured
  // embed (bad/missing site id) — fail silently rather than showing a
  // broken widget on someone else's production site.
  if (pending || error || !config) return null;

  const positionClass = `chat-widget-root--${config.position}`;

  return (
    <div
      className={`chat-widget-root ${positionClass}`}
      style={{
        // @ts-expect-error -- CSS custom properties aren't in React's style typings
        "--widget-color-primary": config.colors.primary,
        "--widget-color-accent": config.colors.accent,
      }}
    >
      {isOpen && <ChatPanel config={config} />}
      {!isOpen && isLauncherVisible && <ChatBubble config={config} />}
    </div>
  );
}
