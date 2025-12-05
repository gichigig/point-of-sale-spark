import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanBarcode, Keyboard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function Scanner() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!code) {
      navigate("/");
      return;
    }

    const channel = supabase.channel(`pos-scanner-${code}`, {
      config: {
        presence: { key: `scanner-${Date.now()}` },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const hasTerminal = Object.keys(state).some((key) => key === "pos-terminal");
        if (hasTerminal) {
          setStatus("connected");
        } else {
          setStatus("error");
        }
      })
      .subscribe(async (subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") {
          await channel.track({ type: "scanner", joined_at: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      stopScanner();
    };
  }, [code, navigate]);

  useEffect(() => {
    if (status === "connected" && !showManualInput) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [status, showManualInput]);

  const startScanner = async () => {
    try {
      scannerRef.current = new Html5Qrcode("mobile-scanner");
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        handleScan,
        () => {}
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
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

  const handleScan = async (barcode: string) => {
    if (channelRef.current) {
      await channelRef.current.send({
        type: "broadcast",
        event: "barcode-scan",
        payload: { barcode },
      });
      setLastScan(barcode);
      setTimeout(() => setLastScan(null), 2000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  if (status === "connecting") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Connecting to POS terminal...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Session Not Found</h2>
          <p className="text-muted-foreground">
            The scanner session is no longer active.
          </p>
          <Button onClick={() => navigate("/")}>Go to Main POS</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanBarcode className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">Remote Scanner</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle className="w-4 h-4" />
            Connected
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 space-y-4">
        {lastScan && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <p className="text-sm text-green-500">
              ✓ Scanned: <span className="font-mono font-bold">{lastScan}</span>
            </p>
          </div>
        )}

        {!showManualInput ? (
          <div className="flex-1 flex flex-col space-y-4">
            <div
              id="mobile-scanner"
              className="flex-1 rounded-lg overflow-hidden bg-secondary"
              style={{ minHeight: "300px" }}
            />
            <Button
              variant="outline"
              onClick={() => {
                stopScanner();
                setShowManualInput(true);
              }}
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Enter Manually
            </Button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="flex-1 flex flex-col space-y-4">
            <Input
              placeholder="Enter barcode number..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              autoFocus
              className="bg-secondary border-border/50 text-lg py-6"
            />
            <Button type="submit" size="lg">
              Send to POS
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowManualInput(false);
              }}
            >
              <ScanBarcode className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
