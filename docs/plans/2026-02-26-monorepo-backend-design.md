# Monorepo + Backend Design

## Context

The IKEA move-in wishlist app currently stores all state in localStorage. We need persistent backend storage to enable multi-user/device sync. No auth required — it's a shared list accessed by URL.

## Decisions

- **Monorepo**: pnpm workspaces (no Turborepo — overkill for 2 apps)
- **Backend**: Hono on Vercel Functions
- **Database**: SQLite via Turso + Drizzle ORM
- **Hosting**: Vercel (frontend + API)
- **Auth**: None (shared list, anyone with URL can view/edit)

## Monorepo Structure

```
notion-mcp/
├── pnpm-workspace.yaml
├── package.json              # root scripts and shared devDeps
├── apps/
│   ├── web/                  # current Vite React app (moved here)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                  # Hono backend
│       ├── src/
│       │   ├── index.ts      # Hono app entry
│       │   ├── routes/
│       │   │   ├── categories.ts
│       │   │   └── items.ts
│       │   └── db/
│       │       ├── client.ts # Turso/libSQL connection
│       │       ├── schema.ts # Drizzle schema
│       │       └── migrate.ts
│       ├── drizzle.config.ts
│       └── package.json
└── packages/
    └── shared/
        ├── src/
        │   └── types.ts      # WishlistItem, Category, ItemStatus
        └── package.json
```

## Database Schema

```sql
categories (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  icon              TEXT NOT NULL,
  purchase_deadline TEXT,
  sort_order        INTEGER DEFAULT 0
)

items (
  id            TEXT PRIMARY KEY,
  category_id   TEXT NOT NULL REFERENCES categories(id),
  name          TEXT NOT NULL,
  url           TEXT,
  price         REAL,
  image_url     TEXT,
  is_preferred  INTEGER DEFAULT 0,
  notes         TEXT,              -- JSON array as text
  sort_order    INTEGER DEFAULT 0
)

item_statuses (
  item_id     TEXT PRIMARY KEY REFERENCES items(id),
  status      TEXT NOT NULL CHECK(status IN ('shortlisted', 'purchased')),
  updated_at  TEXT DEFAULT (datetime('now'))
)
```

## API Endpoints

```
GET    /api/categories          # all categories with items + statuses (single fetch for app load)
POST   /api/categories          # create a category
POST   /api/items               # add item to a category
PUT    /api/items/:id/status    # set shortlisted/purchased
DELETE /api/items/:id/status    # clear status
POST   /api/reset               # clear all statuses
```

The main `GET /api/categories` returns everything joined so the frontend loads with one request.

## Frontend Changes

Minimal — the UI doesn't change at all:

1. Replace localStorage hooks (`usePurchaseState`, `useCustomItems`) with API-backed versions
2. Add data-fetching on mount (simple `useEffect` + `useState`, or TanStack Query if caching/revalidation is wanted)
3. Optimistic updates — update local state immediately, sync to server in background, roll back on failure
4. Import shared types from `@wishlist/shared` instead of local `data/items.ts`

## Deployment

- Vercel with monorepo detection
- Hono API deployed via `@hono/vercel` adapter as Vercel Functions
- Turso free tier (500 databases, 9GB storage, 25M reads/month)
- Seed script to populate DB from current hardcoded `data/items.ts`

## Migration Steps

1. Set up monorepo structure, move existing app to `apps/web/`
2. Create `packages/shared/` with extracted types
3. Build `apps/api/` with Hono + Drizzle + Turso
4. Write seed script from current `data/items.ts`
5. Update frontend hooks to call API instead of localStorage
6. Deploy
