# Split Vercel Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy the Hono API and React frontend as two separate Vercel projects from the existing pnpm monorepo, with `pnpm deploy` deploying both.

**Architecture:** Each app gets its own Vercel project. Deploy from monorepo root using `VERCEL_PROJECT_ID` env var to target each project. Each project's Root Directory (dashboard setting) points to its app subdirectory. Per-app `vercel.json` overrides `installCommand` to install from the monorepo root.

**Tech Stack:** Vercel CLI, Hono (zero-config), Vite, pnpm workspaces

**Design doc:** `docs/plans/2026-02-28-vercel-split-deploy-design.md`

---

### Task 1: Remove API basePath and delete vercel.ts

The API currently mounts all routes under `/api` via `.basePath("/api")`. Since the API will be its own domain, routes should be at root level. The `vercel.ts` file with `handle()` wrapper is not needed — Vercel's zero-config Hono support uses the default export from `src/index.ts` directly.

**Files:**
- Modify: `apps/api/src/index.ts`
- Delete: `apps/api/src/vercel.ts`

**Step 1: Modify `apps/api/src/index.ts`**

Remove `.basePath("/api")` and update the comment:

```ts
const app = new Hono();
```

The full file should read:

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/client.js";
import { itemStatuses } from "./db/schema.js";
import categoriesRoute from "./routes/categories.js";
import itemsRoute from "./routes/items.js";

const app = new Hono();

app.use("*", cors());

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

app.get("/health", (c) => c.json({ ok: true }));

app.route("/categories", categoriesRoute);
app.route("/items", itemsRoute);

app.post("/reset", async (c) => {
  await db.delete(itemStatuses);
  return c.json({ ok: true });
});

export default app;
```

**Step 2: Delete `apps/api/src/vercel.ts`**

```bash
rm apps/api/src/vercel.ts
```

**Step 3: Verify local API still works**

```bash
pnpm dev:api
# In another terminal:
curl http://localhost:3001/health
```

Expected: `{"ok":true}`

Note: routes are now at `/health`, `/categories`, etc. — no `/api` prefix.

**Step 4: Commit**

```bash
git add apps/api/src/index.ts
git rm apps/api/src/vercel.ts
git commit -m "refactor: remove API basePath and vercel.ts handle wrapper

Routes now at root level (/, /categories, /health) for standalone
Vercel deployment. Zero-config Hono uses default export directly."
```

---

### Task 2: Update frontend API client

The frontend currently calls `/api/categories` (same-origin). It needs to call `VITE_API_URL/categories` (cross-origin) in production, and `http://localhost:3001/categories` in dev.

**Files:**
- Modify: `apps/web/src/lib/api.ts`

**Step 1: Modify `apps/web/src/lib/api.ts`**

Change line 1:

```ts
// Before:
const API_BASE = import.meta.env.DEV ? "http://localhost:3001/api" : "/api";

// After:
const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : import.meta.env.VITE_API_URL;
```

**Step 2: Verify frontend builds**

```bash
pnpm --filter @wishlist/web build
```

Expected: Build succeeds. (VITE_API_URL will be `undefined` without env var set, but that's fine — it's set at deploy time.)

**Step 3: Verify local dev works end-to-end**

```bash
# Terminal 1:
pnpm dev:api

# Terminal 2:
pnpm dev

# Open http://localhost:5173 in browser — app should load categories from localhost:3001
```

**Step 4: Commit**

```bash
git add apps/web/src/lib/api.ts
git commit -m "feat: use VITE_API_URL env var for production API base URL

Dev still points to localhost:3001. Production URL is set via
Vercel environment variable at build time."
```

---

### Task 3: Remove unused API dependency on @wishlist/shared

Grep confirmed zero imports of `@wishlist/shared` in `apps/api/src/`. The dependency in `package.json` is dead weight.

**Files:**
- Modify: `apps/api/package.json`

**Step 1: Remove the dependency**

In `apps/api/package.json`, remove `"@wishlist/shared": "workspace:*"` from `dependencies`:

```json
  "dependencies": {
    "@libsql/client": "^0.14.0",
    "drizzle-orm": "^0.38.0",
    "hono": "^4.7.0"
  },
```

**Step 2: Reinstall to update lockfile**

```bash
pnpm install
```

**Step 3: Verify API still works**

```bash
pnpm dev:api
# In another terminal:
curl http://localhost:3001/health
```

Expected: `{"ok":true}`

**Step 4: Commit**

```bash
git add apps/api/package.json pnpm-lock.yaml
git commit -m "chore: remove unused @wishlist/shared dep from API"
```

---

### Task 4: Clean up root package.json

Root `package.json` has `@libsql/client`, `drizzle-orm`, `hono` as dependencies and `esbuild` as devDependency. These were only needed for the esbuild bundling script, which is being removed. Add the deploy script.

**Files:**
- Modify: `package.json` (root)

**Step 1: Remove root-level API dependencies and add deploy script**

The root `package.json` should become:

```json
{
  "name": "ikea-wishlist",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.15.1",
  "devDependencies": {
    "@types/node": "^24.10.13",
    "typescript": "~5.9.3"
  },
  "scripts": {
    "dev": "pnpm --filter @wishlist/web dev",
    "dev:api": "pnpm --filter @wishlist/api dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "deploy": "bash scripts/deploy.sh"
  }
}
```

Changes:
- Removed `dependencies` block entirely (`@libsql/client`, `drizzle-orm`, `hono`)
- Removed `esbuild` from `devDependencies`
- Added `"deploy": "bash scripts/deploy.sh"` to scripts

**Step 2: Reinstall to update lockfile**

```bash
pnpm install
```

**Step 3: Verify dev still works**

```bash
pnpm dev:api
```

Expected: Still starts on port 3001 (deps come from `apps/api/package.json`, not root).

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: remove root-level API deps (moved to apps/api)

@libsql/client, drizzle-orm, hono were only needed for esbuild
bundling. esbuild also removed. Added deploy script."
```

---

### Task 5: Delete old build artifacts and config

Remove the esbuild bundling script, its output, and the root vercel.json.

**Files:**
- Delete: `vercel.json` (root)
- Delete: `scripts/build-api.mjs`
- Delete: `api/index.js`
- Delete: `.vercel/project.json` (root)

**Step 1: Delete files**

```bash
rm vercel.json
rm scripts/build-api.mjs
rm -f api/index.js
rm -rf .vercel
rmdir scripts 2>/dev/null || true
rmdir api 2>/dev/null || true
```

**Step 2: Update .gitignore**

Remove the `api/index.js` entry (lines 30-31). The `.vercel` entry stays (it will apply to per-app `.vercel/` dirs).

The end of `.gitignore` should look like:

```
.env
.env.local
.vercel
```

(Remove the blank line and `# Built serverless function...` comment and `api/index.js` line.)

**Step 3: Commit**

```bash
git add .gitignore
git rm vercel.json scripts/build-api.mjs
git rm -f api/index.js
git rm -rf .vercel
git commit -m "chore: remove old single-project Vercel config

Deleted: vercel.json, esbuild script, generated api/index.js,
root .vercel link. Replaced by per-app Vercel configs in next step."
```

---

### Task 6: Create per-app Vercel configs

Each app needs a `vercel.json` with `installCommand` that installs from the monorepo root so pnpm workspace resolution works.

**Files:**
- Create: `apps/api/vercel.json`
- Create: `apps/web/vercel.json`

**Step 1: Create `apps/api/vercel.json`**

```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
}
```

No `framework`, `buildCommand`, or `outputDirectory` — Hono is zero-config. Vercel detects it from `src/index.ts` default export.

**Step 2: Create `apps/web/vercel.json`**

```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
}
```

Vite is auto-detected. Build command comes from `apps/web/package.json` scripts.

**Step 3: Commit**

```bash
git add apps/api/vercel.json apps/web/vercel.json
git commit -m "feat: add per-app vercel.json with monorepo install command

Each app installs from repo root so pnpm workspace packages resolve."
```

---

### Task 7: Create deploy script

The deploy script reads project IDs from per-app `.vercel/project.json` files and deploys from root using `VERCEL_PROJECT_ID`.

**Files:**
- Create: `scripts/deploy.sh`

**Step 1: Create `scripts/deploy.sh`**

```bash
#!/bin/bash
set -e

# Read project configuration from per-app .vercel links
# These are created by: vercel link --cwd apps/api --project <name> --yes
API_LINK="./apps/api/.vercel/project.json"
WEB_LINK="./apps/web/.vercel/project.json"

if [ ! -f "$API_LINK" ]; then
  echo "Error: $API_LINK not found."
  echo "Run: vercel link --cwd apps/api --project <api-project-name> --yes"
  exit 1
fi

if [ ! -f "$WEB_LINK" ]; then
  echo "Error: $WEB_LINK not found."
  echo "Run: vercel link --cwd apps/web --project <web-project-name> --yes"
  exit 1
fi

API_PROJECT=$(node -p "require('$API_LINK').projectId")
WEB_PROJECT=$(node -p "require('$WEB_LINK').projectId")
ORG_ID=$(node -p "require('$API_LINK').orgId")

echo "==> Deploying API (project: $API_PROJECT)..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$API_PROJECT vercel deploy --prod --yes

echo ""
echo "==> Deploying Web (project: $WEB_PROJECT)..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$WEB_PROJECT vercel deploy --prod --yes

echo ""
echo "Done. Both apps deployed to production."
```

**Step 2: Make it executable**

```bash
chmod +x scripts/deploy.sh
```

**Step 3: Verify script syntax**

```bash
bash -n scripts/deploy.sh
```

Expected: No output (syntax OK).

**Step 4: Commit**

```bash
git add scripts/deploy.sh
git commit -m "feat: add deploy script for dual Vercel project deployment

Reads project IDs from per-app .vercel/project.json links.
Deploys both API and Web from monorepo root.
Usage: pnpm deploy"
```

---

### Task 8: Create Vercel projects and link

Create the two Vercel projects, link each app directory, and configure Root Directories.

**Step 1: Create projects**

```bash
vercel project add shoplist-api
vercel project add shoplist-web
```

**Step 2: Link each app to its project**

```bash
vercel link --cwd apps/api --project shoplist-api --yes
vercel link --cwd apps/web --project shoplist-web --yes
```

This creates:
- `apps/api/.vercel/project.json`
- `apps/web/.vercel/project.json`

Both are gitignored (`.vercel` in `.gitignore`).

**Step 3: Verify links**

```bash
cat apps/api/.vercel/project.json
cat apps/web/.vercel/project.json
```

Expected: JSON with `projectId`, `orgId`, `projectName` for each.

**Step 4: Set Root Directories in Vercel dashboard**

Go to https://vercel.com/dashboard:

1. Open **shoplist-api** → Settings → General → Root Directory → set to `apps/api` → Save
2. Open **shoplist-web** → Settings → General → Root Directory → set to `apps/web` → Save

**Step 5: Set environment variables in Vercel dashboard**

For **shoplist-api**:
- `TURSO_DATABASE_URL` = (copy from existing shoplist project env vars)
- `TURSO_AUTH_TOKEN` = (copy from existing shoplist project env vars)

For **shoplist-web**:
- `VITE_API_URL` = (set after first API deploy — skip for now)

---

### Task 9: First deploy and verify

Deploy both apps and verify they work end-to-end.

**Step 1: Deploy API first**

```bash
pnpm deploy
```

Or deploy just the API to get its URL:

```bash
API_LINK="./apps/api/.vercel/project.json"
API_PROJECT=$(node -p "require('$API_LINK').projectId")
ORG_ID=$(node -p "require('$API_LINK').orgId")
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$API_PROJECT vercel deploy --prod --yes
```

**Step 2: Verify API is live**

```bash
curl https://shoplist-api.vercel.app/health
```

Expected: `{"ok":true}`

If you get "No entrypoint found which imports hono", add `"framework": "hono"` to `apps/api/vercel.json`:

```json
{
  "framework": "hono",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
}
```

Then redeploy.

**Step 3: Set VITE_API_URL on the web project**

In Vercel dashboard: **shoplist-web** → Settings → Environment Variables:
- `VITE_API_URL` = `https://shoplist-api.vercel.app` (use actual API URL from step 2)

**Step 4: Deploy web**

```bash
WEB_LINK="./apps/web/.vercel/project.json"
WEB_PROJECT=$(node -p "require('$WEB_LINK').projectId")
ORG_ID=$(node -p "require('$WEB_LINK').orgId")
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$WEB_PROJECT vercel deploy --prod --yes
```

**Step 5: Verify web is live**

Open the web project URL in browser. The app should:
- Load and display categories
- Allow shortlisting/purchasing items
- Show budget tracking

Check browser DevTools Network tab — API calls should go to `https://shoplist-api.vercel.app/categories` (cross-origin).

**Step 6: Verify full deploy command**

```bash
pnpm deploy
```

Expected: Both apps deploy successfully, output shows both URLs.

---

### Task 10: Verify and clean up

**Step 1: Test local dev still works**

```bash
# Terminal 1:
pnpm dev:api
# Verify: curl http://localhost:3001/health → {"ok":true}
# Verify: curl http://localhost:3001/categories → [...categories...]

# Terminal 2:
pnpm dev
# Open http://localhost:5173 → app loads, categories display
```

**Step 2: Run lint**

```bash
pnpm lint
```

Fix any issues.

**Step 3: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: final cleanup for split Vercel deployment"
```

**Step 4: Retire old project (when ready)**

The old "shoplist" project continues to work. When satisfied with the new setup:

1. Reassign any custom domains from "shoplist" to the new projects
2. Delete the old project: `vercel project rm shoplist`
