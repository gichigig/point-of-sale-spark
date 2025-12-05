import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useScannerSession(onBarcodeScan: (barcode: string) => void) {
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<number>(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const generateSessionCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  }, []);

  const startSession = useCallback(() => {
    const code = generateSessionCode();
    setSessionCode(code);

    const newChannel = supabase.channel(`pos-scanner-${code}`, {
      config: {
        presence: { key: "pos-terminal" },
      },
    });

    newChannel
      .on("presence", { event: "sync" }, () => {
        const state = newChannel.presenceState();
        const deviceCount = Object.keys(state).filter(
          (key) => key !== "pos-terminal"
        ).length;
        setConnectedDevices(deviceCount);
      })
      .on("broadcast", { event: "barcode-scan" }, ({ payload }) => {
        if (payload?.barcode) {
          onBarcodeScan(payload.barcode);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await newChannel.track({ type: "terminal", joined_at: new Date().toISOString() });
        }
      });

    setChannel(newChannel);
    return code;
  }, [generateSessionCode, onBarcodeScan]);

  const endSession = useCallback(() => {
    if (channel) {
      channel.unsubscribe();
      setChannel(null);
    }
    setSessionCode(null);
    setConnectedDevices(0);
  }, [channel]);

  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [channel]);

  return {
    sessionCode,
    connectedDevices,
    startSession,
    endSession,
    isActive: !!sessionCode,
  };
}
