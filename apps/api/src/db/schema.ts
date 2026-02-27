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
