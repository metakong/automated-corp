"use client";

import { useState } from "react";
import { Check, X, Clock, FileCode, Search, ShieldAlert } from "lucide-react";

interface InboxItemProps {
    id: string;
    type: string;
    payload: any;
    created_at: number;
    onAction: (id: string, action: "APPROVED" | "REJECTED") => void;
}

export function InboxItem({ id, type, payload, created_at, onAction }: InboxItemProps) {
    const [processing, setProcessing] = useState(false);

    const handleAction = async (action: "APPROVED" | "REJECTED") => {
        setProcessing(true);
        await onAction(id, action);
        setProcessing(false); // Parent should remove this item from view usually
    };

    const Icon = type === "CODE_MOD" ? FileCode : type === "RESEARCH" ? Search : ShieldAlert;

    return (
        <div className="flex flex-col gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-400">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-200">{type} REQUEST</h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(created_at).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    Pending Approval
                </div>
            </div>

            <div className="bg-black/50 p-3 rounded border border-slate-800/50 font-mono text-xs text-slate-400 overflow-x-auto">
                <pre>{JSON.stringify(payload, null, 2)}</pre>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <button
                    onClick={() => handleAction("APPROVED")}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase disabled:opacity-50 transition-all"
                >
                    <Check className="w-3 h-3" /> Approve
                </button>
                <button
                    onClick={() => handleAction("REJECTED")}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded bg-rose-950 border border-rose-900 text-rose-500 hover:bg-rose-900 text-xs font-bold uppercase disabled:opacity-50 transition-all"
                >
                    <X className="w-3 h-3" /> Reject
                </button>
            </div>
        </div>
    );
}
