import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  // The embed target is a raw <script> on a page with no bundler — nothing
  // defines `process` there. React/Zustand read process.env.NODE_ENV
  // internally, so it must be inlined at build time or the whole IIFE
  // throws "process is not defined" before mount() ever runs.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  // Serves the built dist/widget.js as a static file at a stable local URL
  // (http://localhost:5173/widget.js) so a real host page (e.g. the Vue
  // site) can load it via a plain <script> tag, same as it would in prod.
  // The Vite dev server itself (`vite`/`npm run dev`) is ESM-module based
  // and isn't suitable for a single-file <script> embed — use `npm run
  // dev:embed` (build --watch + preview) for that instead.
  preview: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "ChatPTransWidget",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
    // Everything (React included) is bundled into one file — the host
    // page has no bundler and can't resolve external dependencies.
    rollupOptions: {
      output: {
        // CSS is injected via JS (see main.tsx) since a plain <script> embed
        // has no way to also link a stylesheet.
        assetFileNames: "widget.[ext]",
      },
    },
    cssCodeSplit: false,
  },
});
