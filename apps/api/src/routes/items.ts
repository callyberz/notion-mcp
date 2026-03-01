import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { items, itemStatuses } from "../db/schema.js";
import { scrapeOgImage } from "../lib/scrape-image.js";

const app = new Hono();

// POST /api/items — add an item
app.post("/", async (c) => {
  const body = await c.req.json();
  const existing = await db
    .select()
    .from(items)
    .where(eq(items.categoryId, body.categoryId));

  let imageUrl = body.imageUrl ?? null;
  if (body.url && !imageUrl) {
    imageUrl = await scrapeOgImage(body.url);
  }

  await db.insert(items).values({
    id: body.id,
    categoryId: body.categoryId,
    name: body.name,
    url: body.url ?? null,
    price: body.price ?? null,
    imageUrl,
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
