import { FileText, Search, Activity, Code } from 'lucide-react';

interface PayloadRendererProps {
    type: string;
    payload: any;
}

export function PayloadRenderer({ type, payload }: PayloadRendererProps) {

    if (type === "SYSTEM_CHECK") {
        return (
            <div className="flex flex-col gap-1 w-full bg-emerald-950/20 p-2 rounded border-l-2 border-emerald-500">
                <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Objective
                </label>
                <div className="text-sm text-emerald-100 font-medium pl-4">
                    {payload.msg || "Routine Diagnostics"}
                </div>
            </div>
        );
    }

    if (type === "RESEARCH") {
        return (
            <div className="flex flex-col gap-1 w-full bg-blue-950/20 p-2 rounded border-l-2 border-blue-500">
                <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1">
                    <Search className="w-3 h-3" /> Research Topic
                </label>
                <div className="text-sm text-blue-100 font-medium pl-4 italic">
                    "{payload.query || "No query specified"}"
                </div>
            </div>
        );
    }

    if (type === "CODE_MOD") {
        return (
            <div className="flex flex-col gap-3 w-full bg-amber-950/20 p-3 rounded border-l-2 border-amber-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-amber-500/10 rounded">
                            <FileText className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-amber-500/70">Target</div>
                            <div className="text-xs font-mono text-amber-100">{payload.target}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-amber-500/70">Action</div>
                        <div className="text-xs font-mono text-white bg-amber-500/20 px-2 py-0.5 rounded uppercase">{payload.operation}</div>
                    </div>
                </div>

                {payload.content && (
                    <div className="mt-1">
                        <div className="text-[10px] uppercase font-bold text-slate-500/70 mb-1">Preview</div>
                        <div className="text-xs text-slate-400 font-mono bg-black/80 p-3 rounded border border-slate-800 overflow-hidden whitespace-pre-wrap max-h-24">
                            {payload.content}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Fallback for Unknown Types
    return (
        <pre className="text-xs text-slate-500 font-mono overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
        </pre>
    );
}
