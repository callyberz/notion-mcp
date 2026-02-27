import { Hono } from "hono";
import { db } from "../db/client.js";
import { categories, items, itemStatuses } from "../db/schema.js";

const app = new Hono();

// GET /api/categories — returns all categories with items and statuses
app.get("/", async (c) => {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);
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
