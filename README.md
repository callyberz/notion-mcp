# IKEA Wishlist

A monorepo for managing IKEA wishlists, built with pnpm workspaces.

## Structure

```
apps/
  api/   — Hono API server (Drizzle + Turso)
  web/   — React frontend (Vite + Tailwind)
```

## Getting Started

```sh
pnpm install
pnpm dev        # run both apps in parallel
pnpm dev:api    # run API only
```

## API Scripts

```sh
pnpm --filter @wishlist/api db:generate   # generate Drizzle migrations
pnpm --filter @wishlist/api db:migrate    # run migrations
pnpm --filter @wishlist/api db:seed       # seed the database
```

## Deploy

```sh
pnpm deploy
```
