export interface WishlistItem {
  id: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: WishlistItem[];
}

export type ItemStatus = "shortlisted" | "purchased";
