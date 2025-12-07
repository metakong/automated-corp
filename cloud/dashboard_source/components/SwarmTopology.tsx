"use client";

import { motion } from "framer-motion";
import { Cloud, Server, Database, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function SwarmTopology() {
    const [traffic, setTraffic] = useState(false);

    // Simulate network traffic bursts
    useEffect(() => {
        const interval = setInterval(() => {
            setTraffic(true);
            setTimeout(() => setTraffic(false), 1000);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl relative overflow-hidden">
            <h3 className="text-slate-400 font-bold text-sm mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> LIVE TOPOLOGY
            </h3>

            <div className="flex items-center justify-between px-4 relative z-10">

                {/* CLOUD HQ NODE */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center relative z-10 group-hover:bg-blue-500/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Cloud className="w-8 h-8 text-blue-400" />
                        </div>
                        {/* Orbital Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-4px] rounded-full border border-dashed border-blue-500/20"
                        />
                        <div className="absolute inset-[-8px] rounded-full border border-blue-500/10" />
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-blue-200">HQ CORE</div>
                        <div className="text-[10px] text-blue-500 font-mono">us-central1</div>
                    </div>
                </div>

                {/* CONNECTION LINE */}
                <div className="flex-1 h-[2px] bg-slate-800 relative mx-4">
                    {/* Data Particles */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"
                        animate={{
                            left: ["0%", "100%"],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full blur-[2px]"
                        animate={{ left: ["100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* EDGE NODE (AKUMA) */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative z-10 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <Server className="w-8 h-8 text-emerald-400" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md z-0"
                        />
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-emerald-200">AKUMA</div>
                        <div className="text-[10px] text-emerald-500 font-mono">Edge Node (T3610)</div>
                    </div>
                </div>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-2">
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">Latency</div>
                    <div className="text-xs font-mono text-emerald-400">24ms</div>
                </div>
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">Packets</div>
                    <div className="text-xs font-mono text-blue-400">1.2/s</div>
                </div>
            </div>
        </div>
    );
}
