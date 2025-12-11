import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

const STORAGE_KEY = "pos-scanner-session";

export function useScannerSession(onBarcodeScan: (barcode: string) => void) {
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<number>(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const onBarcodeScanRef = useRef(onBarcodeScan);

  // Keep ref updated
  useEffect(() => {
    onBarcodeScanRef.current = onBarcodeScan;
  }, [onBarcodeScan]);

  const generateSessionCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  }, []);

  const connectToSession = useCallback((code: string) => {
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
          onBarcodeScanRef.current(payload.barcode);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await newChannel.track({ type: "terminal", joined_at: new Date().toISOString() });
        }
      });

    setChannel(newChannel);
    setSessionCode(code);
  }, []);

  const startSession = useCallback(() => {
    const code = generateSessionCode();
    localStorage.setItem(STORAGE_KEY, code);
    connectToSession(code);
    return code;
  }, [generateSessionCode, connectToSession]);

  const endSession = useCallback(() => {
    if (channel) {
      channel.unsubscribe();
      setChannel(null);
    }
    localStorage.removeItem(STORAGE_KEY);
    setSessionCode(null);
    setConnectedDevices(0);
  }, [channel]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    if (savedCode && !sessionCode) {
      connectToSession(savedCode);
    }
  }, [connectToSession, sessionCode]);

  // Cleanup on unmount
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
