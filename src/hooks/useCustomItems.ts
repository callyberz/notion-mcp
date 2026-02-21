import { useState, useCallback, useMemo } from "react";
import { categories as baseCategories } from "@/data/items";
import type { Category, WishlistItem } from "@/data/items";

const STORAGE_KEY = "ikea-wishlist-custom-items";

type CustomItemsMap = Record<string, WishlistItem[]>;

function loadCustomItems(): CustomItemsMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupt data
  }
  return {};
}

export function useCustomItems() {
  const [customItems, setCustomItems] = useState<CustomItemsMap>(loadCustomItems);

  const addItem = useCallback((categoryId: string, item: WishlistItem) => {
    setCustomItems((prev) => {
      const next = { ...prev };
      next[categoryId] = [...(next[categoryId] || []), item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const categories: Category[] = useMemo(() => {
    return baseCategories.map((cat) => {
      const extras = customItems[cat.id];
      if (!extras || extras.length === 0) return cat;
      return { ...cat, items: [...cat.items, ...extras] };
    });
  }, [customItems]);

  return { categories, addItem };
}
