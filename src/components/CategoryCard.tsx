import { useState } from "react";
import type { Category } from "@/data/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

function ProductImage({ src, alt, url }: { src: string; alt: string; url?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  const img = (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {img}
      </a>
    );
  }

  return img;
}

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
              {item.imageUrl && (
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  url={item.url}
                />
              )}
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
