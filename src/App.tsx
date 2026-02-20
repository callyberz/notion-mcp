import { useState, useMemo } from "react";
import { categories } from "@/data/items";
import { usePurchaseState } from "@/hooks/usePurchaseState";
import { BudgetSummary } from "@/components/BudgetSummary";
import { CategoryCard } from "@/components/CategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Filter = "all" | "to-buy" | "purchased";

function App() {
  const { purchased, togglePurchased } = usePurchaseState();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch =
            !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            cat.name.toLowerCase().includes(search.toLowerCase());

          const matchesFilter =
            filter === "all" ||
            (filter === "purchased" && purchased.has(item.id)) ||
            (filter === "to-buy" && !purchased.has(item.id));

          return matchesSearch && matchesFilter;
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [filter, search, purchased]);

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
          <BudgetSummary purchased={purchased} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1">
            {(["all", "to-buy", "purchased"] as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "to-buy" ? "To Buy" : "Purchased"}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              purchased={purchased}
              onToggle={togglePurchased}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
