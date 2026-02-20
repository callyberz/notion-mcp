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
