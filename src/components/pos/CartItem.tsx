import { CartItem as CartItemType } from "@/types/pos";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg bg-secondary/50",
      "animate-slide-up"
    )}>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-sm truncate">
          {item.name}
        </h4>
        <p className="text-muted-foreground text-xs">
          ${item.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (item.quantity === 1) {
              onRemove(item.id);
            } else {
              onUpdateQuantity(item.id, item.quantity - 1);
            }
          }}
          className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          {item.quantity === 1 ? (
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-foreground" />
          )}
        </button>
        
        <span className="w-8 text-center font-semibold text-foreground">
          {item.quantity}
        </span>
        
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>
      
      <div className="w-16 text-right">
        <span className="font-semibold text-foreground">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
