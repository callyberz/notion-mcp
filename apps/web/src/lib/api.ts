const API_BASE = import.meta.env.DEV ? "http://localhost:3001/api" : "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: Array<{
    id: string;
    name: string;
    url?: string;
    price?: number;
    imageUrl?: string;
    isPreferred?: boolean;
    notes?: string[];
    status?: string;
  }>;
}

export const api = {
  getCategories: () => request<CategoryResponse[]>("/categories"),

  addItem: (item: {
    id: string;
    categoryId: string;
    name: string;
    url?: string;
    price?: number;
    imageUrl?: string;
    isPreferred?: boolean;
    notes?: string[];
  }) => request("/items", { method: "POST", body: JSON.stringify(item) }),

  setStatus: (itemId: string, status: string) =>
    request(`/items/${itemId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  clearStatus: (itemId: string) =>
    request(`/items/${itemId}/status`, { method: "DELETE" }),

  resetStatuses: () => request("/reset", { method: "POST" }),
};
