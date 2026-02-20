# IKEA Move-In Wishlist Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page React dashboard that visualizes an IKEA purchase wishlist with interactive purchase tracking.

**Architecture:** Vite + React + TypeScript SPA with shadcn/ui components. Static item data in a TS file. Purchase state in React state persisted to localStorage. Responsive category card grid layout.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS (via @tailwindcss/vite), shadcn/ui

---

### Task 1: Scaffold the Vite + React + TypeScript project

**Files:**
- Create: project scaffolded at `/Users/calvinlee/github/notion-mcp/`

**Step 1: Create Vite project**

```bash
cd /Users/calvinlee/github/notion-mcp
pnpm create vite@latest . --template react-ts
```

If prompted about existing directory, select "Ignore files and continue".

**Step 2: Install dependencies**

```bash
cd /Users/calvinlee/github/notion-mcp
pnpm install
```

**Step 3: Verify dev server starts**

```bash
pnpm dev
```

Expected: Dev server starts on localhost, no errors.

**Step 4: Initialize git and commit**

```bash
git init
git add .
git commit -m "chore: scaffold vite + react + typescript project"
```

---

### Task 2: Add Tailwind CSS and shadcn/ui

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Modify: `tsconfig.app.json`
- Modify: `src/index.css`

**Step 1: Install Tailwind CSS**

```bash
pnpm add tailwindcss @tailwindcss/vite
```

**Step 2: Replace `src/index.css` contents**

```css
@import "tailwindcss";
```

**Step 3: Add path alias to `tsconfig.json`**

Add to the root `compilerOptions`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 4: Add path alias to `tsconfig.app.json`**

Add to `compilerOptions`:
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

**Step 5: Update `vite.config.ts`**

```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Step 6: Install @types/node**

```bash
pnpm add -D @types/node
```

**Step 7: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init -d
```

Select "Neutral" as base color if prompted.

**Step 8: Add required shadcn components**

```bash
pnpm dlx shadcn@latest add card checkbox badge input button
```

**Step 9: Verify build works**

```bash
pnpm build
```

Expected: Build succeeds, no errors.

**Step 10: Commit**

```bash
git add .
git commit -m "chore: add tailwind css and shadcn/ui"
```

---

### Task 3: Create the item data file

**Files:**
- Create: `src/data/items.ts`

**Step 1: Create `src/data/items.ts`**

```typescript
export interface WishlistItem {
  id: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: WishlistItem[];
}

export const categories: Category[] = [
  {
    id: "washroom",
    name: "Washroom Corner Shelf",
    icon: "🚿",
    items: [
      {
        id: "vesken",
        name: "VESKEN Corner shelf unit - white 33x33x71 cm",
        url: "https://www.ikea.com/ca/en/p/vesken-corner-shelf-unit-white-70471092/",
        price: 17.99,
      },
    ],
  },
  {
    id: "hallway-coat",
    name: "Hallway Coat Stand",
    icon: "🧥",
    items: [
      {
        id: "alganas",
        name: "ÄLGANÄS Hat and coat stand - black",
        url: "https://www.ikea.com/ca/en/p/aelganaes-hat-and-coat-stand-black-90585894/",
        price: 34.99,
      },
    ],
  },
  {
    id: "sideboard",
    name: "Sideboard",
    icon: "🗄️",
    items: [
      {
        id: "lanesund",
        name: "LÄNESUND Sideboard - gray-brown",
        url: "https://www.ikea.com/ca/en/p/lanesund-sideboard-gray-brown-90466546/",
        price: 899.99,
        isPreferred: true,
        notes: [
          "Good size, fits the area next to the balcony window",
          "Storage for: dishes, kitchenware, snacks, etc.",
          "Look for a similar product",
        ],
      },
      {
        id: "hauga-sideboard",
        name: "HAUGA Sideboard - white",
        url: "https://www.ikea.com/ca/en/p/hauga-sideboard-white-50596559/",
        price: 499.99,
      },
      {
        id: "besta",
        name: "BESTÅ Storage combination with doors",
        url: "https://www.ikea.com/ca/en/p/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass-s59419086/",
        price: 700,
        notes: ["Good option, costs a bit less ~$700"],
      },
    ],
  },
  {
    id: "tea-cabinet",
    name: "Tea Cabinet",
    icon: "☕",
    items: [
      {
        id: "fjaellbo",
        name: "FJÄLLBO Sideboard - black",
        url: "https://www.ikea.com/ca/en/p/fjaellbo-sideboard-black-00502799/",
        notes: ["Bigger size, for coffee machine and grinder"],
      },
      {
        id: "vihals",
        name: "VIHALS Cabinet with sliding glass doors - white",
        url: "https://www.ikea.com/ca/en/p/vihals-cabinet-with-sliding-glass-doors-white-80542876/",
        notes: ["Smaller size"],
      },
      {
        id: "sagmaestare",
        name: "SAGMÅSTARE Cabinet - light gray-blue",
        url: "https://www.ikea.com/ca/en/p/sagmaestare-cabinet-light-gray-blue-90555364/",
        notes: ["Might be too high"],
      },
      {
        id: "hauga-glass",
        name: "HAUGA Glass-door cabinet - gray",
        url: "https://www.ikea.com/ca/en/p/hauga-glass-door-cabinet-gray-80415048/",
        notes: ["Might be too high"],
      },
    ],
  },
  {
    id: "sofa-bed",
    name: "Sofa Bed",
    icon: "🛋️",
    items: [
      {
        id: "barsloev",
        name: "BÅRSLÖV 3-seat sofa-bed with chaise longue - beige/gray",
        url: "https://www.ikea.com/ca/en/p/barsloev-3-seat-sofa-bed-with-chaise-lounge-tibbleby-beige-gray-50541581/",
      },
    ],
  },
  {
    id: "guest-bed",
    name: "Guest Bed",
    icon: "🛏️",
    purchaseDeadline: "June/July 2026",
    items: [
      {
        id: "utaker",
        name: "UTÅKER Stackable bed with 2 mattresses",
        url: "https://www.ikea.com/ca/en/p/utaker-stackable-bed-with-2-mattresses-pine-asvang-medium-firm-s09428125/",
        notes: [
          "2 Mattress + Bed frame",
          "Flexible",
          "Can purchase no later than June/July",
        ],
      },
    ],
  },
  {
    id: "drawer",
    name: "Drawer",
    icon: "👕",
    items: [
      {
        id: "lennart",
        name: "LENNART Drawer unit - white",
        url: "https://www.ikea.com/ca/en/p/lennart-drawer-unit-white-30326177/",
        notes: ["For clothing"],
      },
    ],
  },
  {
    id: "moving-storage",
    name: "Moving Storage",
    icon: "📦",
    items: [
      {
        id: "parkla",
        name: "PÄRKLA Shoe bag",
        url: "https://www.ikea.com/ca/en/p/paerkla-shoe-bag-30522381/",
      },
      {
        id: "frakta",
        name: "FRAKTA Storage bag - blue",
        url: "https://www.ikea.com/ca/en/p/frakta-storage-bag-blue-90149148",
      },
    ],
  },
  {
    id: "shoe-coat-rack",
    name: "Shoe & Coat Rack",
    icon: "👟",
    items: [
      {
        id: "nipasen",
        name: "NIPASÈN Coat rack and bench with shoe storage - black",
        url: "https://www.ikea.com/ca/en/p/nipasen-coat-rack-and-bench-w-shoe-storage-black-50586145/",
      },
    ],
  },
  {
    id: "organiser",
    name: "Organiser",
    icon: "🗂️",
    items: [
      {
        id: "vattenkar",
        name: "VATTENKAR Desktop shelf - black",
        url: "https://www.ikea.com/ca/en/p/vattenkar-desktop-shelf-black-40541572/",
        notes: ["On dining tables?"],
      },
      {
        id: "skadis",
        name: "SKÅDIS Pegboard - wood",
        url: "https://www.ikea.com/ca/en/p/skadis-pegboard-wood-10347171/",
        notes: ["Pegboard for the coat rack?"],
      },
      {
        id: "palycke-basket",
        name: "PÅLYCKE Clip-on basket",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-basket-00534432/",
      },
      {
        id: "palycke-hook",
        name: "PÅLYCKE Clip-on hook rack",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-hook-rack-80541155/",
      },
    ],
  },
];
```

**Step 2: Commit**

```bash
git add src/data/items.ts
git commit -m "feat: add ikea wishlist item data"
```

---

### Task 4: Build the localStorage persistence hook

**Files:**
- Create: `src/hooks/usePurchaseState.ts`

**Step 1: Create `src/hooks/usePurchaseState.ts`**

```typescript
import { useState, useCallback } from "react";

const STORAGE_KEY = "ikea-wishlist-purchased";

function loadPurchased(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {
    // ignore corrupt data
  }
  return new Set();
}

export function usePurchaseState() {
  const [purchased, setPurchased] = useState<Set<string>>(loadPurchased);

  const togglePurchased = useCallback((itemId: string) => {
    setPurchased((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { purchased, togglePurchased };
}
```

**Step 2: Commit**

```bash
git add src/hooks/usePurchaseState.ts
git commit -m "feat: add purchase state hook with localStorage persistence"
```

---

### Task 5: Build the BudgetSummary component

**Files:**
- Create: `src/components/BudgetSummary.tsx`

**Step 1: Create `src/components/BudgetSummary.tsx`**

This component shows total estimated cost, purchased total, and remaining. Uses a progress bar to visualize spending.

```typescript
import { categories } from "@/data/items";
import { Card, CardContent } from "@/components/ui/card";

interface BudgetSummaryProps {
  purchased: Set<string>;
}

export function BudgetSummary({ purchased }: BudgetSummaryProps) {
  let totalEstimated = 0;
  let purchasedTotal = 0;
  let totalItems = 0;
  let purchasedCount = 0;

  for (const category of categories) {
    for (const item of category.items) {
      totalItems++;
      if (item.price) totalEstimated += item.price;
      if (purchased.has(item.id)) {
        purchasedCount++;
        if (item.price) purchasedTotal += item.price;
      }
    }
  }

  const remaining = totalEstimated - purchasedTotal;
  const progressPercent =
    totalItems > 0 ? (purchasedCount / totalItems) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Estimated</p>
            <p className="text-2xl font-bold">
              ${totalEstimated.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purchased</p>
            <p className="text-2xl font-bold text-green-600">
              ${purchasedTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-orange-600">
              ${remaining.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="text-2xl font-bold">
              {purchasedCount}/{totalItems}
            </p>
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/BudgetSummary.tsx
git commit -m "feat: add budget summary component"
```

---

### Task 6: Build the CategoryCard component

**Files:**
- Create: `src/components/CategoryCard.tsx`

**Step 1: Create `src/components/CategoryCard.tsx`**

```typescript
import { Category } from "@/data/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: Category;
  purchased: Set<string>;
  onToggle: (itemId: string) => void;
}

export function CategoryCard({
  category,
  purchased,
  onToggle,
}: CategoryCardProps) {
  const allPurchased = category.items.every((item) => purchased.has(item.id));

  return (
    <Card className={allPurchased ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </CardTitle>
          {category.purchaseDeadline && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              By {category.purchaseDeadline}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.items.map((item) => {
          const isPurchased = purchased.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                isPurchased ? "bg-muted/50" : "bg-background"
              }`}
            >
              <Checkbox
                id={item.id}
                checked={isPurchased}
                onCheckedChange={() => onToggle(item.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    htmlFor={item.id}
                    className={`font-medium cursor-pointer ${
                      isPurchased ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </label>
                  {item.isPreferred && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Preferred
                    </Badge>
                  )}
                </div>
                {item.price && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                  </p>
                )}
                {item.notes && item.notes.length > 0 && (
                  <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                    {item.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/CategoryCard.tsx
git commit -m "feat: add category card component"
```

---

### Task 7: Build the main App with header, filters, and grid

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css` (if needed for global styles)
- Delete: `src/App.css` (unused)

**Step 1: Replace `src/App.tsx`**

```typescript
import { useState, useMemo } from "react";
import { categories } from "@/data/items";
import { usePurchaseState } from "@/hooks/usePurchaseState";
import { BudgetSummary } from "@/components/BudgetSummary";
import { CategoryCard } from "@/components/CategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Filter = "all" | "to-buy" | "purchased";

function App() {
  const { purchased, togglePurchased } = usePurchaseState();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch =
            !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            cat.name.toLowerCase().includes(search.toLowerCase());

          const matchesFilter =
            filter === "all" ||
            (filter === "purchased" && purchased.has(item.id)) ||
            (filter === "to-buy" && !purchased.has(item.id));

          return matchesSearch && matchesFilter;
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [filter, search, purchased]);

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
          <BudgetSummary purchased={purchased} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1">
            {(["all", "to-buy", "purchased"] as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "to-buy" ? "To Buy" : "Purchased"}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              purchased={purchased}
              onToggle={togglePurchased}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

**Step 2: Delete unused `src/App.css`**

```bash
rm src/App.css
```

**Step 3: Verify the app works**

```bash
pnpm dev
```

Open in browser. Should see the full dashboard with all categories, budget summary, filters, and checkboxes.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build main app with header, filters, and category grid"
```

---

### Task 8: Final polish and cleanup

**Files:**
- Remove: `src/assets/react.svg`, `public/vite.svg` (unused defaults)
- Modify: `index.html` (update title)

**Step 1: Update `index.html` title**

Change `<title>Vite + React + TS</title>` to `<title>Move-In Wishlist</title>`.

**Step 2: Remove unused Vite defaults**

```bash
rm -f src/assets/react.svg public/vite.svg
```

**Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: cleanup defaults and update page title"
```
