# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # dev server (Turbopack, root pinned in next.config.ts)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint (flat config, eslint-config-next)
npx tsc --noEmit     # typecheck — the only "test" in this repo

npx prisma generate                 # regenerate client after editing prisma/schema.prisma
npx prisma db push                  # push schema to Postgres (no migrations dir exists)
npx prisma db seed                  # runs prisma/seed.js — reads .local_db.json into Postgres
```

There is no test framework. Verification = `npx tsc --noEmit` + `npm run lint` + exercising pages in the dev server.

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 (CSS-first, no `tailwind.config`) storefront for "JD Jewel", a luxury jewelry / certified-diamond shop.

### Two different `VdbService` classes — do not confuse them

| File | Exports | Domain | Runs |
|---|---|---|---|
| [src/services/vdb.ts](src/services/vdb.ts) | `VdbService`, `VdbDiamond` | loose **diamonds** | imported by client *and* server code |
| [src/services/vdbService.ts](src/services/vdbService.ts) | `VdbService`, `VdbJewelryItem` | **jewelry products** | server only |

Both are named `VdbService`. Always check the import path before calling a method.

- `vdb.ts` is a multi-provider diamond feed (`mock` | `vdb` | `nivoda` | `rapnet`), selected by `DIAMOND_PROVIDER` or auto-detected from whichever credentials exist. Every provider call falls back to a deterministic 500-stone mock inventory generated at module load. Note: [src/app/diamonds/page.tsx](src/app/diamonds/page.tsx) is a `'use client'` component that calls `VdbService.search()` directly, so in the browser `process.env.*` is undefined and it always resolves to the mock provider. Live provider data only reaches server code paths (e.g. the orders route).
- `vdbService.ts` serves the jewelry catalog. Defaults to `VDB_JEWELRY_MODE=local`, which reads `.local_db.json` off disk directly (not through Prisma), with a 5-minute in-memory cache.

### Data layer: `getDbClient()` never throws on a dead DB

[src/lib/db.ts](src/lib/db.ts) is the single DB entry point. It returns either:

- a `DatabaseProxy` (when `DATABASE_URL` is set) — wraps `PrismaClient` in a `Proxy` that catches Prisma connection errors (`P1001`–`P1003`, "Can't reach database server", timeouts) and **permanently flips the process to `MockPrismaClient`** for that instance, or
- `MockPrismaClient` directly (no `DATABASE_URL`).

`MockPrismaClient` implements a hand-written subset of the Prisma API over `.local_db.json`, re-reading and re-writing the whole file on every operation. Only the methods actually used exist (`user.findUnique/create`, `product.findMany/findUnique/create/update/delete`, etc.) — calling anything else silently breaks. `SEED_PRODUCTS`/`SEED_REVIEWS` are inlined at the top of `db.ts` and auto-migrated into `.local_db.json` on read, so **product seed data lives in three places**: `db.ts`, the committed `.local_db.json`, and the legacy `products.js`.

Consequences: a passing API call proves nothing about Postgres connectivity, and `.local_db.json` is committed to git, so local writes show up as diffs.

### Auth is intentionally minimal

[src/lib/auth.ts](src/lib/auth.ts) does PBKDF2-SHA512 (`salt:hash`), `verifyPassword` falls back to plaintext comparison for legacy/mock hashes. `generateToken()` returns random bytes that are **not verified anywhere** — `/api/auth/me` identifies a user by an `?email=` query param, and [src/context/AuthContext.tsx](src/context/AuthContext.tsx) persists the user object in `localStorage`. `/admin` has no server-side gate. Assume no real authorization exists unless you add it.

### Server/client split convention

Route pages are `async` server components that pre-fetch through `vdbService.ts` and hand serialized plain objects to a sibling `*Client.tsx` (`products/page.tsx` → `ProductsClient.tsx`, `engagement-rings/page.tsx` → `EngagementRingsClient.tsx`, `products/[id]/` → `ProductDetailsClient.tsx`). Server pages set `export const revalidate = 0`; API routes set `export const dynamic = 'force-dynamic'`.

### Context providers

Nesting in [src/app/layout.tsx](src/app/layout.tsx): `ToastProvider` → `AuthProvider` → `CartProvider` → `ConfiguratorProvider`. Cart and wishlist persist to `localStorage` (`jd_cart`, `jd_wishlist`) behind an `isLoaded` flag to stay SSR-safe. `ConfiguratorContext` is in-memory only and drives the 6-step ring builder at `/configurator`.

### Server-side price recalculation

[src/app/api/orders/route.ts](src/app/api/orders/route.ts) ignores client-supplied prices. Setting/metal/category surcharges are hardcoded in the POST handler and diamond prices are re-fetched via `VdbService.getById`. If you change pricing in `ConfiguratorContext.getSettingPrice()`, mirror it in that route or orders will total differently than the UI showed.

## Conventions

- All API-route input goes through [src/lib/validation.ts](src/lib/validation.ts) (`sanitizeString` strips HTML; `ALLOWED_SHAPES` / `ALLOWED_CATEGORIES` are the canonical enums). Categories are stored lowercase (`"engagement rings"`, `"wedding bands"`).
- `Product.specs` is a **JSON string**, not a JSON column — `JSON.stringify` on write, `JSON.parse` on read.
- Images use raw `<img>` (or [SafeImage](src/components/SafeImage.tsx) / inline error-fallback wrappers), not `next/image`, because remote diamond-provider URLs are unpredictable. Keep that pattern.
- Design tokens are CSS variables in [src/app/globals.css](src/app/globals.css) (`--gold-50`…`--gold-900`, primary `#c5a029`; Cormorant Garamond serif for display, Outfit sans for body) exposed to Tailwind via `@theme inline`. Utility classes like `.gold-foil-text`, `.hover-luxury-lift`, `.premium-border` are defined there — reuse them rather than re-deriving gradients.
- Icons come from `lucide-react`. No component library.
- ESLint has `@typescript-eslint/no-explicit-any` off and `react-hooks/set-state-in-effect` off; `any` is used liberally around the mock DB and provider mapping.

## Legacy files (not part of the build)

`index.html`, `app.js`, `style.css`, `products.js` at the repo root are the pre-Next static prototype, still committed. `productimages/` and the loose `*.jpg` files at root are superseded by `public/assets/images/`. `scratch/` holds gitignored one-off diagnostic scripts. Don't edit any of these when changing the app.
