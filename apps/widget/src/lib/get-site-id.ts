const SITE_ID_ATTRIBUTE = "data-site-id";

/**
 * Reads the tenant identifier off the embedding <script> tag, e.g.
 * <script src=".../widget.js" data-site-id="abc123"></script>
 *
 * Must run at module-eval time (top level), not inside an event handler or
 * a deferred mount() — `document.currentScript` is only valid for the
 * duration of the currently executing <script>.
 */
export function getSiteId(): string | null {
  const currentScript = document.currentScript;
  if (currentScript instanceof HTMLScriptElement) {
    return currentScript.getAttribute(SITE_ID_ATTRIBUTE);
  }
  return null;
}
