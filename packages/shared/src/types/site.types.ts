export interface Site {
  id: string;
  name: string;
  domain: string;
}

/**
 * Per-tenant widget appearance/behavior, fetched at runtime by the embed
 * script — lets a client's chat look different without rebuilding widget.js.
 */
export interface WidgetConfig {
  siteId: string;
  managerName: string;
  managerAvatarUrl: string | null;
  welcomeMessage: string;
  colors: {
    primary: string;
    accent: string;
  };
  position: "bottom-right" | "bottom-left";
}
