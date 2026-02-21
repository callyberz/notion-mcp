import { useState, useCallback } from "react";

export type ItemStatus = "shortlisted" | "purchased";

const STORAGE_KEY = "ikea-wishlist-purchased";
const STORAGE_KEY_V2 = "ikea-wishlist-item-status";

function loadStatuses(): Map<string, ItemStatus> {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY_V2);
    if (v2) return new Map(JSON.parse(v2));

    // Migrate v1 (Set of purchased IDs) → v2
    const v1 = localStorage.getItem(STORAGE_KEY);
    if (v1) {
      const ids: string[] = JSON.parse(v1);
      const map = new Map<string, ItemStatus>(
        ids.map((id) => [id, "purchased"]),
      );
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify([...map]));
      localStorage.removeItem(STORAGE_KEY);
      return map;
    }
  } catch {
    // ignore corrupt data
  }
  return new Map();
}

export function usePurchaseState() {
  const [statuses, setStatuses] =
    useState<Map<string, ItemStatus>>(loadStatuses);

  const setStatus = useCallback((itemId: string, status: ItemStatus | null) => {
    setStatuses((prev) => {
      const next = new Map(prev);
      if (status === null || next.get(itemId) === status) {
        next.delete(itemId);
      } else {
        next.set(itemId, status);
      }
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const resetStatuses = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_V2);
    setStatuses(new Map());
  }, []);

  return { statuses, setStatus, resetStatuses };
}
