"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Cpu } from "lucide-react";

export function FinancialTicker() {
    return (
        <div className="w-full bg-slate-950 border-b border-slate-800 h-8 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10" />

            <motion.div
                className="flex items-center gap-12 whitespace-nowrap px-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-12">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Cpu className="w-3 h-3 text-red-500" />
                            <span>BURN RATE:</span>
                            <span className="text-white">$0.0042/sec</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <DollarSign className="w-3 h-3 text-emerald-500" />
                            <span>REV VELOCITY:</span>
                            <span className="text-emerald-400">$0.0000/sec</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span>TOKEN EFFICIENCY:</span>
                            <span className="text-blue-400">98.2%</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span className="text-amber-500 font-bold">⚠</span>
                            <span>ORCHESTRATOR:</span>
                            <span className="text-amber-500">STANDBY</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
