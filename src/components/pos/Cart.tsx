import { CartItem as CartItemType } from "@/types/pos";
import { CartItemComponent } from "./CartItem";
import { ShoppingCart, CreditCard, Banknote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (method: "cash" | "card") => void;
}

export function Cart({ items, onUpdateQuantity, onRemove, onClearCart, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Current Order</h2>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {itemCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {/* Items */}
      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No items in cart</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Summary & Actions */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border/50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onCheckout("cash")}
              variant="secondary"
              className="h-12 font-semibold"
            >
              <Banknote className="w-5 h-5 mr-2" />
              Cash
            </Button>
            <Button
              onClick={() => onCheckout("card")}
              className="h-12 font-semibold bg-primary hover:bg-primary/90"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Card
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
