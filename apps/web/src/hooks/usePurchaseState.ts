import { useState, useCallback } from "react";
import type { ItemStatus } from "@wishlist/shared";
import { api } from "@/lib/api";

export type { ItemStatus };

export function usePurchaseState() {
  const [statuses, setStatuses] = useState<Map<string, ItemStatus>>(new Map());

  const initFromApi = useCallback((statusMap: Map<string, ItemStatus>) => {
    setStatuses(statusMap);
  }, []);

  const setStatus = useCallback((itemId: string, status: ItemStatus | null) => {
    setStatuses((prev) => {
      const next = new Map(prev);
      if (status === null || next.get(itemId) === status) {
        next.delete(itemId);
        api.clearStatus(itemId).catch(console.error);
      } else {
        next.set(itemId, status);
        api.setStatus(itemId, status).catch(console.error);
      }
      return next;
    });
  }, []);

  const resetStatuses = useCallback(() => {
    setStatuses(new Map());
    api.resetStatuses().catch(console.error);
  }, []);

  return { statuses, setStatus, resetStatuses, initFromApi };
}
