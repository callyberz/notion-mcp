import { categories } from "@/data/items";
import { Card, CardContent } from "@/components/ui/card";

interface BudgetSummaryProps {
  purchased: Set<string>;
}

export function BudgetSummary({ purchased }: BudgetSummaryProps) {
  let totalEstimated = 0;
  let purchasedTotal = 0;
  let totalItems = 0;
  let purchasedCount = 0;

  for (const category of categories) {
    for (const item of category.items) {
      totalItems++;
      if (item.price) totalEstimated += item.price;
      if (purchased.has(item.id)) {
        purchasedCount++;
        if (item.price) purchasedTotal += item.price;
      }
    }
  }

  const remaining = totalEstimated - purchasedTotal;
  const progressPercent =
    totalItems > 0 ? (purchasedCount / totalItems) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Estimated</p>
            <p className="text-2xl font-bold">
              ${totalEstimated.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purchased</p>
            <p className="text-2xl font-bold text-green-600">
              ${purchasedTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-orange-600">
              ${remaining.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="text-2xl font-bold">
              {purchasedCount}/{totalItems}
            </p>
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
