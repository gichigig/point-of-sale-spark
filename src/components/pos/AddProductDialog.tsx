import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ScanBarcode, Camera, Smartphone } from "lucide-react";
import { categories } from "@/data/products";
import { BarcodeScanner } from "./BarcodeScanner";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: { name: string; price: number; category: string; barcode?: string }) => Promise<boolean>;
  focusBarcode?: boolean;
  externalBarcode?: string;
  isRemoteScannerConnected?: boolean;
}

export function AddProductDialog({ open, onClose, onSave, focusBarcode = false, externalBarcode, isRemoteScannerConnected = false }: AddProductDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [saving, setSaving] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (focusBarcode && barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        } else if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [open, focusBarcode]);

  // Handle external barcode from remote scanner
  useEffect(() => {
    if (externalBarcode && open) {
      setBarcode(externalBarcode);
    }
  }, [externalBarcode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price || !category) return;
    
    setSaving(true);
    const success = await onSave({
      name: name.trim(),
      price: parseFloat(price),
      category,
      barcode: barcode.trim() || undefined,
    });
    setSaving(false);
    
    if (success) {
      setName("");
      setPrice("");
      setCategory("");
      setBarcode("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setPrice("");
    setCategory("");
    setBarcode("");
    onClose();
  };

  const productCategories = categories.filter(c => c.id !== "all");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Plus className="w-5 h-5 text-primary" />
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode" className="flex items-center gap-2">
              <ScanBarcode className="w-4 h-4" />
              Barcode
            </Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                ref={barcodeInputRef}
                placeholder="Scan or enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="bg-secondary border-border/50 font-mono flex-1"
              />
              {isRemoteScannerConnected ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
                  <Smartphone className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs text-primary">Scan with phone</span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setScannerOpen(true)}
                  title="Scan barcode"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <BarcodeScanner
            open={scannerOpen}
            onClose={() => setScannerOpen(false)}
            onScan={(scannedBarcode) => {
              setBarcode(scannedBarcode);
              setScannerOpen(false);
            }}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              ref={nameInputRef}
              placeholder="Enter product name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-secondary border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={saving || !name.trim() || !price || !category}
            >
              {saving ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
