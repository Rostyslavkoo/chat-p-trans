import { useEffect, useState } from "react";
import type { WidgetConfig } from "@chat-p-trans/shared";
import { fetchWidgetConfig } from "~/lib/widget-config-api";

interface UseWidgetConfigResult {
  config: WidgetConfig | null;
  pending: boolean;
  error: Error | null;
}

const MISSING_SITE_ID_ERROR = new Error("Missing data-site-id on the widget <script> tag");

export function useWidgetConfig(siteId: string | null): UseWidgetConfigResult {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [pending, setPending] = useState(siteId !== null);
  const [error, setError] = useState<Error | null>(siteId === null ? MISSING_SITE_ID_ERROR : null);

  useEffect(() => {
    if (!siteId) return;

    let cancelled = false;

    fetchWidgetConfig(siteId)
      .then((result) => {
        if (!cancelled) setConfig(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  return { config, pending, error };
}
