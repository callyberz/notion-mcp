import { useState, useCallback } from "react";
import type { Category, WishlistItem } from "@wishlist/shared";
import { api } from "@/lib/api";

export function useCustomItems(initialCategories: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addItem = useCallback((categoryId: string, item: WishlistItem) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, item] } : cat,
      ),
    );

    api.addItem({ ...item, categoryId }).catch(console.error);
  }, []);

  return { categories, setCategories, addItem };
}
