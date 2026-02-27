# Monorepo + Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the IKEA wishlist app into a pnpm monorepo with a Hono API backend and Turso database for multi-user/device sync.

**Architecture:** pnpm workspaces with `apps/web` (existing Vite React app), `apps/api` (Hono on Vercel Functions), and `packages/shared` (types). Turso (libSQL) for persistence via Drizzle ORM. No auth — shared list by URL.

**Tech Stack:** pnpm workspaces, Vite, React, Hono, Drizzle ORM, Turso (libSQL), Vercel Functions

**Design doc:** `docs/plans/2026-02-26-monorepo-backend-design.md`

---

### Task 0: Install Turso CLI and create database

**Prerequisites:** Turso account already created.

**Step 1: Install Turso CLI**

Run: `brew install tursodatabase/tap/turso`

**Step 2: Login**

Run: `turso auth login`

This opens a browser for OAuth. Complete the flow.

**Step 3: Create the database**

Run: `turso db create ikea-wishlist`

**Step 4: Get the database URL**

Run: `turso db show ikea-wishlist --url`

Save this value — it looks like `libsql://ikea-wishlist-<username>.turso.io`

**Step 5: Create an auth token**

Run: `turso db tokens create ikea-wishlist`

Save this value — you'll need it as `TURSO_AUTH_TOKEN`.

**Step 6: Commit**

No code changes yet — just environment setup.

---

### Task 1: Set up pnpm workspace monorepo structure

**Files:**
- Create: `pnpm-workspace.yaml`
- Modify: `package.json` (root — strip to workspace root)
- Move: all current app files → `apps/web/`
- Create: `apps/web/package.json` (current package.json, adjusted)
- Create: `apps/web/tsconfig.json`, `apps/web/tsconfig.app.json`, `apps/web/tsconfig.node.json`
- Move: `apps/web/vite.config.ts`, `apps/web/eslint.config.js`, `apps/web/components.json`, `apps/web/index.html`
- Move: `apps/web/src/` (entire src directory)

**Step 1: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 2: Move the existing app into apps/web/**

```bash
mkdir -p apps/web
# Move app files
git mv src apps/web/src
git mv public apps/web/public
git mv index.html apps/web/index.html
git mv vite.config.ts apps/web/vite.config.ts
git mv tsconfig.app.json apps/web/tsconfig.app.json
git mv tsconfig.node.json apps/web/tsconfig.node.json
git mv eslint.config.js apps/web/eslint.config.js
git mv components.json apps/web/components.json
```

**Step 3: Create apps/web/package.json**

Copy the current `package.json` but change the name:

```json
{
  "name": "@wishlist/web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.0",
    "canvas-confetti": "^1.9.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.575.0",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^24.10.13",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "shadcn": "^3.8.5",
    "tw-animate-css": "^1.4.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

**Step 4: Create apps/web/tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 5: Create root package.json**

```json
{
  "name": "ikea-wishlist",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @wishlist/web dev",
    "dev:api": "pnpm --filter @wishlist/api dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  }
}
```

**Step 6: Update .gitignore**

Add to `.gitignore`:

```
.env
.env.local
```

**Step 7: Delete old node_modules, reinstall**

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Step 8: Verify the web app still works**

Run: `pnpm dev`

Expected: App loads at localhost:5173, all features work. Ctrl+C to stop.

**Step 9: Commit**

```bash
git add -A
git commit -m "refactor: convert to pnpm monorepo, move app to apps/web"
```

---

### Task 2: Create packages/shared with extracted types

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types.ts`
- Modify: `apps/web/package.json` (add dependency on `@wishlist/shared`)
- Modify: `apps/web/src/data/items.ts` (import types from shared)

**Step 1: Create packages/shared/package.json**

```json
{
  "name": "@wishlist/shared",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/types.ts",
      "default": "./src/types.ts"
    }
  }
}
```

**Step 2: Create packages/shared/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**Step 3: Create packages/shared/src/types.ts**

Extract types from `apps/web/src/data/items.ts`:

```typescript
export interface WishlistItem {
  id: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: WishlistItem[];
}

export type ItemStatus = "shortlisted" | "purchased";
```

**Step 4: Add @wishlist/shared dependency to apps/web/package.json**

Add to `dependencies`:

```json
"@wishlist/shared": "workspace:*"
```

**Step 5: Update apps/web/src/data/items.ts**

Remove the `WishlistItem` and `Category` interfaces. Import from shared:

```typescript
import type { WishlistItem, Category } from "@wishlist/shared";

export type { WishlistItem, Category };

export const categories: Category[] = [
  // ... existing data unchanged
];
```

**Step 6: Update apps/web/src/hooks/usePurchaseState.ts**

Replace the local `ItemStatus` type:

```typescript
import type { ItemStatus } from "@wishlist/shared";
```

Remove the `export type ItemStatus = "shortlisted" | "purchased";` line.

**Step 7: Install and verify**

```bash
pnpm install
pnpm dev
```

Expected: App loads, no TS errors.

**Step 8: Commit**

```bash
git add -A
git commit -m "refactor: extract shared types to packages/shared"
```

---

### Task 3: Build the API app with Hono + Drizzle + Turso

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/db/schema.ts`
- Create: `apps/api/src/db/client.ts`
- Create: `apps/api/drizzle.config.ts`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/routes/categories.ts`
- Create: `apps/api/src/routes/items.ts`
- Create: `apps/api/.env.example`
- Create: `apps/api/api/index.ts` (Vercel entry point)

**Step 1: Create apps/api/package.json**

```json
{
  "name": "@wishlist/api",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/dev.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:seed": "tsx src/db/seed.ts"
  },
  "dependencies": {
    "@libsql/client": "^0.14.0",
    "drizzle-orm": "^0.38.0",
    "hono": "^4.7.0",
    "@wishlist/shared": "workspace:*"
  },
  "devDependencies": {
    "@hono/node-server": "^1.13.0",
    "drizzle-kit": "^0.30.0",
    "dotenv": "^16.4.0",
    "tsx": "^4.19.0",
    "typescript": "~5.9.3"
  }
}
```

**Step 2: Create apps/api/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

**Step 3: Create apps/api/.env.example**

```
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

**Step 4: Create apps/api/.env**

```
TURSO_DATABASE_URL=<value from Task 0 Step 4>
TURSO_AUTH_TOKEN=<value from Task 0 Step 5>
```

This file is gitignored.

**Step 5: Create apps/api/src/db/schema.ts (Drizzle schema)**

```typescript
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  purchaseDeadline: text("purchase_deadline"),
  sortOrder: integer("sort_order").default(0),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  url: text("url"),
  price: real("price"),
  imageUrl: text("image_url"),
  isPreferred: integer("is_preferred").default(0),
  notes: text("notes"), // JSON array as text
  sortOrder: integer("sort_order").default(0),
});

export const itemStatuses = sqliteTable("item_statuses", {
  itemId: text("item_id")
    .primaryKey()
    .references(() => items.id),
  status: text("status", { enum: ["shortlisted", "purchased"] }).notNull(),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});
```

**Step 6: Create apps/api/src/db/client.ts**

```typescript
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

**Step 7: Create apps/api/drizzle.config.ts**

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
```

**Step 8: Create apps/api/src/routes/categories.ts**

```typescript
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { categories, items, itemStatuses } from "../db/schema.js";

const app = new Hono();

// GET /api/categories — returns all categories with items and statuses
app.get("/", async (c) => {
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);
  const allItems = await db.select().from(items).orderBy(items.sortOrder);
  const allStatuses = await db.select().from(itemStatuses);

  const statusMap = new Map(allStatuses.map((s) => [s.itemId, s.status]));

  const result = allCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    purchaseDeadline: cat.purchaseDeadline ?? undefined,
    items: allItems
      .filter((item) => item.categoryId === cat.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url ?? undefined,
        price: item.price ?? undefined,
        imageUrl: item.imageUrl ?? undefined,
        isPreferred: item.isPreferred === 1 ? true : undefined,
        notes: item.notes ? JSON.parse(item.notes) : undefined,
        status: statusMap.get(item.id) ?? undefined,
      })),
  }));

  return c.json(result);
});

// POST /api/categories — create a category
app.post("/", async (c) => {
  const body = await c.req.json();
  const maxOrder = await db.select().from(categories);
  const sortOrder = maxOrder.length;

  await db.insert(categories).values({
    id: body.id,
    name: body.name,
    icon: body.icon,
    purchaseDeadline: body.purchaseDeadline ?? null,
    sortOrder,
  });

  return c.json({ ok: true }, 201);
});

export default app;
```

**Step 9: Create apps/api/src/routes/items.ts**

```typescript
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { items, itemStatuses } from "../db/schema.js";

const app = new Hono();

// POST /api/items — add an item
app.post("/", async (c) => {
  const body = await c.req.json();
  const existing = await db.select().from(items).where(eq(items.categoryId, body.categoryId));

  await db.insert(items).values({
    id: body.id,
    categoryId: body.categoryId,
    name: body.name,
    url: body.url ?? null,
    price: body.price ?? null,
    imageUrl: body.imageUrl ?? null,
    isPreferred: body.isPreferred ? 1 : 0,
    notes: body.notes ? JSON.stringify(body.notes) : null,
    sortOrder: existing.length,
  });

  return c.json({ ok: true }, 201);
});

// PUT /api/items/:id/status — set status
app.put("/:id/status", async (c) => {
  const itemId = c.req.param("id");
  const { status } = await c.req.json();

  await db
    .insert(itemStatuses)
    .values({ itemId, status })
    .onConflictDoUpdate({ target: itemStatuses.itemId, set: { status } });

  return c.json({ ok: true });
});

// DELETE /api/items/:id/status — clear status
app.delete("/:id/status", async (c) => {
  const itemId = c.req.param("id");
  await db.delete(itemStatuses).where(eq(itemStatuses.itemId, itemId));
  return c.json({ ok: true });
});

export default app;
```

**Step 10: Create apps/api/src/index.ts (Hono app)**

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/client.js";
import { itemStatuses } from "./db/schema.js";
import categoriesRoute from "./routes/categories.js";
import itemsRoute from "./routes/items.js";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.route("/categories", categoriesRoute);
app.route("/items", itemsRoute);

// POST /api/reset — clear all statuses
app.post("/reset", async (c) => {
  await db.delete(itemStatuses);
  return c.json({ ok: true });
});

export default app;
```

**Step 11: Create apps/api/src/dev.ts (local dev server)**

```typescript
import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./index.js";

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API running at http://localhost:${info.port}`);
});
```

**Step 12: Create apps/api/api/index.ts (Vercel entry point)**

```typescript
import { handle } from "hono/vercel";
import app from "../src/index.js";

export default handle(app);
```

**Step 13: Install dependencies**

```bash
cd apps/api && pnpm install
```

**Step 14: Commit**

```bash
git add -A
git commit -m "feat: add Hono API app with Drizzle schema and routes"
```

---

### Task 4: Database migration and seed

**Files:**
- Create: `apps/api/src/db/migrate.ts`
- Create: `apps/api/src/db/seed.ts`

**Step 1: Create apps/api/src/db/migrate.ts**

```typescript
import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./client.js";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch(console.error);
```

**Step 2: Generate and run migration**

```bash
cd apps/api
pnpm db:generate
pnpm db:migrate
```

Expected: Drizzle generates SQL migration files in `apps/api/drizzle/`. Migration runs against Turso and creates the 3 tables.

**Step 3: Create apps/api/src/db/seed.ts**

This seeds the database from the hardcoded items data:

```typescript
import "dotenv/config";
import { db } from "./client.js";
import { categories as categoriesTable, items as itemsTable } from "./schema.js";

// Inline the seed data to avoid importing from web app
const seedData = [
  {
    id: "washroom", name: "Washroom Corner Shelf", icon: "🚿", items: [
      { id: "vesken", name: "VESKEN Corner shelf unit - white 33x33x71 cm", url: "https://www.ikea.com/ca/en/p/vesken-corner-shelf-unit-white-70471092/", price: 17.99, imageUrl: "https://www.ikea.com/ca/en/images/products/vesken-corner-shelf-unit-white__0831999_pe777543_s5.jpg" },
    ],
  },
  {
    id: "sideboard", name: "Sideboard", icon: "🗄️", items: [
      { id: "lanesund", name: "LÄNESUND Sideboard - gray-brown", url: "https://www.ikea.com/ca/en/p/lanesund-sideboard-gray-brown-90466546/", price: 899.99, isPreferred: true, imageUrl: "https://www.ikea.com/ca/en/images/products/lanesund-sideboard-gray-brown__1160570_pe888966_s5.jpg", notes: ["Good size, fits the area next to the balcony window", "Storage for: dishes, kitchenware, snacks, etc.", "Look for a similar product"] },
      { id: "hauga-sideboard", name: "HAUGA Sideboard - white", url: "https://www.ikea.com/ca/en/p/hauga-sideboard-white-50596559/", price: 499.99, imageUrl: "https://www.ikea.com/ca/en/images/products/hauga-sideboard-white__1398029_pe967825_s5.jpg" },
      { id: "besta", name: "BESTÅ Storage combination with doors", url: "https://www.ikea.com/ca/en/p/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass-s59419086/", price: 700, imageUrl: "https://www.ikea.com/ca/en/images/products/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass__0979800_pe814713_s5.jpg", notes: ["Good option, costs a bit less ~$700"] },
      { id: "skruvby", name: "SKRUVBY Sideboard - white", url: "https://www.ikea.com/ca/en/p/skruvby-sideboard-white-60568725/", price: 249, imageUrl: "https://www.ikea.com/ca/en/images/products/skruvby-sideboard-white__1241237_pe919729_s5.jpg" },
    ],
  },
  {
    id: "tea-cabinet", name: "Tea Cabinet", icon: "☕", items: [
      { id: "fjaellbo", name: "FJÄLLBO Sideboard - black", url: "https://www.ikea.com/ca/en/p/fjaellbo-sideboard-black-00502799/", price: 299, imageUrl: "https://www.ikea.com/ca/en/images/products/fjaellbo-sideboard-black__1129167_pe891018_s5.jpg", notes: ["Bigger size, for coffee machine and grinder"] },
      { id: "vihals", name: "VIHALS Cabinet with sliding glass doors - white", url: "https://www.ikea.com/ca/en/p/vihals-cabinet-with-sliding-glass-doors-white-80542876/", price: 159, imageUrl: "https://www.ikea.com/ca/en/images/products/vihals-cabinet-with-sliding-glass-doors-white__1203697_pe906388_s5.jpg", notes: ["Smaller size"] },
      { id: "sagmaestare", name: "SAGMÅSTARE Cabinet - light gray-blue", url: "https://www.ikea.com/ca/en/p/sagmaestare-cabinet-light-gray-blue-90555364/", price: 129, imageUrl: "https://www.ikea.com/ca/en/images/products/sagmaestare-cabinet-light-gray-blue__1391205_pe965711_s5.jpg", notes: ["Might be too high"] },
      { id: "hauga-glass", name: "HAUGA Glass-door cabinet - gray", url: "https://www.ikea.com/ca/en/p/hauga-glass-door-cabinet-gray-80415048/", price: 279, imageUrl: "https://www.ikea.com/ca/en/images/products/hauga-glass-door-cabinet-gray__0914106_pe783848_s5.jpg", notes: ["Might be too high"] },
    ],
  },
  {
    id: "sofa-bed", name: "Sofa Bed", icon: "🛋️", items: [
      { id: "barsloev", name: "BÅRSLÖV 3-seat sofa-bed with chaise longue - beige/gray", url: "https://www.ikea.com/ca/en/p/barsloev-3-seat-sofa-bed-with-chaise-lounge-tibbleby-beige-gray-50541581/", price: 1390, imageUrl: "https://www.ikea.com/ca/en/images/products/barsloev-3-seat-sofa-bed-with-chaise-lounge-tibbleby-beige-gray__1213693_pe911220_s5.jpg" },
      { id: "morabo", name: "MORABO Loveseat with chaise - Gunnared light green/wood", url: "https://www.ikea.com/ca/en/p/morabo-loveseat-with-chaise-gunnared-light-green-wood-s89575886/", price: 1199, imageUrl: "https://www.ikea.com/ca/en/images/products/morabo-loveseat-with-chaise-gunnared-light-green-wood__0602395_pe680328_s5.jpg" },
    ],
  },
  {
    id: "guest-bed", name: "Guest Bed", icon: "🛏️", purchaseDeadline: "June/July 2026", items: [
      { id: "utaker", name: "UTÅKER Stackable bed with 2 mattresses", url: "https://www.ikea.com/ca/en/p/utaker-stackable-bed-with-2-mattresses-pine-asvang-medium-firm-s09428125/", price: 577, imageUrl: "https://www.ikea.com/ca/en/images/products/utaker-stackable-bed-with-2-mattresses-pine-asvang-medium-firm__1161848_pe889564_s5.jpg", notes: ["2 Mattress + Bed frame", "Flexible", "Can purchase no later than June/July"] },
    ],
  },
  {
    id: "drawer", name: "Drawer", icon: "👕", items: [
      { id: "lennart", name: "LENNART Drawer unit - white", url: "https://www.ikea.com/ca/en/p/lennart-drawer-unit-white-30326177/", price: 24.99, imageUrl: "https://www.ikea.com/ca/en/images/products/lennart-drawer-unit-white__0395412_pe564513_s5.jpg", notes: ["For clothing"] },
    ],
  },
  {
    id: "moving-storage", name: "Moving Storage", icon: "📦", items: [
      { id: "parkla", name: "PÄRKLA Shoe bag", url: "https://www.ikea.com/ca/en/p/paerkla-shoe-bag-30522381/", price: 0.69, imageUrl: "https://www.ikea.com/ca/en/images/products/paerkla-shoe-bag__1045872_pe842745_s5.jpg" },
      { id: "frakta", name: "FRAKTA Storage bag - blue", url: "https://www.ikea.com/ca/en/p/frakta-storage-bag-blue-90149148", price: 3.99, imageUrl: "https://www.ikea.com/ca/en/images/products/frakta-storage-bag-blue__0711261_pe728099_s5.jpg" },
    ],
  },
  {
    id: "shoe-coat-rack", name: "Shoe & Coat Rack", icon: "👟", items: [
      { id: "nipasen", name: "NIPASÈN Coat rack and bench with shoe storage - black", url: "https://www.ikea.com/ca/en/p/nipasen-coat-rack-and-bench-w-shoe-storage-black-50586145/", price: 79.99, imageUrl: "https://www.ikea.com/ca/en/images/products/nipasen-coat-rack-and-bench-w-shoe-storage-black__1390535_pe965439_s5.jpg" },
      { id: "mackapaer", name: "MACKAPÄER Coat rack with shoe storage unit - white", url: "https://www.ikea.com/ca/en/p/mackapaer-coat-rack-with-shoe-storage-unit-white-50530988/", price: 79.99, imageUrl: "https://www.ikea.com/ca/en/images/products/mackapaer-coat-rack-with-shoe-storage-unit-white__1094141_pe863318_s5.jpg" },
      { id: "alganas", name: "ÄLGANÄS Hat and coat stand - black", url: "https://www.ikea.com/ca/en/p/aelganaes-hat-and-coat-stand-black-90585894/", price: 34.99, imageUrl: "https://www.ikea.com/ca/en/images/products/aelganaes-hat-and-coat-stand-black__1358349_pe953846_s5.jpg" },
    ],
  },
  {
    id: "organiser", name: "Organiser", icon: "🗂️", items: [
      { id: "vattenkar", name: "VATTENKAR Desktop shelf - black", url: "https://www.ikea.com/ca/en/p/vattenkar-desktop-shelf-black-40541572/", price: 19.99, imageUrl: "https://www.ikea.com/ca/en/images/products/vattenkar-desktop-shelf-black__1150009_pe884317_s5.jpg", notes: ["On dining tables?"] },
      { id: "skadis", name: "SKÅDIS Pegboard - wood", url: "https://www.ikea.com/ca/en/p/skadis-pegboard-wood-10347171/", price: 24.99, imageUrl: "https://www.ikea.com/ca/en/images/products/skadis-pegboard-wood__0710684_pe727713_s5.jpg", notes: ["Pegboard for the coat rack?"] },
      { id: "palycke-basket", name: "PÅLYCKE Clip-on basket", url: "https://www.ikea.com/ca/en/p/palycke-clip-on-basket-00534432/", price: 7.99, imageUrl: "https://www.ikea.com/ca/en/images/products/palycke-clip-on-basket__1094044_pe863299_s5.jpg" },
      { id: "palycke-hook", name: "PÅLYCKE Clip-on hook rack", url: "https://www.ikea.com/ca/en/p/palycke-clip-on-hook-rack-80541155/", price: 2.49, imageUrl: "https://www.ikea.com/ca/en/images/products/palycke-clip-on-hook-rack__1093997_pe863271_s5.jpg" },
    ],
  },
];

async function seed() {
  console.log("Seeding database...");

  for (let i = 0; i < seedData.length; i++) {
    const cat = seedData[i];
    await db.insert(categoriesTable).values({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      purchaseDeadline: cat.purchaseDeadline ?? null,
      sortOrder: i,
    }).onConflictDoNothing();

    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j];
      await db.insert(itemsTable).values({
        id: item.id,
        categoryId: cat.id,
        name: item.name,
        url: item.url ?? null,
        price: item.price ?? null,
        imageUrl: item.imageUrl ?? null,
        isPreferred: item.isPreferred ? 1 : 0,
        notes: item.notes ? JSON.stringify(item.notes) : null,
        sortOrder: j,
      }).onConflictDoNothing();
    }
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
```

**Step 4: Run seed**

```bash
cd apps/api
pnpm db:seed
```

Expected: "Seeding database..." then "Seed complete."

**Step 5: Test the API locally**

```bash
pnpm dev:api
```

In another terminal:

```bash
curl http://localhost:3001/api/categories | jq '.[0]'
```

Expected: JSON response with the washroom category and its items.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add database migration and seed script"
```

---

### Task 5: Update frontend to use API instead of localStorage

**Files:**
- Modify: `apps/web/src/hooks/usePurchaseState.ts` (rewrite to use API)
- Modify: `apps/web/src/hooks/useCustomItems.ts` (rewrite to use API)
- Modify: `apps/web/src/App.tsx` (fetch categories from API on mount)
- Create: `apps/web/src/lib/api.ts` (API client)

**Step 1: Create apps/web/src/lib/api.ts**

```typescript
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getCategories: () => request<CategoryResponse[]>("/categories"),

  addItem: (item: {
    id: string;
    categoryId: string;
    name: string;
    url?: string;
    price?: number;
    imageUrl?: string;
    isPreferred?: boolean;
    notes?: string[];
  }) => request("/items", { method: "POST", body: JSON.stringify(item) }),

  setStatus: (itemId: string, status: string) =>
    request(`/items/${itemId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  clearStatus: (itemId: string) =>
    request(`/items/${itemId}/status`, { method: "DELETE" }),

  resetStatuses: () => request("/reset", { method: "POST" }),
};

interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: Array<{
    id: string;
    name: string;
    url?: string;
    price?: number;
    imageUrl?: string;
    isPreferred?: boolean;
    notes?: string[];
    status?: string;
  }>;
}
```

**Step 2: Rewrite apps/web/src/hooks/usePurchaseState.ts**

```typescript
import { useState, useCallback } from "react";
import type { ItemStatus } from "@wishlist/shared";
import { api } from "@/lib/api";

export type { ItemStatus };

export function usePurchaseState() {
  const [statuses, setStatuses] = useState<Map<string, ItemStatus>>(new Map());

  const initFromApi = useCallback((statusMap: Map<string, ItemStatus>) => {
    setStatuses(statusMap);
  }, []);

  const setStatus = useCallback((itemId: string, status: ItemStatus | null) => {
    setStatuses((prev) => {
      const next = new Map(prev);
      if (status === null || next.get(itemId) === status) {
        next.delete(itemId);
        api.clearStatus(itemId).catch(console.error);
      } else {
        next.set(itemId, status);
        api.setStatus(itemId, status).catch(console.error);
      }
      return next;
    });
  }, []);

  const resetStatuses = useCallback(() => {
    setStatuses(new Map());
    api.resetStatuses().catch(console.error);
  }, []);

  return { statuses, setStatus, resetStatuses, initFromApi };
}
```

**Step 3: Rewrite apps/web/src/hooks/useCustomItems.ts**

```typescript
import { useState, useCallback } from "react";
import type { Category, WishlistItem } from "@wishlist/shared";
import { api } from "@/lib/api";

export function useCustomItems(initialCategories: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addItem = useCallback((categoryId: string, item: WishlistItem) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, item] }
          : cat
      )
    );

    api.addItem({ ...item, categoryId }).catch(console.error);
  }, []);

  return { categories, setCategories, addItem };
}
```

**Step 4: Rewrite apps/web/src/App.tsx**

```typescript
import { useState, useMemo, useEffect } from "react";
import type { ItemStatus } from "@wishlist/shared";
import { usePurchaseState } from "@/hooks/usePurchaseState";
import { useCustomItems } from "@/hooks/useCustomItems";
import { BudgetSummary } from "@/components/BudgetSummary";
import { CategoryCard } from "@/components/CategoryCard";
import { AddItemDialog } from "@/components/AddItemDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";

type Filter = "all" | "to-buy" | "shortlisted" | "purchased";

const filterLabels: Record<Filter, string> = {
  all: "All",
  "to-buy": "To Buy",
  shortlisted: "Shortlisted",
  purchased: "Purchased",
};

function App() {
  const { statuses, setStatus, resetStatuses, initFromApi } = usePurchaseState();
  const { categories, setCategories, addItem } = useCustomItems([]);
  const [budget, setBudget] = useState(2000);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then((data) => {
      const cats = data.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        purchaseDeadline: c.purchaseDeadline,
        items: c.items.map((item) => ({
          id: item.id,
          name: item.name,
          url: item.url,
          price: item.price,
          imageUrl: item.imageUrl,
          isPreferred: item.isPreferred,
          notes: item.notes,
        })),
      }));
      setCategories(cats);

      const statusMap = new Map<string, ItemStatus>();
      for (const c of data) {
        for (const item of c.items) {
          if (item.status === "shortlisted" || item.status === "purchased") {
            statusMap.set(item.id, item.status);
          }
        }
      }
      initFromApi(statusMap);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to load data:", err);
      setLoading(false);
    });
  }, []);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch =
            !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            cat.name.toLowerCase().includes(search.toLowerCase());

          const status = statuses.get(item.id);
          const matchesFilter =
            filter === "all" ||
            (filter === "purchased" && status === "purchased") ||
            (filter === "shortlisted" && status === "shortlisted") ||
            (filter === "to-buy" && !status);

          return matchesSearch && matchesFilter;
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, filter, search, statuses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            🏠 Move-In Wishlist
          </h1>
          <p className="text-muted-foreground">
            IKEA shopping list for the new place
          </p>
        </header>

        <div className="mb-6">
          <BudgetSummary categories={categories} statuses={statuses} budget={budget} onBudgetChange={setBudget} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1">
            {(Object.keys(filterLabels) as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {filterLabels[f]}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <AddItemDialog categories={categories} onAdd={addItem} />
          {statuses.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={resetStatuses}
            >
              Reset All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              statuses={statuses}
              onSetStatus={setStatus}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items match your filters.
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
```

**Step 5: Test locally**

Run in two terminals:

Terminal 1: `pnpm dev:api`
Terminal 2: `pnpm dev`

Expected: App loads, shows items from the API. Shortlisting/purchasing an item persists across page refreshes. Opening in a second browser tab shows the same state.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: replace localStorage with API-backed data fetching"
```

---

### Task 6: Vercel deployment setup

**Files:**
- Create: `apps/api/vercel.json`
- Create: `apps/web/.env.production` (or use Vercel env vars)

**Step 1: Create apps/api/vercel.json**

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

**Step 2: Deploy API to Vercel**

```bash
cd apps/api
npx vercel --yes
```

Follow the prompts. Set the environment variables:

```bash
npx vercel env add TURSO_DATABASE_URL
npx vercel env add TURSO_AUTH_TOKEN
```

Note the deployment URL (e.g. `https://wishlist-api-xxx.vercel.app`).

**Step 3: Deploy frontend to Vercel**

```bash
cd apps/web
npx vercel --yes
```

Set the `VITE_API_URL` env var to the API deployment URL:

```bash
npx vercel env add VITE_API_URL
# value: https://wishlist-api-xxx.vercel.app/api
```

**Step 4: Redeploy frontend with env var**

```bash
npx vercel --prod
```

**Step 5: Test production**

Open the frontend URL. Verify:
- Categories and items load
- Status changes persist
- Works from multiple devices/browsers

**Step 6: Commit any remaining config**

```bash
git add -A
git commit -m "chore: add Vercel deployment config"
```

---

## Summary of tasks

| Task | Description | Commit message |
|------|-------------|---------------|
| 0 | Install Turso CLI, create DB | (no code) |
| 1 | pnpm monorepo, move app to apps/web | `refactor: convert to pnpm monorepo, move app to apps/web` |
| 2 | Extract shared types package | `refactor: extract shared types to packages/shared` |
| 3 | Hono API with Drizzle schema + routes | `feat: add Hono API app with Drizzle schema and routes` |
| 4 | DB migration + seed | `feat: add database migration and seed script` |
| 5 | Frontend API integration | `feat: replace localStorage with API-backed data fetching` |
| 6 | Vercel deployment | `chore: add Vercel deployment config` |
