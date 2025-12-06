import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/pos";
import { useToast } from "@/hooks/use-toast";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;

      setProducts(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          category: p.category,
          barcode: p.barcode || undefined,
          image: p.image || undefined,
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductBarcode = async (productId: string, barcode: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ barcode: barcode || null })
        .eq("id", productId);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, barcode: barcode || undefined } : p
        )
      );

      toast({
        title: "Barcode updated",
        description: "Product barcode has been saved",
      });

      return true;
    } catch (error) {
      console.error("Error updating barcode:", error);
      toast({
        title: "Error",
        description: "Failed to update barcode",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    updateProductBarcode,
    refetch: fetchProducts,
  };
}
