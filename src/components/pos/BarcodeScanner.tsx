import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanBarcode, X, Keyboard } from "lucide-react";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !showManualInput) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [open, showManualInput]);

  const startScanner = async () => {
    if (!containerRef.current) return;
    
    setError(null);
    
    try {
      scannerRef.current = new Html5Qrcode("barcode-reader");
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
          onClose();
        },
        () => {}
      );
      
      setIsScanning(true);
    } catch (err) {
      setError("Camera access denied or not available. Use manual entry.");
      setShowManualInput(true);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
      onClose();
    }
  };

  const handleClose = () => {
    stopScanner();
    setManualBarcode("");
    setShowManualInput(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ScanBarcode className="w-5 h-5 text-primary" />
            Scan Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showManualInput ? (
            <>
              <div 
                id="barcode-reader" 
                ref={containerRef}
                className="w-full rounded-lg overflow-hidden bg-secondary"
                style={{ minHeight: "250px" }}
              />
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  stopScanner();
                  setShowManualInput(true);
                }}
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Enter Manually
              </Button>
            </>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                placeholder="Enter barcode number..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                autoFocus
                className="bg-secondary border-border/50"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowManualInput(false);
                    startScanner();
                  }}
                >
                  <ScanBarcode className="w-4 h-4 mr-2" />
                  Use Camera
                </Button>
                <Button type="submit" className="flex-1">
                  Add Item
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
