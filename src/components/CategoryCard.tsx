import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { Category, WishlistItem } from "@/data/items";
import type { ItemStatus } from "@/hooks/usePurchaseState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const statusStyles: Record<string, string> = {
  shortlisted: "bg-blue-50 border-blue-200",
  purchased: "bg-green-50 border-green-200",
};

const statusBadge: Record<string, { label: string; className: string }> = {
  shortlisted: {
    label: "Shortlisted",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  purchased: {
    label: "Purchased",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
};

function fireConfetti(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { x, y },
    colors: ["#22c55e", "#16a34a", "#4ade80", "#fbbf24", "#f59e0b"],
  });
}

interface CategoryCardProps {
  category: Category;
  statuses: Map<string, ItemStatus>;
  onSetStatus: (itemId: string, status: ItemStatus | null) => void;
}

export function CategoryCard({
  category,
  statuses,
  onSetStatus,
}: CategoryCardProps) {
  const allPurchased = category.items.every((item) => statuses.get(item.id) === "purchased");

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
          const status = statuses.get(item.id);
          return (
            <ItemRow
              key={item.id}
              item={item}
              status={status}
              onShortlist={() => {
                if (status === "shortlisted") {
                  onSetStatus(item.id, null);
                  toast(`Removed "${item.name}" from shortlist`, {
                    style: { backgroundColor: "#fff7ed", borderColor: "#fdba74", color: "#9a3412" },
                  });
                } else {
                  onSetStatus(item.id, "shortlisted");
                  toast(`"${item.name}" added to shortlist`, {
                    style: { backgroundColor: "#f0fdf4", borderColor: "#86efac", color: "#166534" },
                  });
                }
              }}
              onPurchase={(el) => {
                if (status === "purchased") {
                  onSetStatus(item.id, null);
                  toast(`"${item.name}" unmarked as purchased`, {
                    style: { backgroundColor: "#fff7ed", borderColor: "#fdba74", color: "#9a3412" },
                  });
                } else {
                  onSetStatus(item.id, "purchased");
                  fireConfetti(el);
                  toast(`"${item.name}" marked as purchased!`, {
                    style: { backgroundColor: "#f0fdf4", borderColor: "#86efac", color: "#166534" },
                  });
                }
              }}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

function ItemRow({
  item,
  status,
  onShortlist,
  onPurchase,
}: {
  item: WishlistItem;
  status?: ItemStatus;
  onShortlist: () => void;
  onPurchase: (el: HTMLElement) => void;
}) {
  const purchaseBtnRef = useRef<HTMLButtonElement>(null);
  const isPurchased = status === "purchased";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        status ? statusStyles[status] : "bg-background"
      }`}
    >
      <div className="flex flex-col gap-1.5 pt-1">
        <button
          type="button"
          onClick={onShortlist}
          className={`flex flex-col items-center rounded-md px-1.5 py-1 transition-all border text-center cursor-pointer ${
            status === "shortlisted"
              ? "bg-blue-100 border-blue-300 shadow-sm"
              : "border-transparent hover:bg-muted"
          }`}
          title="Shortlist"
        >
          <span className="text-2xl leading-none pointer-events-none">🛒</span>
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Buy</span>
        </button>
        <button
          ref={purchaseBtnRef}
          type="button"
          onClick={() => purchaseBtnRef.current && onPurchase(purchaseBtnRef.current)}
          className={`flex flex-col items-center rounded-md px-1.5 py-1 transition-all border text-center cursor-pointer ${
            status === "purchased"
              ? "bg-green-100 border-green-300 shadow-sm"
              : "border-transparent hover:bg-muted"
          }`}
          title="Mark as purchased"
        >
          <span className="text-2xl leading-none pointer-events-none">✅</span>
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Bought</span>
        </button>
      </div>
      {item.imageUrl && (
        <ProductImage
          src={item.imageUrl}
          alt={item.name}
          url={item.url}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-medium ${
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
          </span>
          {item.isPreferred && (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Preferred
            </Badge>
          )}
          {status && (
            <Badge className={statusBadge[status].className}>
              {statusBadge[status].label}
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
}
