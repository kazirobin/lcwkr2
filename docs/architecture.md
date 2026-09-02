# Architecture

This project is a Next.js 16 (App Router) app organised **by domain**, not by
file type. The goal is that a whole feature — its pages, UI, data access, and
types — lives in one place, so new features (including paid ones) can be added
or removed without touching unrelated code.

> Framework note: this is a modified Next.js build. Read the relevant guide in
> `node_modules/next/dist/docs/` before changing framework-level code
> (see `AGENTS.md`).

## Directory map

```
src/
├── app/                     Routes only. Pages, layouts, route handlers.
│   └── api/**/route.ts       Thin: parse request → call a feature server fn → respond.
├── features/<domain>/        One self-contained module per domain.
│   ├── index.ts              Public surface (client-safe). Import the feature via this.
│   ├── components/           React components for this domain.
│   ├── data/                 Static data / content for this domain.
│   ├── models/               Mongoose models + models/index.ts (SERVER ONLY).
│   ├── server/               Data-access + business logic, called by route handlers.
│   └── types.ts              Domain types.
├── i18n/                     LanguageContext, translations, language data (cross-cutting).
├── components/
│   ├── ui/                   Shared, domain-agnostic primitives (Button, Field, Dialog…).
│   └── layout/               App chrome: Nav, Footer, Breadcrumb, ThemeButton.
├── lib/                      Framework-agnostic helpers. lib/db.ts = Mongo connection.
├── config/                   Centralised configuration (env, constants).
└── providers/               React context providers mounted in the root layout.
```

Current features: `academy` (the LMS), `chinese-words` (the paid Core Word
Builder), `vocabulary` (HSK reader data + components), `todos`, `marketing`
(home / community / msg content), `hsk` (route-only, reads `vocabulary`).

`public/`, all config files, and `.env*` stay at the repo root.

## Import rules

1. **Direction is one-way:** `app/` → `features/*` → (`components/ui`, `lib`,
   `config`, `i18n`). Nothing lower imports something higher.
2. **Cross-feature:** a feature may import another feature only through its
   `index.ts` barrel — never a deep path into its internals. Prefer not to at
   all; lift the shared piece into `components/ui`, `lib`, or `i18n` instead.
3. **Client vs server:** `features/<x>/models` and `features/<x>/server` are
   server-only (they load Mongoose). Never re-export them from the top-level
   `features/<x>/index.ts`, and never import them from a `"use client"` file.
4. **Route handlers hold no data access.** `app/api/**/route.ts` parses the
   request, checks the passcode, calls a `features/<x>/server/*` function, and
   maps the result to a response. Mongoose calls live in `server/`, not routes.

## Adding a feature (including a premium one)

1. `src/features/<name>/` with the sub-folders above and an `index.ts`.
2. Model(s) in `models/`, exposed via `models/index.ts`.
3. Data-access + rules in `server/*.ts` (import `@/lib/db`, the models).
4. Pages under `src/app/<name>/`; API under `src/app/api/<name>/**` as thin
   handlers over `server/`.
5. UI in `components/`, re-exported (client-safe parts only) from `index.ts`.

**Gating premium access:** put the entitlement check in one place — planned as
`src/lib/entitlements.ts` (a `hasEntitlement(user, feature)` helper) with a
future `src/features/billing/` module owning purchases/webhooks. Server code
calls it at the top of the relevant `server/*` function; UI calls it to choose
between the real component and a paywall. This does not exist yet — it is the
designed extension point.

## Known follow-ups (out of scope for the restructure)

These must be resolved **before** shipping anything paid:

- **Auth is not enforced.** `/academy/admin` is gated only in the browser
  (`src/features/academy/components/admin/AdminShell.tsx`, `localStorage`).
- **Hardcoded passcode fallbacks.** Several `src/app/api/academy/**` handlers
  accept a literal `"8131"` / `"2026"` in addition to the env var.
- **Secrets were committed** to `.env` in local history (the file is gitignored
  going forward). Rotate the MongoDB credential and all passcodes.
- **`src/app/api/academy/students/change-course/route.ts)`** has a stray `)` in
  its filename, so it is inert (Next never routes it, TS never checks it). Left
  as-is to avoid changing behaviour; delete or fix the name deliberately.
- Duplicate lockfiles (`yarn.lock`, `package-lock.json`) alongside
  `pnpm-workspace.yaml` — pick one package manager.

## Verifying a change is behaviour-preserving

```
npx tsc --noEmit          # must be clean
npm run build             # route list must not change
npm run lint              # problem count must not rise (currently 77)
npm run dev               # smoke-test affected pages + API GETs
```
