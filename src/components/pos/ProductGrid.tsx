import { Product } from "@/types/pos";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onEditBarcode?: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart, onEditBarcode }: ProductGridProps) {
  return (
    <div className="pos-grid animate-slide-up">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onEditBarcode={onEditBarcode}
        />
      ))}
    </div>
  );
}
