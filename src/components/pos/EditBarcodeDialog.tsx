import { useState } from "react";
import { Product } from "@/types/pos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditBarcodeDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: (productId: string, barcode: string) => Promise<boolean>;
}

export function EditBarcodeDialog({
  product,
  open,
  onClose,
  onSave,
}: EditBarcodeDialogProps) {
  const [barcode, setBarcode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    if (product) {
      setBarcode(product.barcode || "");
    }
  };

  const handleSave = async () => {
    if (!product) return;
    
    setSaving(true);
    const success = await onSave(product.id, barcode);
    setSaving(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle>Edit Barcode</DialogTitle>
        </DialogHeader>
        
        {product && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary">
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                ${product.price.toFixed(2)} • {product.category}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode / Item Code</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode or item code"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
