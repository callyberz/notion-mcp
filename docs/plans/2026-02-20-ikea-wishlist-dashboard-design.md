# IKEA Move-In Wishlist Dashboard

## Overview
A single-page React app that visualizes an IKEA purchase wishlist for moving into a new place. Serves as both a beautiful visual dashboard and an interactive checklist to track purchasing progress.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui components

## Architecture
Single-page app. All item data in a static TypeScript file (`src/data/items.ts`). Purchase state managed with `useState` and persisted to `localStorage`.

## Layout
- **Header**: "Move-In Wishlist" title + budget summary bar (total estimated cost, amount purchased, remaining)
- **Filter/controls row**: Filter by status (All / To Buy / Purchased), search box
- **Category card grid**: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

## Category Card (shadcn Card)
- Category icon + name as header
- List of product options, each with:
  - Product name linked to IKEA
  - Estimated price (where known)
  - Notes (e.g. "Good size, fits the area next to the balcony window")
  - Checkbox to mark as purchased
- Multiple options show as sub-items with a "preferred" badge on recommended ones

## Data Model
```ts
interface Item {
  id: string;
  category: string;
  categoryIcon: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
  purchaseDeadline?: string;
}
```

## Persistence
Purchase state saved to `localStorage` so it survives page refreshes.

## Source Data (from Notion)
1. Washroom corner shelf - VESKEN ($~20)
2. Hallway coat stand - ALGANAS ($~30)
3. Sideboard - 3 options: LANESUND ($900), HAUGA ($~500), BESTA ($~700)
4. Tea cabinet - 4 options: FJAELLBO, VIHALS, SAGMAESTARE, HAUGA glass door
5. Sofa Bed - BARSLOEV
6. Guest Bed - UTAKER with 2 mattresses (deadline: June/July)
7. Drawer - LENNART
8. Moving Storage - PARKLA shoe bag, FRAKTA bag
9. Shoe and coat rack - NIPASEN
10. Organiser - 4 options: VATTENKAR shelf, SKADIS pegboard, PALYCKE basket, PALYCKE hook rack
