# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Note for Claude: the user is experienced with Vue/Nuxt but new to React. When a pattern differs meaningfully from its Vue equivalent (e.g. no reactivity by default, explicit dependency arrays, hooks rules), briefly say so in plain language when it's relevant — don't assume React idioms are already familiar.

## What this project is

A **multi-tenant** support-chat SaaS in the spirit of Binotel's website widget (the same shape as Intercom/Crisp/Tawk.to, scoped to the bus-ticket-sales niche). Each tenant is one client business (e.g. P-Trans) with its own site(s), its own conversations, and its own embed. Two audiences:

- **Manager side** (`apps/admin`) — one inbox app, shared domain, where a logged-in manager only ever sees their own tenant's conversations — the backend scopes data by the authenticated user, not by anything the frontend passes. There is no per-tenant subdomain or admin deployment.
- **Client widget** (`apps/widget`) — a small chat bubble embedded via a `<script>` tag on a tenant's own site, so a visitor there can start a conversation without leaving the page. One `widget.js` bundle serves every tenant; which tenant a given embed belongs to is carried by a `data-site-id` attribute on that `<script>` tag (see "Multi-tenancy in the widget" below), not by shipping a different build per client.

**This repository is frontend-only.** The backend (conversations, messages, auth, realtime transport, tenant/site records) lives in a separate repository and is out of scope here — treat it as a REST/WS API to be consumed, not something to design or implement in this repo.

## Architecture Decisions & Current Status

Read this section first in a new session — it's the fast path to "why does this repo look like this" without re-deriving it from the code or git history.

**Reference site**: `../P-Trans_FrontEnd` (sibling directory, separate git repo, Vue 2 + Vuetify + Vue CLI) is the first real tenant — a bus-ticket sales site. Its `public/index.html` originally had a real Binotel widget embed at the bottom of `<body>`; that's been replaced with our own `<script src="http://localhost:5173/widget.js" data-site-id="...">`. Use it as the live integration test for the widget — it's a completely separate framework/build (Vue 2, webpack, no shared tooling with this repo), which is exactly the environment the widget must survive.

**Visual/UX spec**: `docs/images/` holds reference screenshots for both apps (Figma-style mockups, not live captures) — `Support panel*.png` for the admin inbox (chat list, thread view, transfer modal, ratings table, managers list) and `main page*.png` for the widget as embedded on the P-Trans site (pre-chat form with phone + message fields and validation, in-conversation view with read receipts and a typing indicator, post-chat 5-star rating form). `docs/implementation-plan.md` is the phased build plan derived from these screenshots — read it before starting UI work on either app; it also records what's deliberately out of scope (e.g. the "Швидкі відповіді"/"Створити бронювання"/"Внутрішня нотатка" buttons are visible in every screenshot but never shown in use, so their internal behavior isn't specified anywhere — don't invent a spec for them without asking).

**Decisions made so far, and why:**

1. **npm workspaces monorepo, not separate repos.** `apps/admin` + `apps/widget` + `packages/shared` in one repo so the two apps can share domain types (`packages/shared`) without publishing a package. Each app still has fully independent tooling (own `package.json`, `tsconfig.json`, `eslint.config.mjs`) — treat them as separate apps that happen to share a checkout, not one app split into folders.
2. **Widget = Vite lib-mode → one IIFE file, mounted in Shadow DOM.** Chosen because the widget embeds into sites the team doesn't control and can't assume anything about (different framework, different or no bundler, unknown global CSS). Shadow DOM was the deciding factor over an iframe: simpler to build (no postMessage bridge, no cross-origin resize dance), and Shadow DOM still fully isolates CSS/DOM both directions. See "The Widget: Embedding Constraints" below for the concrete rules this implies.
3. **Multi-tenant via `data-site-id` on the widget's own `<script>` tag, not a per-client rebuild.** One `widget.js` build must work for every tenant, because per-tenant appearance (colors, manager name, welcome text) needs to change without a redeploy of the widget bundle — that's why `WidgetConfig` is fetched at runtime by site id rather than baked into the build. See "Multi-tenancy in the widget" below.
4. **Admin multi-tenancy is identity-scoped (one domain, login determines tenant), not URL-scoped.** No per-tenant subdomain, no tenant ID the frontend passes explicitly — deliberately chosen to keep the frontend simple; the backend derives "which tenant" from the authenticated session. If a task seems to need the frontend to specify a tenant, that's a sign the design is wrong, not that a new prop/param is needed.
5. **State: Zustand, not Context/Redux.** Picked as the lowest-ceremony option that still scales past `useState` — no providers to wrap, minimal boilerplate, good fit for both apps' small-to-medium app-wide state (auth/session in admin, UI open/closed + fetched config in widget). Each app has its own independent store tree; they do not and should not share Zustand state across the admin/widget boundary — only types cross that line, via `packages/shared`.
6. **Realtime transport is explicitly undecided.** Don't assume WebSockets, SSE, polling, or a specific provider (Pusher/Ably/etc.) — this was deferred and hasn't been revisited. If a task needs live message delivery, surface that as an open question rather than picking a transport unilaterally.
7. **The backend is a separate, not-yet-built repository.** Every "fetch"-shaped piece of code in this repo today (`~/lib/widget-config-api.ts` in the widget) is a deliberate mock, isolated to one file per concern, written to be swapped for a real call later without touching call sites. When adding a new feature that needs backend data, follow that same pattern — one isolated mock module — rather than scattering fetch/mock logic inline.

**Current implementation status** (update this list as work lands, so it stays a snapshot of what's real vs. planned — cross-check against `docs/implementation-plan.md`'s phase checkboxes, which are the more granular source of truth):

- ✅ `apps/admin` — Phases 0–3 of `docs/implementation-plan.md` are done: mock login + `AuthGuard`, app shell (`Sidebar`/`TopBar` with presence toggle), full chat inbox (list with tabs/search, thread with status dropdown + take/transfer/close actions, client detail panel, composer), ratings page, managers page. All interactive against Zustand-held mock data. Still pending: `/sites` embed-management screen (Phase 4).
- ✅ `apps/widget` — working: Shadow DOM mount, chat bubble ↔ panel UI (static local echo, no real backend), per-tenant `WidgetConfig` (mocked) driving colors/copy/manager name, verified embedded live in `P-Trans_FrontEnd`. Missing vs. the reference design: the pre-chat form (phone + message + validation), read receipts, typing indicator, and the post-chat rating form — all specced in `docs/implementation-plan.md` Phases 5–7.
- ⚠️ Auth/login (admin) — UI shell only. `/login` accepts any credentials and `AuthGuard` is a client-side redirect; there's no real authentication. Move the guard into Next.js middleware when a real auth backend exists.
- ❌ Real conversation/message data — not started; `ChatPanel` currently just echoes what the visitor types, no manager-side round trip.
- ❌ Realtime transport — not started, not chosen (see decision 6).
- ❌ Backend integration — no real API exists yet; everything backend-shaped is mocked (see decision 7).
- ❌ Admin↔widget mock data is deliberately NOT wired together (no shared local state, no `BroadcastChannel` hack) — each app is built and demoed against its own independent mock/fixture data until a real backend exists to actually connect them. Don't build cross-app plumbing to fake this.

## Repository Structure (npm workspaces monorepo)

```
apps/
  admin/            # Next.js app — manager inbox (App Router, TypeScript)
  widget/           # Vite lib-mode build — embeddable client chat widget (React, TypeScript)
packages/
  shared/           # Types shared between admin and widget (conversation/message shapes, etc.)
```

Each app has its own `package.json`, `tsconfig.json`, and lint config — they are independent apps that happen to share this repo and the `packages/shared` types. Don't assume a change in one app applies to the other.

## Commands

Run from the repo root unless noted.

### Development

```bash
npm run dev:admin          # Next.js dev server (Turbopack) at http://localhost:3000
npm run dev:widget         # Vite ESM dev server at http://localhost:5173 (loads index.html, a fake host page)
npm run dev:widget:embed   # Watches + builds dist/widget.js and serves it as a real static file at
                           # http://localhost:5173/widget.js — use this one when testing an actual
                           # <script src="http://localhost:5173/widget.js" data-site-id="..."> embed
                           # on another local site (e.g. P-Trans_FrontEnd). `npm run dev:widget` alone
                           # won't work for that: its dev server serves unbundled ESM modules, which a
                           # plain <script> tag on someone else's page can't load.
```

### Build

```bash
npm run build:admin    # Build the Next.js app for production
npm run build:widget   # Build the widget into apps/widget/dist/widget.js (single embeddable file)
```

### Code Quality

```bash
npm run lint   # Lints every workspace that defines a lint script
```

> Per-app `typecheck`/`prettier`/`precommit` scripts don't exist yet — add them (and Prettier/Husky config) when the project needs them. Don't assume they're wired up until then.

## Working Instructions

1. **Search first** — always search the codebase for existing implementations before creating new ones
2. **Check before creating** — verify no existing component/hook already serves the same purpose
3. **Check package versions** before suggesting installs — and check whether a dependency belongs in `apps/admin`, `apps/widget`, or `packages/shared` before adding it
4. **NEVER run typecheck** (`npm run typecheck`, `tsc`) unless explicitly asked — user runs it manually
5. **Prefer iterating** on existing code rather than creating new solutions
6. **Focus scope** — only touch code areas relevant to the assigned task; changes in `apps/admin` should not casually touch `apps/widget` and vice versa
7. **No unnecessary complexity** — keep solutions simple
8. **Explain React-specific gotchas as they come up** — e.g. why a `useEffect` dependency array matters, why state updates are async/batched, why a component re-renders. Keep it short — one or two sentences, not a tutorial — but don't skip it.

### Planner Mode

When asked to enter "Planner Mode":

1. Analyze existing code to map the full scope of changes
2. Ask 4-6 clarifying questions based on your findings
3. Draft a comprehensive plan and request approval
4. Once approved, implement all steps in phases
5. After each phase, mention what was completed and what's next

### Debugger Mode

When asked to enter "Debugger Mode":

1. Reflect on 5-7 different possible sources of the problem
2. Narrow down to 1-2 most likely sources
3. Add logs to validate assumptions and track data flow
4. Use browser console/network logs and server logs
5. Produce a comprehensive analysis of the issue
6. Suggest additional logs if source is still unclear
7. Once fix is implemented, ask for approval to remove debug logs

### Handling PRDs

If provided markdown files as PRDs — read them as reference only. Do not modify them. Use for structure and examples.

## Tech Stack

- **Manager app (`apps/admin`)**: Next.js (App Router) with React, TypeScript, **Tailwind CSS v4** (custom theme tokens — `brand-navy`, `brand-yellow`, status/presence colors — declared via `@theme` in `src/app/globals.css`; use those tokens rather than raw hex values)
- **Client widget (`apps/widget`)**: Vite in library mode, React, TypeScript — builds to one `widget.js` a host site loads via `<script>`
- **State**: Zustand stores for app-wide state (per app — each has its own store tree, they don't share runtime state); prefer local `useState`/custom hooks for anything narrower
- **Shared types**: `packages/shared` — conversation/message domain types used by both apps, kept in sync with the separate backend repo's API shapes by hand for now

> Stack entries beyond this (styling, UI kit, forms, data fetching, realtime transport, i18n, etc.) will be added here once the project actually adopts them — don't assume libraries from other projects are present. Realtime (live message delivery without reload) is intentionally undecided — don't assume WebSockets, polling, or any specific provider until it's chosen.

## The Widget: Embedding Constraints

`apps/widget` is not a normal web app — it is a third-party script embedded into sites the team doesn't control (e.g. a bus-ticket sales site built in Vue — see the P-Trans mockups). This shapes how it must be built:

- **Shadow DOM isolation is mandatory.** The widget mounts into a single host `<div>` and renders inside `element.attachShadow({ mode: "open" })`. This prevents the host page's CSS from leaking into the widget and the widget's CSS from leaking into the host page — and it means the host's framework (Vue, jQuery, plain HTML, whatever) is irrelevant to the widget.
- **Single self-contained bundle.** `vite build` outputs one `widget.js` (IIFE format) with React/ReactDOM/Zustand bundled in — the host page has no bundler and can't resolve external imports or `node_modules`. Don't add a dependency to `apps/widget` without checking its effect on bundle size (`npm run build:widget` prints the gzip size).
- **No global leakage.** Don't attach anything to `window` beyond the one mount call the embed snippet needs. Don't assume any global (jQuery, React, etc.) exists on the host page.
- **CSS ships inline, not as a linked stylesheet.** A plain `<script>` embed has no matching `<link>` — styles are imported with Vite's `?inline` and injected as a `<style>` tag inside the shadow root (see `apps/widget/src/main.tsx`).
- **The dev entry (`index.html`) is a fake host page**, not the shipped product — it exists only to preview the widget locally. Don't build features into it.
- **`process.env.NODE_ENV` must be inlined at build time** (`define` in `vite.config.ts`). The embed target has no bundler and no global `process` — React/Zustand read that var internally, and without the `define` the whole IIFE throws `ReferenceError: process is not defined` before `mount()` ever runs. Don't remove that `define` entry.

### Multi-tenancy in the widget

One `widget.js` build serves every tenant — there is no per-client rebuild. A tenant is identified purely by the `data-site-id` attribute on the embedding `<script>` tag:

```html
<script src="https://.../widget.js" data-site-id="p-trans-prod"></script>
```

- **`~/lib/get-site-id.ts`** reads that attribute via `document.currentScript` — this must happen at module-eval time (top-level code), not inside `mount()` or any handler, because `document.currentScript` is only valid while its own `<script>` is actively executing.
- **`~/hooks/useWidgetConfig.ts`** takes that site id and fetches a `WidgetConfig` (see `packages/shared/src/types/site.types.ts`) — manager name/avatar, welcome text, brand colors, bubble position. This is how per-client look-and-feel (colors, copy, etc.) changes without touching `widget.js` at all: it's all runtime config from the backend, keyed by site id.
- **`~/lib/widget-config-api.ts` is currently mocked** — there's no backend endpoint yet. It's the one file that knows that; don't scatter mock data elsewhere. Swap its body for a real fetch once the backend exposes a config endpoint, and nothing else in `apps/widget` should need to change.
- **Colors from `WidgetConfig` are applied as CSS custom properties** (`--widget-color-primary`, `--widget-color-accent`) set inline on the widget's root element in `App.tsx` — `widget.css` consumes them via `var(...)`, with hardcoded fallback values for safety. Don't hardcode a tenant's brand color directly in a component or in `widget.css`.
- **A missing/invalid site id, or a fetch failure, renders nothing** (`App` returns `null`) rather than a broken/default widget — better to be invisible on a misconfigured embed than show up wrong on someone else's production site.

## Developing Details

### `apps/admin` (Next.js)

- **Root alias**: Always use `~/` for absolute imports (never relative paths) — configured in `apps/admin/tsconfig.json`
- **Exports**: Always use named exports (no default exports, except Next.js special files like `page.tsx`, `layout.tsx`, which Next.js requires to be default exports)
- **Server vs Client Components**: App Router components are Server Components by default (no interactivity, no hooks, render on the server). Add `"use client"` at the top of a file only when it needs state, effects, event handlers, or browser-only APIs. Keep the client boundary as small/low as possible — push `"use client"` down to the leaf component that actually needs it, not the whole page.
- **Environment variables**: Server-only secrets go in `.env.local` without a prefix; anything needed in the browser must be prefixed `NEXT_PUBLIC_` — and only put non-sensitive values there, since `NEXT_PUBLIC_*` vars are bundled into client JS
- **Server-side secrets**: Keep API keys and tokens unprefixed (server-only) — never prefix them `NEXT_PUBLIC_`
- **Multi-tenancy is identity-scoped, not URL-scoped**: there's one domain and one deployment for every tenant — no per-tenant subdomain, no `?tenantId=` query param the frontend passes around. A logged-in manager's session determines which tenant's data they see; that scoping happens on the backend based on the authenticated user, not on anything this app sends explicitly. Don't design a feature that requires the frontend to specify "which tenant" — if a request needs that, the backend already knows it from auth.

### `apps/widget` (Vite)

- **Root alias**: Also `~/`, configured in `apps/widget/tsconfig.json` and `vite.config.ts` — same convention, separate config
- **Exports**: Named exports only (this app has no framework-mandated default-export files)
- **No server code here** — the widget is 100% client-side; anything server-side belongs in the separate backend repo

## Project Structure

### `apps/admin/src`

```
/app/                         # Next.js App Router — file-based routing
  layout.tsx                 # Root layout
  page.tsx                   # Route pages
  /api/                      # Route handlers (API endpoints)

/components/                  # Global shared components
  /**/*.tsx                  # Custom global components

/hooks/                       # Global shared hooks (use*)
/stores/                      # Zustand stores (app-wide state only)
/types/                       # Global TypeScript definitions
  *.types.ts                 # Domain types
/lib/                         # Pure utility functions (helpers, formatters)
```

### `apps/widget/src`

```
main.tsx                      # Entry point — reads site id, creates the shadow host, mounts React
App.tsx                       # Root widget component (bubble ↔ panel state, applies WidgetConfig)
/components/                  # Widget UI components
/hooks/                       # useWidgetConfig, etc.
/lib/                         # get-site-id.ts, widget-config-api.ts (mocked — see Multi-tenancy section)
/stores/                      # Zustand stores (widget UI/session state)
/styles/                      # CSS, imported with `?inline` and injected into the shadow root
```

> Structure will grow organically with the project. Don't pre-create folders (e.g. `/features/`, `/api/`) until there's an actual need for them.

## Architecture Patterns

### 1. Hooks Pattern

**Naming conventions:**

- `use*` — required prefix for all hooks (React enforces the Rules of Hooks based on this), covering both state management (`useCart`, `useAuth`) and derived/computed logic
- `get*` — plain (non-hook) data fetching/computation (`getFullName`) — safe to call anywhere, not subject to Rules of Hooks
- `is*` — Boolean checks (`isAuthenticated`, `isValid`)

**Structure:**

```typescript
export function useFeature() {
  // 1. State
  const [state, setState] = useState<State>();

  // 2. Derived values (Vue's `computed` has no direct hook equivalent —
  // just compute inline, or wrap in useMemo only if the calculation is expensive)
  const derived = useMemo(() => computeSomething(state), [state]);

  // 3. Effects (roughly Vue's onMounted/watch — but the dependency array
  // controls exactly when it reruns, so it must list everything the effect reads)
  useEffect(() => {
    // ...
    return () => {
      // cleanup, if needed
    };
  }, [/* dependencies */]);

  // 4. Methods
  const action = useCallback(() => {
    /* ... */
  }, []);

  // Return public API
  return { state, derived, action };
}
```

**Prefer local state/hooks over Zustand** for feature-specific state. Use Zustand only for app-wide state.

### 2. Store Pattern (Zustand)

Use Zustand for **app-wide state only**, scoped to whichever app the store lives in:

```typescript
import { create } from "zustand";

interface GeneralState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  fetchUserInfo: () => Promise<void>;
}

export const useGeneralStore = create<GeneralState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  fetchUserInfo: async () => {
    const userInfo = await fetchUser();
    set({ userInfo });
  },
}));
```

Components read only what they need — `const userInfo = useGeneralStore((s) => s.userInfo);` — so unrelated state changes elsewhere in the store don't cause a re-render.

**State management decision tree:**

1. Component-only state? → `useState()` / `useReducer()`
2. Shared across 2-3 components? → Lift state up, or a small custom hook + React Context
3. Feature-specific state? → Feature-scoped custom hook
4. App-wide state (within one app)? → Zustand store

### 3. Middleware Pattern (admin only)

Next.js middleware lives in a single `apps/admin/src/middleware.ts` at the app root (unlike Nuxt's numbered per-file middleware, Next.js runs one middleware function per request — branch inside it by path):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = checkAuth(request);
  if (!isAuthenticated && !isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Component Standards

### Component Structure (order matters)

```tsx
"use client";

// 1. Imports
import { useState } from "react";

// 2. Types
interface UserCardProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component
export function UserCard({ title, onSubmit }: UserCardProps) {
  // 3a. Hooks (state, custom hooks, context)
  const [isOpen, setIsOpen] = useState(false);

  // 3b. Derived values
  const label = isOpen ? "Open" : "Closed";

  // 3c. Effects
  // useEffect(() => { ... }, []);

  // 3d. Handlers
  const handleClick = () => setIsOpen((prev) => !prev);

  // 3e. Render
  return (
    <div className="user-card">
      <h2>{title}</h2>
      <button onClick={handleClick}>{label}</button>
    </div>
  );
}
```

> Note: `"use client"` only applies in `apps/admin` (Next.js App Router). Everything in `apps/widget` is implicitly client-side — don't add `"use client"` there.

### Props

Destructure props directly in the function signature (no `props.` prefix):

```tsx
// ✅ Good
export function Card({ title, description = "Default" }: CardProps) {}

// ❌ Bad
export function Card(props: CardProps) {
  return <div>{props.title}</div>;
}
```

### Code Splitting

In `apps/admin`, use Next's dynamic import:

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("~/components/HeavyComponent"));
```

Avoid code-splitting inside `apps/widget` — it ships as one `<script>` embed with no control over how/when chunks would load on the host page; keep it a single bundle.

## TypeScript Patterns

### Interface vs Type

- `interface` — object shapes, API responses, component props, extendable definitions
- `type` — unions (`type Status = 'active' | 'inactive'`), intersections, function signatures

### Utility Types

```typescript
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutPassword = Omit<User, "password">;
type PartialUser = Partial<User>;
```

### Shared Types

Types describing data that crosses the admin/widget boundary (conversations, messages, sites) belong in `packages/shared`, imported as `@chat-p-trans/shared`. Types local to one app's UI (component props, view-only state) stay in that app's `/types/`.

## Naming Conventions

### Files

- **Components**: `PascalCase.tsx` (`UserCard.tsx`, `ProductList.tsx`)
- **Hooks**: `camelCase.ts`, prefixed `use` (`useCart.ts`, `useAuth.ts`)
- **Types**: `kebab-case.types.ts` (`auth.types.ts`, `conversation.types.ts`)
- **Utils**: `camelCase.ts` (`dateHelpers.ts`, `currency.ts`)
- **Stores**: `kebab-case.store.ts` (`widget-ui.store.ts`, `general.store.ts`)
- **Routes** (admin only): Next.js App Router conventions — folders are route segments, files are `page.tsx` / `layout.tsx` / `route.ts`

### Variables & Functions

```typescript
const API_BASE_URL = 'https://...';     // Constants: SCREAMING_SNAKE_CASE
function calculateTotal() { }            // Functions: camelCase
function useCart() { }                   // Hooks: use* prefix (required by React)
function getFullName() { }               // Getters: get* prefix
const isAuthenticated = Boolean(user);   // Boolean: is*/has* prefix
function handleSubmit() { }              // Event handlers: handle* (in JSX: onClick={handleX}) or on* (for props)
```

## Code Quality Standards

### File Size Limits

- **Components**: Max 300 lines — split into smaller components if larger
- **Hooks**: Max 200 lines — extract logic into utilities
- **Functions**: Max 50 lines — break into smaller functions

### Best Practices

- ✅ Write self-documenting code, follow DRY and SOLID principles
- ✅ Use semantic HTML5 elements
- ✅ Implement loading/error states
- ✅ Handle edge cases explicitly
- ✅ Avoid code duplication — check for similar existing functionality first
- ✅ List every value an effect/`useMemo`/`useCallback` reads in its dependency array — don't suppress the exhaustive-deps lint rule without a documented reason
- ✅ Never call `Date.now()` / `new Date()` / `Math.random()` during render (including inside `useMemo` or a helper invoked from render) — the `react-hooks/purity` rule rejects it. Anchor the value once with `useState(() => Date.now())` and pass it down explicitly; `formatRelativeTime` in `apps/admin/src/lib/` takes `now` as a required argument for exactly this reason
- ✅ In `apps/widget`, check the built bundle size after adding a dependency — it ships to every page that embeds it
- ❌ Never store sensitive data in localStorage
- ❌ Never trust client-side validation alone

### Code Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: Always

## Error Handling

### Async calls (handle at call site)

```typescript
try {
  const data = await someAsyncCall();
} catch (error) {
  console.error("Operation failed:", error);
}
```

### Data Loading (Server Components, admin only)

Prefer fetching data directly in Server Components (`async function Page()`), which lets Next.js cache and stream the result — no client-side loading state needed for the initial render:

```tsx
export default async function Page() {
  const data = await fetchSomething();
  return <div>{data.title}</div>;
}
```

For client-side fetching (e.g. in response to user interaction, or anywhere in `apps/widget` which has no server layer), handle `pending`/`error` state explicitly:

```typescript
const [data, setData] = useState<Data | null>(null);
const [pending, setPending] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

### Debounced Search

```typescript
import { useDeferredValue, useState } from "react";

const [query, setQuery] = useState("");
const debouncedQuery = useDeferredValue(query);

useEffect(() => {
  searchApi(debouncedQuery);
}, [debouncedQuery]);
```

### Modal / Panel Toggle Pattern

```typescript
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
```

## Security Best Practices

- ✅ Keep API keys server-only (no `NEXT_PUBLIC_` prefix in admin; `apps/widget` should never hold secrets at all — it ships to the public internet as readable JS)
- ✅ Use secure cookies for auth tokens (admin)
- ❌ Never expose API keys client-side
- ❌ Never store sensitive data in localStorage
- ❌ Never trust the widget's origin/site-id implicitly — that's the backend's job to validate, but don't design widget code assuming the embedding site is trusted

## Accessibility (a11y)

- ✅ Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- ✅ Add ARIA labels where needed
- ✅ Ensure keyboard navigation works
- ✅ Maintain focus management in modals
- ✅ Use sufficient color contrast (WCAG AA)

## Git Commit Conventions

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`

**Scopes:** free-form, but prefer naming the app when a change is app-specific (`admin`, `widget`, `shared`)

**Examples:**

```
feat(widget): add chat bubble and panel toggle
fix(admin): resolve duplicate conversation in inbox list
refactor(shared): extract message status union type
```
