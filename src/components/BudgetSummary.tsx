import type { Category } from "@/data/items";
import type { ItemStatus } from "@/hooks/usePurchaseState";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BudgetSummaryProps {
  categories: Category[];
  statuses: Map<string, ItemStatus>;
  budget: number;
  onBudgetChange: (value: number) => void;
}

function pct(value: number, budget: number): string {
  if (budget <= 0) return "0";
  return ((value / budget) * 100).toFixed(1);
}

export function BudgetSummary({
  categories,
  statuses,
  budget,
  onBudgetChange,
}: BudgetSummaryProps) {
  let totalEstimated = 0;
  let shortlistedTotal = 0;
  let purchasedTotal = 0;
  let totalItems = 0;
  let shortlistedCount = 0;
  let purchasedCount = 0;

  for (const category of categories) {
    for (const item of category.items) {
      totalItems++;
      if (item.price) totalEstimated += item.price;
      const status = statuses.get(item.id);
      if (status === "shortlisted") {
        shortlistedCount++;
        if (item.price) shortlistedTotal += item.price;
      } else if (status === "purchased") {
        purchasedCount++;
        if (item.price) purchasedTotal += item.price;
      }
    }
  }

  const remaining = budget - purchasedTotal;
  const purchasedBarPct =
    budget > 0 ? Math.min((purchasedTotal / budget) * 100, 100) : 0;
  const shortlistedBarPct =
    budget > 0
      ? Math.min((shortlistedTotal / budget) * 100, 100 - purchasedBarPct)
      : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">$</span>
              <BudgetInput value={budget} onChange={onBudgetChange} />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
            <p className="text-2xl font-bold text-blue-600">
              $
              {shortlistedTotal.toLocaleString("en-CA", {
                minimumFractionDigits: 2,
              })}
              <span className="text-sm font-normal ml-1">
                {pct(shortlistedTotal, budget)}%
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purchased</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {purchasedTotal.toLocaleString("en-CA", {
                minimumFractionDigits: 2,
              })}
              <span className="text-sm font-normal ml-1">
                {pct(purchasedTotal, budget)}%
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p
              className={`text-2xl font-bold ${remaining >= 0 ? "text-orange-600" : "text-red-600"}`}
            >
              ${remaining.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purchased Items</p>
            <p className="text-2xl font-bold">
              {purchasedCount}/{totalItems}
            </p>
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
          {remaining < 0 ? (
            <div
              className="h-full bg-red-500 transition-all duration-500 w-full"
            />
          ) : (
            <>
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${purchasedBarPct}%` }}
              />
              <div
                className="h-full bg-blue-400 transition-all duration-500"
                style={{ width: `${shortlistedBarPct}%` }}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [display, setDisplay] = useState(String(value));

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
          setDisplay(raw);
          const v = Number(raw);
          if (!isNaN(v) && v >= 0) onChange(v);
        }
      }}
      onBlur={() => {
        setDisplay(String(value));
      }}
      className="w-28 text-2xl font-bold h-9 px-1"
    />
  );
}
