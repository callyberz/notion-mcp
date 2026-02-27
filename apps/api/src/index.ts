import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/client.js";
import { itemStatuses } from "./db/schema.js";
import categoriesRoute from "./routes/categories.js";
import itemsRoute from "./routes/items.js";

const app = new Hono().basePath("/api");

app.use("*", cors());

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

app.get("/health", (c) => c.json({ ok: true }));

app.route("/categories", categoriesRoute);
app.route("/items", itemsRoute);

// POST /api/reset — clear all statuses
app.post("/reset", async (c) => {
  await db.delete(itemStatuses);
  return c.json({ ok: true });
});

export default app;
