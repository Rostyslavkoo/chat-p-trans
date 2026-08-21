import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "~/App";
import { getSiteId } from "~/lib/get-site-id";
import { exposePublicApi } from "~/lib/public-api";
import widgetStyles from "~/styles/widget.css?inline";

const HOST_ELEMENT_ID = "chat-p-trans-widget-root";

// Must be read at module-eval time — see get-site-id.ts for why.
const siteId = getSiteId();

function mount() {
  if (document.getElementById(HOST_ELEMENT_ID)) return;

  const host = document.createElement("div");
  host.id = HOST_ELEMENT_ID;
  document.body.appendChild(host);

  // Shadow DOM isolates the widget's styles/DOM from the host page (which
  // may run any framework, e.g. Vue) and vice versa — neither can leak in.
  const shadowRoot = host.attachShadow({ mode: "open" });

  const styleTag = document.createElement("style");
  styleTag.textContent = widgetStyles;
  shadowRoot.appendChild(styleTag);

  const appContainer = document.createElement("div");
  shadowRoot.appendChild(appContainer);

  createRoot(appContainer).render(
    <StrictMode>
      <App siteId={siteId} />
    </StrictMode>,
  );

  exposePublicApi();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
