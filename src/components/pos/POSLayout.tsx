import { useState, useMemo } from "react";
import { Product, CartItem } from "@/types/pos";
import { categories } from "@/data/products";
import { CategoryTabs } from "./CategoryTabs";
import { ProductGrid } from "./ProductGrid";
import { Cart } from "./Cart";
import { BarcodeScanner } from "./BarcodeScanner";
import { RemoteScannerDialog } from "./RemoteScannerDialog";
import { EditBarcodeDialog } from "./EditBarcodeDialog";
import { useScannerSession } from "@/hooks/useScannerSession";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, User, ScanBarcode, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function POSLayout() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [remoteDialogOpen, setRemoteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const { products, loading, updateProductBarcode } = useProducts();

  const handleBarcodeScan = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const {
    sessionCode,
    connectedDevices,
    startSession,
    endSession,
    isActive: isSessionActive,
  } = useScannerSession(handleBarcodeScan);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} - $${product.price.toFixed(2)}`,
      duration: 1500,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = (method: "cash" | "card") => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) * 1.08;
    
    toast({
      title: "Order Complete! 🎉",
      description: `${method === "card" ? "Card" : "Cash"} payment of $${total.toFixed(2)} processed successfully.`,
    });
    
    setCart([]);
  };

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">QuickPOS</h1>
            <p className="text-xs text-muted-foreground">Point of Sale</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{currentTime}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Cashier 1</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Search & Categories */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border/50 focus:border-primary"
                />
              </div>
              <Button
                onClick={() => setScannerOpen(true)}
                className="px-4"
                variant="outline"
              >
                <ScanBarcode className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setRemoteDialogOpen(true)}
                className="px-4"
                variant={isSessionActive ? "default" : "outline"}
              >
                <Smartphone className="w-5 h-5" />
                {isSessionActive && connectedDevices > 0 && (
                  <span className="ml-1 text-xs">{connectedDevices}</span>
                )}
              </Button>
            </div>
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Products */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={addToCart}
                onEditBarcode={setEditingProduct}
              />
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-96 p-4 border-l border-border/50">
          <Cart
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScan}
      />

      <RemoteScannerDialog
        open={remoteDialogOpen}
        onClose={() => setRemoteDialogOpen(false)}
        sessionCode={sessionCode}
        connectedDevices={connectedDevices}
        isActive={isSessionActive}
        onStartSession={startSession}
        onEndSession={endSession}
      />

      <EditBarcodeDialog
        product={editingProduct}
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={updateProductBarcode}
      />
    </div>
  );
}
