import { useState, useMemo, useEffect } from "react";
import type { ItemStatus } from "@wishlist/shared";
import { usePurchaseState } from "@/hooks/usePurchaseState";
import { useCustomItems } from "@/hooks/useCustomItems";
import { BudgetSummary } from "@/components/BudgetSummary";
import { CategoryCard } from "@/components/CategoryCard";
import { AddItemDialog } from "@/components/AddItemDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";

type Filter = "all" | "to-buy" | "shortlisted" | "purchased";

const filterLabels: Record<Filter, string> = {
  all: "All",
  "to-buy": "To Buy",
  shortlisted: "Shortlisted",
  purchased: "Purchased",
};

function App() {
  const { statuses, setStatus, resetStatuses, initFromApi } =
    usePurchaseState();
  const { categories, setCategories, addItem } = useCustomItems([]);
  const [budget, setBudget] = useState(2000);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCategories()
      .then((data) => {
        const cats = data.map((c) => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          purchaseDeadline: c.purchaseDeadline,
          items: c.items.map((item) => ({
            id: item.id,
            name: item.name,
            url: item.url,
            price: item.price,
            imageUrl: item.imageUrl,
            isPreferred: item.isPreferred,
            notes: item.notes,
          })),
        }));
        setCategories(cats);

        const statusMap = new Map<string, ItemStatus>();
        for (const c of data) {
          for (const item of c.items) {
            if (item.status === "shortlisted" || item.status === "purchased") {
              statusMap.set(item.id, item.status);
            }
          }
        }
        initFromApi(statusMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch =
            !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            cat.name.toLowerCase().includes(search.toLowerCase());

          const status = statuses.get(item.id);
          const matchesFilter =
            filter === "all" ||
            (filter === "purchased" && status === "purchased") ||
            (filter === "shortlisted" && status === "shortlisted") ||
            (filter === "to-buy" && !status);

          return matchesSearch && matchesFilter;
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, filter, search, statuses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            🏠 Move-In Wishlist
          </h1>
          <p className="text-muted-foreground">
            IKEA shopping list for the new place
          </p>
        </header>

        <div className="mb-6">
          <BudgetSummary
            categories={categories}
            statuses={statuses}
            budget={budget}
            onBudgetChange={setBudget}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1">
            {(Object.keys(filterLabels) as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {filterLabels[f]}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <AddItemDialog categories={categories} onAdd={addItem} />
          {statuses.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={resetStatuses}
            >
              Reset All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              statuses={statuses}
              onSetStatus={setStatus}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items match your filters.
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
