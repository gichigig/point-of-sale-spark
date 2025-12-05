import { Product } from "@/types/pos";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className={cn(
        "group relative flex flex-col items-center justify-center p-4 rounded-xl",
        "bg-card border border-border/50 hover:border-primary/50",
        "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        "min-h-[140px] text-center"
      )}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      
      <div className="mb-2 text-3xl">
        {getCategoryEmoji(product.category)}
      </div>
      
      <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
        {product.name}
      </h3>
      
      <p className="text-primary font-semibold">
        ${product.price.toFixed(2)}
      </p>
    </button>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    coffee: "☕",
    food: "🥪",
    drinks: "🥤",
    desserts: "🍰",
  };
  return emojis[category] || "📦";
}
