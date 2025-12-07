"use client";

import { useState } from "react";
import { Power, Skull } from "lucide-react";

export function KillSwitch() {
    const [armed, setArmed] = useState(false);
    const [active, setActive] = useState(false);

    const toggleSwitch = async () => {
        if (!armed) return;
        setActive(!active);
        // TODO: Call API to block pub/sub
    };

    return (
        <div className="flex flex-col gap-2 p-4 border border-red-900/50 bg-red-950/20 rounded-xl">
            <div className="flex items-center justify-between">
                <h3 className="text-red-500 font-bold text-sm tracking-wider flex items-center gap-2">
                    <Skull className="w-4 h-4" /> EMERGENCY CUTOFF
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-red-400 uppercase">{armed ? "ARMED" : "SAFE"}</span>
                    <button
                        onClick={() => setArmed(!armed)}
                        className={`w-8 h-4 rounded-full transition-colors ${armed ? "bg-red-600" : "bg-slate-700"}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-lg transform transition-transform ${armed ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                </div>
            </div>

            <button
                disabled={!armed}
                onClick={toggleSwitch}
                className={`w-full py-3 rounded border font-mono font-bold tracking-widest transition-all
          ${!armed ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed" :
                        active ? "bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]" :
                            "bg-red-950 border-red-800 text-red-500 hover:bg-red-900"}
        `}
            >
                {active ? "SYSTEM HALTED" : "KILL SIGNAL"}
            </button>
        </div>
    );
}
