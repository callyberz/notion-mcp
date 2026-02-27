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
