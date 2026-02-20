import type { Category } from "@/data/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: Category;
  purchased: Set<string>;
  onToggle: (itemId: string) => void;
}

export function CategoryCard({
  category,
  purchased,
  onToggle,
}: CategoryCardProps) {
  const allPurchased = category.items.every((item) => purchased.has(item.id));

  return (
    <Card className={allPurchased ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </CardTitle>
          {category.purchaseDeadline && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              By {category.purchaseDeadline}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.items.map((item) => {
          const isPurchased = purchased.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                isPurchased ? "bg-muted/50" : "bg-background"
              }`}
            >
              <Checkbox
                id={item.id}
                checked={isPurchased}
                onCheckedChange={() => onToggle(item.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    htmlFor={item.id}
                    className={`font-medium cursor-pointer ${
                      isPurchased ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </label>
                  {item.isPreferred && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Preferred
                    </Badge>
                  )}
                </div>
                {item.price && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                  </p>
                )}
                {item.notes && item.notes.length > 0 && (
                  <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                    {item.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
