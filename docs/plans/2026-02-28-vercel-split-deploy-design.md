# Split Deployment: Two Vercel Projects from Monorepo

**Date:** 2026-02-28
**Status:** Approved

## Goal

Deploy the Hono API and React frontend as two separate Vercel projects from the existing pnpm monorepo, with a single `pnpm deploy` command to deploy both.

## Current Architecture

Single Vercel project ("shoplist", `prj_5m3VL22O6NQZ2wrkfSlhWMDnGvEK`):
- API: esbuild bundles `apps/api/src/vercel.ts` → `api/index.js` serverless function
- Web: Vite builds `apps/web/` → `apps/web/dist/` static site
- Both served from same domain (`shoplist-eta.vercel.app`)
- Frontend calls same-origin `/api/*`, rewritten to serverless function via `vercel.json`

## Target Architecture

Two Vercel projects, same monorepo:

```
shoplist-api (new project)              shoplist-web (new project)
├── Root Directory: apps/api            ├── Root Directory: apps/web
├── Framework: Hono (zero-config)       ├── Framework: Vite (auto-detected)
├── Entry: src/index.ts default export  ├── Build: tsc -b && vite build
├── Routes: /, /categories, /health     ├── VITE_API_URL → API domain
└── Env: TURSO_DATABASE_URL, TOKEN      └── Static SPA output
```

## Deploy Mechanism

### Verified Facts

| Mechanism | Works? | How verified |
|-----------|--------|-------------|
| `vercel deploy --project <name>` | NO — `unknown or unexpected option` | Tested CLI v50.25.1 |
| `VERCEL_PROJECT_ID` env var | YES — CLI accepts, looks up project | Tested with fake ID → `Project not found` |
| `VERCEL_ORG_ID` env var | YES — accepted alongside PROJECT_ID | Tested |
| `installCommand: "cd ../.. && pnpm install"` | YES — standard monorepo pattern | Community guides, Vercel discussions |
| Root Directory in dashboard for CLI deploys | YES — "This setting also applies to Vercel CLI" | Vercel docs |
| Hono `src/index.ts` entry detection | YES — listed as valid entry point | Vercel Hono docs |
| `handle()` wrapper from `hono/vercel` | NOT NEEDED — zero-config handles it | Vercel Hono docs |
| Hono `cors()` with empty allowHeaders | WORKS — mirrors browser's request headers | Read middleware source |
| `@libsql/client/web` import | ALREADY USED in `db/client.ts` | Read source |
| API imports `@wishlist/shared` | NO — zero imports in `apps/api/src/` | Grep confirmed |

### Deploy Script

`scripts/deploy.sh` runs from monorepo root, reads project IDs from per-app `.vercel/project.json` files (created during setup via `vercel link`), deploys using `VERCEL_PROJECT_ID` env var.

Deploying from root uploads the entire repo (lockfile, workspace packages, everything). Each project's Root Directory (set in Vercel dashboard) tells Vercel which app to build.

```bash
#!/bin/bash
set -e

API_PROJECT=$(node -p "require('./apps/api/.vercel/project.json').projectId")
WEB_PROJECT=$(node -p "require('./apps/web/.vercel/project.json').projectId")
ORG_ID=$(node -p "require('./apps/api/.vercel/project.json').orgId")

echo "Deploying API..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$API_PROJECT vercel deploy --prod --yes

echo "Deploying Web..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$WEB_PROJECT vercel deploy --prod --yes

echo "Both apps deployed."
```

Command: `pnpm deploy` (runs `bash scripts/deploy.sh`)

### Why This Works

1. `vercel deploy` from root → uploads entire repo including lockfile and workspace packages
2. `VERCEL_PROJECT_ID` overrides `.vercel/project.json` (precedence: env var > project.json)
3. Each project's Root Directory (dashboard setting) → Vercel navigates to the app subdir
4. Each app's `vercel.json` → `installCommand: "cd ../.. && pnpm install --frozen-lockfile"`
5. pnpm installs from repo root, resolves workspace packages
6. Framework auto-detected: Hono from `src/index.ts`, Vite from `vite.config.ts`

## File Changes

### Delete

| File | Why |
|------|-----|
| `vercel.json` (root) | Replaced by per-app vercel.json |
| `scripts/build-api.mjs` | esbuild no longer needed — Vercel builds Hono natively |
| `api/index.js` | Generated esbuild artifact, no longer produced |
| `apps/api/src/vercel.ts` | `handle()` wrapper not needed — zero-config Hono |
| `.vercel/project.json` (root) | Replaced by per-app links + VERCEL_PROJECT_ID |

### Create

| File | Content |
|------|---------|
| `apps/api/vercel.json` | `{ "installCommand": "cd ../.. && pnpm install --frozen-lockfile" }` |
| `apps/web/vercel.json` | `{ "installCommand": "cd ../.. && pnpm install --frozen-lockfile" }` |
| `scripts/deploy.sh` | Deploy script (above) |

### Modify

**`apps/api/src/index.ts`** — Remove `.basePath("/api")`:
```ts
// Before
const app = new Hono().basePath("/api");
// After
const app = new Hono();
```

**`apps/api/package.json`** — Remove unused `@wishlist/shared` dependency.

**`apps/web/src/lib/api.ts`** — Use `VITE_API_URL` env var:
```ts
// Before
const API_BASE = import.meta.env.DEV ? "http://localhost:3001/api" : "/api";
// After
const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : import.meta.env.VITE_API_URL;
```

**`package.json` (root)** — Remove `@libsql/client`, `drizzle-orm`, `hono` from deps. Remove `esbuild` from devDeps. Add `"deploy": "bash scripts/deploy.sh"`.

**`.gitignore`** — Remove `api/index.js` line.

## One-time Setup

```bash
# 1. Create Vercel projects
vercel project add shoplist-api
vercel project add shoplist-web

# 2. Link each app to its project
vercel link --cwd apps/api --project shoplist-api --yes
vercel link --cwd apps/web --project shoplist-web --yes

# 3. Set Root Directory in Vercel dashboard
#    shoplist-api → apps/api
#    shoplist-web → apps/web

# 4. Set env vars in Vercel dashboard
#    shoplist-api: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
#    shoplist-web: VITE_API_URL=https://shoplist-api.vercel.app (after first API deploy)

# 5. Deploy
pnpm deploy
```

## Migration from Old Project

The existing "shoplist" project (`shoplist-eta.vercel.app`) continues to work until retired. Steps:

1. Deploy both new projects and verify they work
2. If custom domains exist on "shoplist", reassign them to the new projects
3. Delete the old "shoplist" project when ready

## Local Dev (unchanged)

```
Terminal 1: pnpm dev:api  → localhost:3001 (routes at /, not /api)
Terminal 2: pnpm dev      → localhost:5173 (points to localhost:3001)
```

## Risks and Fallbacks

| Risk | Likelihood | Fallback |
|------|-----------|----------|
| Hono not detected in monorepo | Low | Add `"framework": "hono"` to `apps/api/vercel.json` |
| `@wishlist/shared` workspace resolution fails | Low | Copy 20 lines of types into `apps/web/src/types.ts` |
| `VERCEL_PROJECT_ID` behavior changes | Very low | Switch to `vercel link --repo` (currently alpha) |
| Root Directory not applied for CLI deploy | Low | Set `buildCommand` in each app's vercel.json explicitly |
