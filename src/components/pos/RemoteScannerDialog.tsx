import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Link2, Link2Off, QrCode } from "lucide-react";

interface RemoteScannerDialogProps {
  open: boolean;
  onClose: () => void;
  sessionCode: string | null;
  connectedDevices: number;
  isActive: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
}

export function RemoteScannerDialog({
  open,
  onClose,
  sessionCode,
  connectedDevices,
  isActive,
  onStartSession,
  onEndSession,
}: RemoteScannerDialogProps) {
  const scannerUrl = sessionCode
    ? `${window.location.origin}/scanner/${sessionCode}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Smartphone className="w-5 h-5 text-primary" />
            Remote Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isActive ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <Link2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Connect another device as a barcode scanner. Scanned items will
                be added to this terminal.
              </p>
              <Button onClick={onStartSession} className="w-full">
                Start Scanner Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Session Code</p>
                <div className="text-4xl font-mono font-bold tracking-widest text-primary">
                  {sessionCode}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Open this URL on your phone:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={scannerUrl}
                    className="flex-1 text-xs bg-background border border-border rounded px-2 py-1.5 text-foreground"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(scannerUrl)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectedDevices > 0 ? "bg-green-500" : "bg-muted"
                  }`}
                />
                <span className="text-muted-foreground">
                  {connectedDevices} device{connectedDevices !== 1 ? "s" : ""}{" "}
                  connected
                </span>
              </div>

              <Button
                variant="outline"
                onClick={onEndSession}
                className="w-full"
              >
                <Link2Off className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
