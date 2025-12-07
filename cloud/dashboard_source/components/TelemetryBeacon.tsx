"use client";

import { useEffect, useState } from "react";
import { Activity, Radio } from "lucide-react";

export function TelemetryBeacon() {
    const [latency, setLatency] = useState<number | null>(null);
    const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("OFFLINE");
    const [lastPing, setLastPing] = useState<number>(0);

    useEffect(() => {
        // Poll for status every 5 seconds (Simulating Real-Time for V1)
        // In V3, this will use a WebSocket or Firestore Snapshot
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/status");
                if (res.ok) {
                    const data = await res.json();
                    if (data.active) {
                        setStatus("ONLINE");
                        setLatency(Math.floor(Math.random() * 50) + 20); // Mock latency for now
                        setLastPing(Date.now());
                    } else {
                        setStatus("OFFLINE");
                    }
                }
            } catch (e) {
                setStatus("OFFLINE");
            }
        };

        const interval = setInterval(checkStatus, 5000);
        checkStatus();
        return () => clearInterval(interval);
    }, []);

    const isOnline = status === "ONLINE";

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isOnline ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10"}`}>
            <div className="relative">
                <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                {isOnline && <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />}
            </div>
            <div className="flex flex-col">
                <span className={`text-xs font-bold ${isOnline ? "text-emerald-400" : "text-red-400"}`}>
                    {isOnline ? "AKUMA LINK ACTIVE" : "CONNECTION LOST"}
                </span>
                {isOnline && <span className="text-[10px] text-emerald-500/60 font-mono">{latency}ms • 24.5 GB/s</span>}
            </div>
            <Radio className={`w-4 h-4 ${isOnline ? "text-emerald-500" : "text-red-500"}`} />
        </div>
    );
}
